type Vec2 = [number, number];

interface IMovable {
  rotate(radians: number): void;
  move(x: number, y: number): void;
}

class LaserSprite implements IMovable {
  angle = 0;
  x = 0;
  y = 0;
  speed = 6;
  rotate(radians: number) { this.angle = radians; }
  move(x: number, y: number) { this.x = x; this.y = y; }
  update() { this.x += Math.cos(this.angle) * this.speed; this.y += Math.sin(this.angle) * this.speed; }
}

class PooledItem {
  active = false;
  item = new LaserSprite();
}

abstract class ShootingStrategy {
  abstract shoot(position: Vec2, lasers: PooledItem[]): void;
}

class SingleShootingStrategy extends ShootingStrategy {
  shoot(position: Vec2, lasers: PooledItem[]) {
    const laser = lasers.find(l => !l.active);
    if (!laser) return;
    laser.active = true;
    laser.item.rotate(0);
    laser.item.move(position[0] + 50, position[1]);
  }
}

class BurstShootingStrategy extends ShootingStrategy {
  constructor(public count = 3, public spread = Math.PI / 4) { super(); }
  shoot(position: Vec2, lasers: PooledItem[]) {
    for (let i = 0; i < this.count; i++) {
      const laser = lasers.find(l => !l.active);
      if (!laser) return;
      laser.active = true;
      const angle = -this.spread + (2 * this.spread * (this.count === 1 ? 0 : i)) / Math.max(1, (this.count - 1));
      laser.item.rotate(angle);
      laser.item.move(position[0] + 50, position[1]);
    }
  }
}

// Define the function type
type InitShooterFunction = (opts: { mountId: string; strategy?: 'single'|'burst'; count?: number; spread?: number }) => void;

function makeButton(text: string, onClick: () => void) {
  const b = document.createElement('button');
  b.textContent = text;
  b.style.marginRight = '8px';
  b.onclick = onClick;
  return b;
}

const initShooter: InitShooterFunction = ({ mountId, strategy = 'burst', count = 3, spread = Math.PI / 4 }) => {
  const mount = document.getElementById(mountId)!;
  mount.innerHTML = '';

  const ui = document.createElement('div');
  ui.style.margin = '0 0 8px';
  const canvas = document.createElement('canvas');
  canvas.width = 640; canvas.height = 320;
  canvas.style.border = '1px solid var(--border, #ccc)';
  canvas.style.background = 'var(--code-bg, #0b0b0b0d)';
  mount.append(ui, canvas);

  const ctx = canvas.getContext('2d')!;
  const lasers: PooledItem[] = Array.from({ length: 128 }, () => new PooledItem());
  let current: ShootingStrategy = strategy === 'single'
    ? new SingleShootingStrategy()
    : new BurstShootingStrategy(count, spread);

  const info = document.createElement('span');
  info.textContent = `Mode: ${strategy === 'single' ? 'Single' : `Burst(${count}, spread=${spread.toFixed(2)})`}`;
  info.style.marginLeft = '8px';

  ui.append(
    makeButton('Single', () => { current = new SingleShootingStrategy(); info.textContent = 'Mode: Single'; }),
    makeButton('Burst', () => { current = new BurstShootingStrategy(count, spread); info.textContent = `Mode: Burst(${count}, spread=${spread.toFixed(2)})`; }),
    info
  );

  const ship: Vec2 = [60, canvas.height / 2];
  let tick = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ship
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(ship[0], ship[1]);
    ctx.lineTo(ship[0] - 20, ship[1] - 12);
    ctx.lineTo(ship[0] - 20, ship[1] + 12);
    ctx.closePath();
    ctx.fill();

    // fire every ~15 ticks
    if ((tick++ % 15) === 0) current.shoot(ship, lasers);

    // update/draw lasers
    ctx.fillStyle = '#ef4444';
    for (const l of lasers) {
      if (!l.active) continue;
      l.item.update();
      ctx.beginPath();
      ctx.arc(l.item.x, l.item.y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (l.item.x < -10 || l.item.x > canvas.width + 10 || l.item.y < -10 || l.item.y > canvas.height + 10) {
        l.active = false;
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
};

// Auto-initialize any embeds present (progressively enhance)
(() => {
  function bootAll() {
    const nodes = document.querySelectorAll<HTMLElement>('.shooter-embed');
    nodes.forEach(node => {
      const mountId = node.id;
      const strategy = (node.getAttribute('data-strategy') || 'burst') as 'single' | 'burst';
      const count = parseInt(node.getAttribute('data-count') || '3', 10);
      const spread = parseFloat(node.getAttribute('data-spread') || `${Math.PI / 4}`);
      if (mountId) {
        initShooter({ mountId, strategy, count, spread });
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();
