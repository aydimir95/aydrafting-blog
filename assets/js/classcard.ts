// C# Class Learning Game - Interactive Tutorial
type Vec2 = [number, number];

// Helper function for rounded rectangles (cross-browser compatible)
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

interface IGameObject {
  x: number;
  y: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

class ClassCard implements IGameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  properties: string[];
  methods: string[];
  isSelected: boolean = false;
  isActive: boolean = false;
  animationTime: number = 0;
  pulseScale: number = 1;
  fadeIn: number = 0;

  constructor(x: number, y: number, title: string, properties: string[], methods: string[]) {
    this.x = x;
    this.y = y;
    this.width = 280;
    this.height = 180;
    this.title = title;
    this.properties = properties;
    this.methods = methods;
    this.fadeIn = 0;
  }

  update() {
    if (!this.isActive) return;
    this.animationTime += 0.016;
    this.pulseScale = 1 + Math.sin(this.animationTime * 3) * 0.02;
    if (this.fadeIn < 1) this.fadeIn += 0.05;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive || this.fadeIn <= 0) return;
    
    ctx.save();
    ctx.textAlign = 'left';
    ctx.globalAlpha = this.fadeIn;
    ctx.translate(this.x, this.y);
    ctx.scale(this.pulseScale, this.pulseScale);
    // Card background
    ctx.fillStyle = this.isSelected ? '#3b82f6' : '#ffffff';
    ctx.strokeStyle = this.isSelected ? '#1d4ed8' : '#d1d5db';
    ctx.lineWidth = this.isSelected ? 3 : 2;
    
    // Use custom rounded rectangle function
    drawRoundedRect(ctx, 0, 0, this.width, this.height, 12);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = this.isSelected ? '#ffffff' : '#111827';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText(`Class: ${this.title}`, 15, 25);

    // Properties section
    ctx.fillStyle = this.isSelected ? '#e0e7ff' : '#f3f4f6';
    ctx.fillRect(10, 35, this.width - 20, 60);
    ctx.fillStyle = this.isSelected ? '#ffffff' : '#374151';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText('Properties:', 15, 50);
    
    this.properties.forEach((prop, i) => {
      ctx.fillStyle = this.isSelected ? '#ffffff' : '#4b5563';
      ctx.font = '11px monospace';
      ctx.fillText(prop, 20, 65 + i * 15);
    });

    // Methods section
    ctx.fillStyle = this.isSelected ? '#e0e7ff' : '#f3f4f6';
    ctx.fillRect(10, 105, this.width - 20, 60);
    ctx.fillStyle = this.isSelected ? '#ffffff' : '#374151';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText('Methods:', 15, 120);
    
    this.methods.forEach((method, i) => {
      ctx.fillStyle = this.isSelected ? '#ffffff' : '#4b5563';
      ctx.font = '11px monospace';
      ctx.fillText(method, 20, 135 + i * 15);
    });

    ctx.restore();
  }

  containsPoint(x: number, y: number): boolean {
    const scale = this.pulseScale || 1;
    return x >= this.x && x <= this.x + this.width * scale &&
           y >= this.y && y <= this.y + this.height * scale;
  }
}

class InterfaceCard implements IGameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  requirements: string[];
  isSelected: boolean = false;
  isVisible: boolean = false;
  animationTime: number = 0;
  glowIntensity: number = 0;
  fadeIn: number = 0;
  slideIn: number = 0;

  constructor(x: number, y: number, name: string, requirements: string[]) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 120;
    this.name = name;
    this.requirements = requirements;
    this.fadeIn = 0;
    this.slideIn = 0;
  }

  update() {
    this.animationTime += 0.016;
    this.glowIntensity = Math.sin(this.animationTime * 2) * 0.5 + 0.5;
    if (this.isVisible && this.fadeIn < 1) this.fadeIn += 0.08;
    if (this.isVisible && this.slideIn < 1) this.slideIn += 0.1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isVisible || this.fadeIn <= 0) return;
    
    ctx.save();
    ctx.textAlign = 'left';
    ctx.globalAlpha = this.fadeIn;
    ctx.translate(this.x + (1 - this.slideIn) * 50, this.y);
    // Glow effect
    if (this.isSelected) {
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 20 * this.glowIntensity;
    }
    
    // Card background
    ctx.fillStyle = this.isSelected ? '#8b5cf6' : '#f3f4f6';
    ctx.strokeStyle = this.isSelected ? '#7c3aed' : '#d1d5db';
    ctx.lineWidth = this.isSelected ? 3 : 2;
    
    // Use custom rounded rectangle function
    drawRoundedRect(ctx, 0, 0, this.width, this.height, 12);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = this.isSelected ? '#ffffff' : '#111827';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText(`Interface: ${this.name}`, 15, 20);

    // Requirements
    ctx.fillStyle = this.isSelected ? '#ffffff' : '#374151';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('Must have:', 15, 40);
    
    this.requirements.forEach((req, i) => {
      ctx.fillStyle = this.isSelected ? '#e0e7ff' : '#4b5563';
      ctx.font = '10px monospace';
      ctx.fillText(req, 20, 55 + i * 15);
    });

    ctx.restore();
  }

  containsPoint(x: number, y: number): boolean {
    if (!this.isVisible) return false;
    const offsetX = (1 - this.slideIn) * 50;
    const left = this.x + offsetX;
    const right = left + this.width;
    const top = this.y;
    const bottom = top + this.height;
    return x >= left && x <= right && y >= top && y <= bottom;
  }
}

class GameState {
  cards: ClassCard[] = [];
  interfaces: InterfaceCard[] = [];
  currentClassIndex: number = 0;
  selectedCard: ClassCard | null = null;
  score: number = 0;
  level: number = 1;
  gamePhase: 'tutorial' | 'play' | 'complete' = 'tutorial';
  messages: string[] = [];
  messageTimer: number = 0;
  correctInterfaces: string[] = [];
  canvasWidth: number = 800;
  canvasHeight: number = 600;
  contentHeightNeeded: number = 0;
  wrongAttempts: number = 0;
  correctIndexInTrio: number[] = [1, 0, 2, 2, 1];

  constructor() {
    this.initializeGame();
  }

  setCanvasSize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  getContentHeight(): number {
    return this.contentHeightNeeded || this.canvasHeight;
  }

  initializeGame() {
    // Create class cards with matching interfaces
    this.cards = [
      new ClassCard(0, 100, 'Dog', ['string Name', 'int Age', 'string Breed'], ['Bark()', 'Fetch()', 'Sleep()']),
      new ClassCard(0, 100, 'Car', ['string Model', 'int Year', 'string Color'], ['Start()', 'Stop()', 'Drive()']),
      new ClassCard(0, 100, 'Book', ['string Title', 'string Author', 'int Pages'], ['Read()', 'Close()', 'Bookmark()']),
      new ClassCard(0, 100, 'Person', ['string Name', 'int Age', 'string Email'], ['Work()', 'Eat()', 'Sleep()']),
      new ClassCard(0, 100, 'Computer', ['string Brand', 'int RAM', 'string OS'], ['TurnOn()', 'TurnOff()', 'Process()'])
    ];

    // Create interface cards for each class (1 correct, 2 distractors)
    this.interfaces = [
      // Dog - 1 correct (IPet), 2 distractors
      new InterfaceCard(50, 350, 'IVehicle', ['Model', 'Year', 'Start', 'Stop']),
      new InterfaceCard(300, 350, 'IPet', ['Name', 'Age', 'Fetch']), // correct
      new InterfaceCard(550, 350, 'IReadable', ['Title', 'Read']),
      
      // Car - 1 correct (IVehicle)
      new InterfaceCard(50, 350, 'IVehicle', ['Model', 'Year', 'Start', 'Stop']), // correct
      new InterfaceCard(300, 350, 'IAnimal', ['Name', 'Age', 'Bark']),
      new InterfaceCard(550, 350, 'IReadable', ['Title', 'Read']),
      
      // Book - 1 correct (IReadable)
      new InterfaceCard(50, 350, 'IPet', ['Name', 'Age', 'Fetch']),
      new InterfaceCard(300, 350, 'IVehicle', ['Model', 'Drive']),
      new InterfaceCard(550, 350, 'IReadable', ['Title', 'Author', 'Read']), // correct
      
      // Person - 1 correct (ILiving)
      new InterfaceCard(50, 350, 'IDevice', ['Brand', 'TurnOn', 'TurnOff']),
      new InterfaceCard(300, 350, 'IWorker', ['Name', 'Work']),
      new InterfaceCard(550, 350, 'ILiving', ['Age', 'Eat', 'Sleep']), // correct
      
      // Computer - 1 correct (IDevice)
      new InterfaceCard(50, 350, 'IVehicle', ['Model', 'Drive']),
      new InterfaceCard(300, 350, 'IDevice', ['Brand', 'TurnOn', 'TurnOff']), // correct
      new InterfaceCard(550, 350, 'IAnimal', ['Name', 'Age', 'Bark'])
    ];

    this.messages = [
      "Welcome to C# Class Builder! 🎮",
      "Click on the class card to start",
      "Then choose the 1 interface it implements correctly"
    ];

    this.showCurrentClass();
  }

  showCurrentClass() {
    // Ensure canvas dimensions are set
    if (this.canvasWidth <= 0 || this.canvasHeight <= 0) {
      this.canvasWidth = 800;
      this.canvasHeight = 600;
    }

    this.wrongAttempts = 0;
    // Hide all classes except current one
    this.cards.forEach((card, index) => {
      card.isActive = index === this.currentClassIndex;
      card.fadeIn = index === this.currentClassIndex ? 0 : 0;
    });

    // Show current class in center
    const currentCard = this.cards[this.currentClassIndex];
    if (currentCard) {
      currentCard.x = Math.max(20, (this.canvasWidth - currentCard.width) / 2);
      // Keep the card closer to the top so there is room for a single-column stack
      currentCard.y = Math.min(100, Math.max(24, Math.floor(this.canvasHeight * 0.15)));
      currentCard.isActive = true;
      currentCard.fadeIn = 0; // Start fade in
    }

    // Hide all interfaces initially
    this.interfaces.forEach(iface => {
      iface.isVisible = false;
      iface.fadeIn = 0;
      iface.slideIn = 0;
    });

    // Set correct interfaces for current class
    this.setCorrectInterfaces();
  }

  setCorrectInterfaces() {
    const classIndex = this.currentClassIndex;
    const startIndex = classIndex * 3;
    
    // Ensure canvas dimensions are set
    if (this.canvasWidth <= 0 || this.canvasHeight <= 0) {
      this.canvasWidth = 800;
      this.canvasHeight = 600;
    }

    // Decide columns based on viewport width (canvas is capped, so use window width when available)
    const total = 3;
    const viewport = (typeof window !== 'undefined' && window.innerWidth)
      ? window.innerWidth
      : this.canvasWidth;
    let cols = viewport < 1000 ? 1 : 3;
    const rows = Math.ceil(total / cols);

    let maxBottom = 0;
    const currentCard = this.cards[this.currentClassIndex];
    if (currentCard) {
      maxBottom = Math.max(maxBottom, currentCard.y + currentCard.height);
    }

    // Show the 3 interfaces for current class
    for (let i = 0; i < 3; i++) {
      const iface = this.interfaces[startIndex + i];
      if (iface) {
        iface.isVisible = true;
        const margin = 20;
        const cardW = 200;
        // Calculate grid position
        const col = cols === 1 ? 0 : i % cols;
        const row = cols === 1 ? i : Math.floor(i / cols);
        // Calculate horizontal spacing
        let x: number;
        if (cols === 1) {
          // Centered single column
          x = Math.max(margin, (this.canvasWidth - cardW) / 2);
        } else {
          // Spread evenly across canvas width
          const innerWidth = Math.max(0, this.canvasWidth - margin * 2 - cardW * cols);
          const spacing = Math.max(10, innerWidth / (cols + 1));
          x = margin + spacing * (col + 1) + cardW * col;
        }
        // Calculate vertical position
        let y: number;
        if (cols === 1) {
          // Stack vertically
          const totalHeight = rows * iface.height + (rows - 1) * 20;
          y = Math.max(300, (this.canvasHeight - totalHeight) / 2) + row * (iface.height + 20);
        } else {
          y = Math.max(300, this.canvasHeight - 200);
        }
        iface.x = x;
        iface.y = y;
        iface.fadeIn = 0; // Reset fade for animation
        iface.slideIn = 0; // Reset slide for animation
        maxBottom = Math.max(maxBottom, iface.y + iface.height);
      }
    }
    this.contentHeightNeeded = Math.ceil(Math.max(360, Math.min(1200, maxBottom + 80)));
  }

  update() {
    this.cards.forEach(card => card.update());
    this.interfaces.forEach(iface => iface.update());
    
    if (this.messageTimer > 0) {
      this.messageTimer -= 0.016;
    }
  }

  handleClick(x: number, y: number) {
    // If game is complete, restart on any click
    if (this.gamePhase === 'complete') {
      this.restartGame();
      return;
    }

    // Check interface clicks first
    for (const iface of this.interfaces) {
      if (iface.containsPoint(x, y)) {
        this.selectInterface(iface);
        return;
      }
    }

    // Check class card clicks
    for (const card of this.cards) {
      if (card.containsPoint(x, y) && card.isActive) {
        this.selectClass(card);
        return;
      }
    }

    // Clear selection if clicking empty space
    this.clearSelection();
  }

  restartGame() {
    this.currentClassIndex = 0;
    this.score = 0;
    this.level = 1;
    this.gamePhase = 'tutorial';
    this.selectedCard = null;
    this.wrongAttempts = 0;
    this.clearSelection();
    this.showCurrentClass();
    this.showMessage('Game restarted! Click on the class to begin.');
  }

  selectClass(card: ClassCard) {
    this.clearSelection();
    card.isSelected = true;
    this.selectedCard = card;
    this.showMessage(`Selected: ${card.title}. Now choose 1 interface it implements!`);
  }

  selectInterface(iface: InterfaceCard) {
    if (!this.selectedCard) return;

    iface.isSelected = !iface.isSelected; // Toggle selection
    
    // Count selected interfaces
    const selectedCount = this.interfaces.filter(i => i.isSelected).length;
    
    if (selectedCount === 1) {
      this.checkInterfaceSelection();
    } else if (selectedCount > 1) {
      iface.isSelected = false;
      this.showMessage(`❌ You can only select 1 interface.`);
    } else {
      this.showMessage(`Selected ${selectedCount}/1 interface. Select 1.`);
    }
  }

  checkInterfaceSelection() {
    const selectedInterfaces = this.interfaces.filter(i => i.isSelected);
    const classIndex = this.currentClassIndex;
    const startIndex = classIndex * 3;
    const correct = this.interfaces[startIndex + this.correctIndexInTrio[classIndex]];

    if (selectedInterfaces.length !== 1) {
      this.showMessage(`❌ Please select exactly 1 interface!`);
      return;
    }

    const isCorrect = selectedInterfaces[0] === correct;

    if (isCorrect) {
      const attempts = this.wrongAttempts;
      const award = attempts === 0 ? 100 : (attempts === 1 ? 50 : 0);
      this.score += award;
      const pointsText = award > 0 ? ` (+${award})` : ` (+0)`;
      this.showMessage(`✅ Correct! ${this.selectedCard!.title} implements that interface.${pointsText}`);
      this.level++;
      this.nextClass();
    } else {
      this.wrongAttempts = Math.min(2, this.wrongAttempts + 1);
      this.showMessage(`❌ Not quite right. ${this.wrongAttempts === 1 ? 'One more try for 50 points.' : 'Further tries give 0 points.'}`);
      this.clearInterfaceSelection();
    }
  }

  clearInterfaceSelection() {
    this.interfaces.forEach(iface => iface.isSelected = false);
  }

  nextClass() {
    this.currentClassIndex++;
    if (this.currentClassIndex >= this.cards.length) {
      this.gamePhase = 'complete';
      this.showMessage('🎉 Congratulations! You have mastered all C# classes!');
      // Hide all cards and interfaces when complete
      this.cards.forEach(card => card.isActive = false);
      this.interfaces.forEach(iface => iface.isVisible = false);
    } else {
      this.clearSelection();
      this.showCurrentClass();
      this.showMessage(`Great! Now let's work with: ${this.cards[this.currentClassIndex].title}`);
    }
  }

  clearSelection() {
    this.cards.forEach(card => card.isSelected = false);
    this.interfaces.forEach(iface => iface.isSelected = false);
    this.selectedCard = null;
  }

  showMessage(text: string) {
    this.messages = [text];
    this.messageTimer = 3;
  }
}

class GameRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameState: GameState;

  constructor(canvas: HTMLCanvasElement, gameState: GameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gameState = gameState;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const styles = getComputedStyle(this.canvas);
    const CC_BG = (styles.getPropertyValue('--cc-canvas-bg') || '#f8fafc').trim();
    const CC_PROGRESS = (styles.getPropertyValue('--cc-progress') || '#64748b').trim();
    const CC_SCORE = (styles.getPropertyValue('--cc-score') || '#059669').trim();
    const CC_MESSAGE = (styles.getPropertyValue('--cc-message') || '#1e293b').trim();
    const CC_INSTRUCTION = (styles.getPropertyValue('--cc-instruction') || '#64748b').trim();
    
    // Draw background
    this.ctx.fillStyle = CC_BG;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw progress indicator
    this.ctx.fillStyle = CC_PROGRESS;
    this.ctx.font = 'bold 14px system-ui';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Class ${this.gameState.currentClassIndex + 1} of ${this.gameState.cards.length}`, this.canvas.width / 2, 30);
    
    // Draw score
    this.ctx.fillStyle = CC_SCORE;
    this.ctx.font = 'bold 16px system-ui';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Score: ${this.gameState.score}`, this.canvas.width - 20, 30);
    this.ctx.textAlign = 'left';

    // Draw game objects
    this.gameState.cards.forEach(card => card.draw(this.ctx));
    this.gameState.interfaces.forEach(iface => iface.draw(this.ctx));

    // Draw completion screen
    if (this.gameState.gamePhase === 'complete') {
      this.drawCompletionScreen();
      return;
    }

    // Draw messages
    if (this.gameState.messageTimer > 0) {
      this.ctx.fillStyle = CC_MESSAGE;
      this.ctx.font = 'bold 16px system-ui';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.gameState.messages[0], this.canvas.width / 2, this.canvas.height - 40);
    }

    // Draw instructions
    this.ctx.fillStyle = CC_INSTRUCTION;
    this.ctx.font = '14px system-ui';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Click the class, then select 1 matching interface!', this.canvas.width / 2, this.canvas.height - 20);
  }

  drawCompletionScreen() {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Completion message
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 32px system-ui';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🎉 Congratulations!', this.canvas.width / 2, this.canvas.height / 2 - 60);
    
    this.ctx.font = 'bold 24px system-ui';
    this.ctx.fillText('You have mastered all C# classes!', this.canvas.width / 2, this.canvas.height / 2 - 20);
    
    this.ctx.font = 'bold 20px system-ui';
    this.ctx.fillText(`Final Score: ${this.gameState.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    // Restart instruction
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '16px system-ui';
    this.ctx.fillText('Click anywhere to restart', this.canvas.width / 2, this.canvas.height / 2 + 60);
  }
}

// Main game class
class ClassBuilderGame {
  canvas: HTMLCanvasElement;
  gameState: GameState;
  renderer: GameRenderer;
  isRunning: boolean = false;

  constructor(mountElement: HTMLElement) {
    try {
      // Get container dimensions for adaptive sizing
      const container = mountElement;
      const containerWidth = container.clientWidth || 800;
      const rawWidth = containerWidth - 40;
      const safeWidth = Math.max(320, Math.min(800, rawWidth));
      const safeHeight = Math.min(600, Math.max(360, safeWidth * 0.75));
      
      this.canvas = document.createElement('canvas');
      this.canvas.width = safeWidth;
      this.canvas.height = safeHeight;
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';
      
      mountElement.appendChild(this.canvas);
      
      // Verify canvas context is available
      const ctx = this.canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }
      
      this.gameState = new GameState();
      this.gameState.setCanvasSize(this.canvas.width, this.canvas.height);
      this.renderer = new GameRenderer(this.canvas, this.gameState);
      
      this.setupEventListeners();
      this.gameState.showCurrentClass();
      this.adjustCanvasToContent();
      this.start();
    } catch (error) {
      console.error('Error in ClassBuilderGame constructor:', error);
      mountElement.innerHTML = '<div style="padding: 20px; text-align: center; color: #ef4444;">Game initialization failed. Please refresh the page.</div>';
    }
  }

  setupEventListeners() {
    try {
      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.gameState.handleClick(x, y);
      });

      // Add resize handler for responsive design with fallback
      if (typeof ResizeObserver !== 'undefined') {
        try {
          const resizeObserver = new ResizeObserver(() => {
            this.handleResize();
          });
          resizeObserver.observe(this.canvas.parentElement!);
        } catch (error) {
          console.warn('ResizeObserver failed, using fallback:', error);
          // Fallback to window resize
          window.addEventListener('resize', () => this.handleResize());
        }
      } else {
        // Fallback for older browsers
        window.addEventListener('resize', () => this.handleResize());
      }
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  private adjustCanvasToContent() {
    const desired = Math.max(360, Math.min(1200, this.gameState.getContentHeight()));
    if (desired !== this.canvas.height) {
      this.canvas.height = desired;
      this.gameState.setCanvasSize(this.canvas.width, this.canvas.height);
      // Recompute positions once with the new height
      this.gameState.showCurrentClass();
    }
  }

  handleResize() {
    const container = this.canvas.parentElement!;
    const containerWidth = container.clientWidth || this.canvas.width + 40;
    const rawWidth = containerWidth - 40;
    const safeWidth = Math.max(320, Math.min(800, rawWidth));
    const safeHeight = Math.min(600, Math.max(360, safeWidth * 0.75));
    
    this.canvas.width = safeWidth;
    this.canvas.height = safeHeight;
    
    // Update game state with new dimensions
    this.gameState.setCanvasSize(this.canvas.width, this.canvas.height);
    
    // Reposition current class and interfaces
    this.gameState.showCurrentClass();
    this.adjustCanvasToContent();
  }

  start() {
    this.isRunning = true;
    // Small delay to ensure everything is properly initialized
    setTimeout(() => {
      this.gameLoop();
    }, 100);
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    try {
      this.gameState.update();
      this.renderer.render();
      
      requestAnimationFrame(() => this.gameLoop());
    } catch (error) {
      console.error('Error in game loop:', error);
      // Stop the game if there's an error
      this.stop();
    }
  }

  stop() {
    this.isRunning = false;
  }
}

// Auto-initialize the game
(() => {
  function bootGame() {
    try {
      console.log('BootGame: Starting game initialization...');
      const gameElements = document.querySelectorAll<HTMLElement>('.class-card-embed');
      console.log('BootGame: Found', gameElements.length, 'game elements');
      
      gameElements.forEach((node, index) => {
        try {
          console.log(`BootGame: Initializing game ${index + 1}...`);
          const title = node.getAttribute('data-title') || 'C# Classes';
          const props = (node.getAttribute('data-props') || '').split('|').map(s => s.trim()).filter(Boolean);
          const ctors = (node.getAttribute('data-ctors') || '').split('|').map(s => s.trim()).filter(Boolean);
          const methods = (node.getAttribute('data-methods') || '').split('|').map(s => s.trim()).filter(Boolean);
          
          console.log(`BootGame: Game ${index + 1} data:`, { title, props, ctors, methods });
          
          // Create the game with error handling
          new ClassBuilderGame(node);
          console.log(`BootGame: Game ${index + 1} created successfully`);
        } catch (error) {
          console.error(`Error creating game ${index + 1}:`, error);
          // Fallback: show error message
          node.innerHTML = '<div style="padding: 20px; text-align: center; color: #ef4444;">Game failed to load. Please refresh the page.</div>';
        }
      });
    } catch (error) {
      console.error('Error in bootGame:', error);
    }
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    console.log('BootGame: DOM loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', bootGame);
  } else {
    console.log('BootGame: DOM ready, starting with delay...');
    // Small delay to ensure everything is properly initialized
    setTimeout(bootGame, 100);
  }
})();