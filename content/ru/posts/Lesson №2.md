+++
title = "C# + Revit API: Урок 2 — Биты и байты, таблица ASCII, указатели и структуры — Программирование 101"
date = 2025-09-22T00:00:00+03:00
draft = true
tags = ["C#", "RevitAPI", "Tutorial"]
cover.image = "/images/Pasted image 20250902204629.png"
cover.alt = "Биты, байты и таблица ASCII"
+++

#### Рекомендация: Посмотрите курс [CS50](https://pll.harvard.edu/course/cs50-introduction-computer-science) от Гарвардского Университета или [Бесплатный курс по C# от BIMTeam на Stepik](https://t.me/bimteamnews/1974) от компании ПИК, чтобы глубже понять основы программирования.

1. **Истина и ложь (true/false)**
    
    В программах мы часто проверяем условия. Например: «если труба длиннее 10 м — сделать стык». Это условие может быть только **истинным (true)** или **ложным (false)**.
    
2. **Истина и ложь (0 и 1)**
    
    Компьютеру непонятны слова _true/false_, он всё хранит как числа. Поэтому **true = 1**, а **false = 0**.
    
3. **Двоичная система (base-2)**
    
    Вся информация в компьютере хранится в виде комбинаций **нулей и единиц**. Это называется двоичная система счисления. Для нас это 0 и 1, а для процессора — есть ток (1) или нет тока (0).
    

> В итоге: программист пишет _true/false_, а компьютер внутри работает только с **0 и 1**.


---

## **Как работает двоичная запись числа**

  

В компьютере каждое число хранится в виде **нулей и единиц** (битов). Каждая позиция в записи — это степень числа 2.

  

Пример: двоичное число 101

```
Биты (число):         1   0   1
Позиции (степени 2):  2   1   0
Значения степеней:    4   2   1
--------------------------------
Результат:            4   0   1   => 5
```

Расчёт:

- первая 1 = 2^2 = 4
    
- 0 = пропускаем
    
- последняя 1 = 2^0 = 1

**Итого: 4 + 1 = 5**

---

📌 Каждый 0 или 1 — это **бит (bit)**.

📌 8 битов = **1 байт (byte)**.

📌 Память компьютера адресуется по байтам.

---

## Таблица ASCII: как байты превращаются в буквы

> Компьютер хранит всё в виде чисел. Чтобы эти числа имели для нас смысл, придумали таблицу **ASCII** — она сопоставляет числам - буквы, цифры и знаки.

#### Например, число **48** в таблице ASCII соответствует символу '0':
```bash
ASCII 48 = символ '0' = 110000

Бинарное число:    1  1 0 0 0 0
Степени двойки:   32 16 8 4 2 1
Результат:        32 16 0 0 0 0 = 48

1 * 2^4 = 16
1 * 2^5 = 32
16 + 32 = 48
48 соответствует '0' (в таблице ASCII)
```


## [ASCII Table](https://www.freecodecamp.org/news/ascii-table-hex-to-ascii-value-character-code-chart-2/?utm_source=chatgpt.com)
![Pasted image 20250922160146.png](</images/Pasted image 20250922160146.png>)
# Указатели и структуры (из мира C)

- `Указатель` (pointer) — это шестнадцатеричный адрес в памяти компьютера.
- В `C` программист сам управляет памятью: выделяет/освобождает и следит за корректностью.
- В `C#` этим занимается сборщик мусора (GC - Garbage Collector): большинство рутины скрыто.
- `Указатели` и `структуры` (`pointers` & `structs`) позволяют «сшивать» байты в цепочки — например, делать списки, где элементы лежат рядом или связаны ссылками.
- В `C#` мы обычно работаем с `классами`/`структурами` и `ссылками`, а памятью управляет `CLR` — _Common Language Runtime_ (Общеязыковая исполняющая среда).


### Что такое ссылка?

- **Ссылка (reference)** — это не сами данные, а «указатель» на то место в памяти, где эти данные лежат.  
- Можно представить как адрес квартиры: у тебя в руках не квартира, а бумажка с адресом, по которой ты находишь квартиру.

Пример на C#:

```C#
int a = 10;          // переменная хранит значение "10"
int b = a;           // b = копия значения "10"

int[] arr1 = {1,2};  // arr1 хранит ссылку на массив
int[] arr2 = arr1;   // arr2 указывает на тот же массив
arr2[0] = 99;        // меняем через arr2
Console.WriteLine(arr1[0]); // выведет 99, потому что это один и тот же объект
```

### 📊 Разбор на примере двусвязного списка

У нас есть три узла (`структуры`/`объекты`):

#### Узел 1 (первый)
- `Object`: данные (например, 10)
- `Null`: нет предыдущего — это начало списка
- `Pointer to next`: ссылка на Узел 2

#### Узел 2 (середина)
- `Object`: данные (например, 20)
- `Pointer to previous`: ссылка на Узел 1
- `Pointer to next`: ссылка на Узел 3

#### Узел 3 (последний)
- `Object`: данные (например, 30)
- `Pointer to previous`: ссылка на Узел 2
- `Null`: нет следующего — это конец

### 🔁 Зачем так делать?

Двусвязный список позволяет:
- двигаться вперёд и назад по элементам;
- легко вставлять/удалять элементы в середине (без «сдвига» массива).

 > В итоге: указатели — это как «стрелочки» между элементами. В C программист рисует и двигает их сам, а в C# за это отвечает CLR.

#### 📊 Пример: двусвязный список (ASCII-схема)
```C
[ null ] <- [10] <-> [20] <-> [30] -> [ null ]
```

Чуть подробнее с указателями:

```C
null    10       20       30    null
  |      |        |        |      |
  |    next →   next →   next →   |
  |   ← prev   ← prev   ← prev    |
```

Так видно, что каждый узел хранит данные + две ссылки: на предыдущий и на следующий элемент.


## Код: сначала `C`, затем `C#`

Закрепим:

- В `C` программист работает напрямую с указателями и вручную управляет памятью (`malloc`, `free`).  
- В `C#` мы используем ссылки и классы, а памятью управляет CLR и сборщик мусора (GC).  

По сути, структура данных одна и та же, но уровень «ручного труда» разный:  
в `C` — всё в руках программиста, в `C#` — большая часть рутины скрыта.

### `C`
```C
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node* prev;
    struct Node* next;
} Node;

int main() {
    // Создаём 3 узла
    Node* first  = malloc(sizeof(Node));
    Node* second = malloc(sizeof(Node));
    Node* third  = malloc(sizeof(Node));

    // Значения
    first ->value = 10;
    second->value = 20;
    third ->value = 30;

    // Связи
    first->prev = NULL;
    first->next = second;

    second->prev = first;
    second->next = third;

    third->prev = second;
    third->next = NULL;

    // Печать
    printf("Forward: %d -> %d -> %d\n", 
            first->value, 
            second->value, 
            third->value);
    printf("Backward: %d <- %d <- %d\n", 
            third->value, 
            second->value, 
            first->value);

    // Освобождение
    free(third);
    free(second);
    free(first);

    return 0;
}
```

### `C#`
```C#
using System;

class Node
{
    public int Value;
    public Node? Prev;
    public Node? Next;
}

class Program
{
    static void Main()
    {
        // Создаём 3 узла
        var first  = new Node { Value = 10 };
        var second = new Node { Value = 20 };
        var third  = new Node { Value = 30 };

        // Связи
        first.Next  = second;
        second.Prev = first;
        second.Next = third;
        third.Prev  = second;

        // Проход вперёд
        Console.WriteLine("Forward:");
        for (var current = first; current != null; current = current.Next)
            Console.Write(current.Value + " ");
        
        Console.WriteLine("\nBackward:");
        for (var current = third; current != null; current = current.Prev)
            Console.Write(current.Value + " ");
    }
}
```

### 🧠 Вставка и удаление в связном списке

В связном списке важны две базовые операции: **вставка** нового элемента и **удаление** существующего.  

Они работают не с самим массивом, а только со «стрелочками» (ссылками/указателями), которые соединяют узлы между собой.


---

## ➕ Вставка

> Хотим добавить новый узел (со значением 15) между `first` и `second`.

До:

```C
first <-> second
```

После вставки нового узла (значение 15):

```C
first <-> newNode (15) <-> second
```

**Что делаем:**  
1. Создаём новый узел.  
2. Настраиваем «стрелку» (`next`) у `first` на `newNode`.  
3. Настраиваем «стрелку» (`prev`) у `second` на `newNode`.  
4. Указываем у `newNode` его `prev = first` и `next = second`.  

👉 По сути, мы просто перенастроили ссылки, добавив новый элемент в цепочку.

---

## ➖ Удаление

Теперь удалим узел `second` из середины списка.

Например, удалим `second`:

До:

```C
first <-> second <-> third
```

После:

```C
first <-> third
```

**Что делаем:**  
1. Перенастраиваем `first.next = third`.  
2. Перенастраиваем `third.prev = first`.  
3. В **C** обязательно освобождаем память для `second` вручную (`free`).  
   В **C#** про это заботится сборщик мусора (GC).  

👉 Мы ничего не «двигаем» и не копируем, как в массиве. Просто меняем ссылки — и список работает по-новому.

---
## ✅ Цель

> Вставим узел со значением `15` между `first` (10) и `second` (20), а затем удалим его.

---

## 🧱 Код на `C`

### 🔧 Вставка

```C
// Вставка между first и second
Node* newNode  = malloc(sizeof(Node));
newNode->value = 15;

// Связываем новый узел
newNode->prev = first;
newNode->next = second;

// Обновляем существующие связи
first->next  = newNode;
second->prev = newNode;
```

### ❌ Удаление

```C
// Удаляем newNode (15)
first->next  = second;
second->prev = first;

// Освобождаем память
free(newNode);
```

---

## 🧱 Код на `C#`

### 🔧 Вставка

```C#
// Вставка между first и second
var newNode = new Node { Value = 15 };

// Связываем новый узел
newNode.Prev = first;
newNode.Next = second;

// Обновляем существующие связи
first.Next  = newNode;
second.Prev = newNode;
```

### ❌ Удаление

```C#
// Удаляем newNode (15)
first.Next  = second;
second.Prev = first;

// В C# память управляется автоматически (GC)
// free() вызывать не нужно
```

---

### ✅ Итоги

| Операция | C                                 | C#                                   |
| -------- | --------------------------------- | ------------------------------------ |
| Вставка  | `malloc` + 4 указателя            | `new` + 4 ссылки                     |
| Удаление | 2 указателя + `free()` удаляемого | 2 ссылки, сборщик мусора очистит сам |



---

# Домашнее задание

Соберите маленькое консольное приложение, чтобы закрепить биты/байты, ASCII и списки:

1) Бинарное → Десятичное → ASCII
- Напишите `BinaryToDecimal(string bits)` — преобразует бинарную строку (например, `"110000"`) в `int`.
- Напишите `AsciiFromBinary(string bits)` — возвращает соответствующий символ `char`.
- По входной строке `"01001000 01101001"` выведите `"Hi"`.

2) Двусвязный список (C#)
- Реализуйте минимальный `DoublyLinkedList<T>` с внутренним узлом `Node` (поля `Prev`, `Next`, `Value`).
- Поддержите `AddLast`, `InsertAfter(node, value)` и `Remove(node)`.
- Продемонстрируйте: соберите `10 <-> 20 <-> 30`, вставьте `15` между 10 и 20, выведите вперёд/назад, затем удалите `15` и снова выведите.

3) Коротко объясните (2–3 предложения)
- Когда массивы удобнее списков и наоборот.
- Что в C требует ручного управления памятью, а в C# делает CLR/GC.

---

# Решение

{{< collapse title="Показать/Скрыть Код" >}}

## `Project Solution`
```bash
Solution
|-> Lesson02.Console
    |-> Program.cs
```

## `Program.cs`
```C#
using System;
using System.Collections.Generic;

namespace Lesson02.ConsoleApp
{
    class Program
    {
        static void Main()
        {
            // 1) Декодирование ASCII из двоичного
            string message = DecodeBinaryMessage("01001000 01101001"); // Hi
            System.Console.WriteLine(message);

            // 2) Демонстрация двусвязного списка
            var list = new DoublyLinkedList<int>();
            var n10 = list.AddLast(10);
            var n20 = list.AddLast(20);
            var n30 = list.AddLast(30);

            var n15 = list.InsertAfter(n10, 15);

            System.Console.WriteLine("Forward : " + string.Join(" ", list.Forward()));
            System.Console.WriteLine("Backward: " + string.Join(" ", list.Backward()));

            list.Remove(n15);
            System.Console.WriteLine("After remove 15 → Forward : " + string.Join(" ", list.Forward()));
            System.Console.WriteLine("After remove 15 → Backward: " + string.Join(" ", list.Backward()));
        }

        // --- Часть 1: Биты/ASCII ---
        public static int BinaryToDecimal(string bits)
        {
            int value = 0;
            foreach (char c in bits)
            {
                if (c == '0' || c == '1')
                {
                    value = (value << 1) + (c - '0');
                }
            }
            return value;
        }

        public static char AsciiFromBinary(string bits)
        {
            return (char)BinaryToDecimal(bits);
        }

        public static string DecodeBinaryMessage(string spacedBits)
        {
            var parts = spacedBits.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var chars = new List<char>(parts.Length);
            foreach (var p in parts)
                chars.Add(AsciiFromBinary(p));
            return new string(chars.ToArray());
        }
    }

    // --- Часть 2: Двусвязный список ---
    public class DoublyLinkedList<T>
    {
        public class Node
        {
            public T Value;
            public Node? Prev;
            public Node? Next;
            internal Node(T value) { Value = value; }
        }

        private Node? head;
        private Node? tail;

        public Node AddLast(T value)
        {
            var node = new Node(value);
            if (tail == null)
            {
                head = tail = node;
            }
            else
            {
                tail.Next = node;
                node.Prev = tail;
                tail = node;
            }
            return node;
        }

        public Node InsertAfter(Node existing, T value)
        {
            var node = new Node(value);
            var next = existing.Next;
            existing.Next = node;
            node.Prev = existing;
            node.Next = next;
            if (next != null) next.Prev = node; else tail = node;
            return node;
        }

        public void Remove(Node node)
        {
            if (node.Prev != null) node.Prev.Next = node.Next; else head = node.Next;
            if (node.Next != null) node.Next.Prev = node.Prev; else tail = node.Prev;
            node.Prev = node.Next = null;
        }

        public IEnumerable<T> Forward()
        {
            for (var cur = head; cur != null; cur = cur.Next)
                yield return cur.Value;
        }

        public IEnumerable<T> Backward()
        {
            for (var cur = tail; cur != null; cur = cur.Prev)
                yield return cur.Value;
        }
    }
}
```

## Примечания
- Массивы удобны для случайного доступа по индексу и компактной памяти; списки — для частых вставок/удалений в середине без «сдвига» элементов.
- В C нужно вручную `malloc`/`free` и управлять указателями; в C# память и ссылки обслуживает CLR/GC.

{{< /collapse >}}



# Домашнее задание — разбор и объяснение

Ниже объяснение, зачем нужна каждая часть кода.

---

## 1) Работа с битами и ASCII

### Методы
- **`BinaryToDecimal(string bits)`**  
  Переводит двоичную строку в десятичное число через сдвиг:  
```csharp
value = (value << 1) + (c - '0');
```

Это закрепляет принцип: каждая новая цифра в base-2 = умножение на 2 и добавление текущего бита.

- `AsciiFromBinary`(string bits)
    
    Превращает число в символ: (char)BinaryToDecimal(bits).
    
    Здесь мы видим связь с таблицей ASCII — байт = буква или знак.
    
- `DecodeBinaryMessage`("`01001000` `01101001`") → "Hi"
    
    Разбивает строку на байты, переводит каждый и собирает в текст.
    
    Показывает, что двоичные наборы напрямую соответствуют символам.
    

  

### **Зачем это нужно?**

  

Закрепить фундаментальную идею: **компьютер хранит буквы как числа, а числа — как комбинации битов**.


## 2) Двусвязный список (`DoublyLinkedList<T>`)

  

### **Структура**

- Внутренний класс `Node` хранит:
    
    - Value — данные,
        
    - Prev — ссылка на предыдущий узел,
        
    - Next — ссылка на следующий узел.
        
    
- Поля head и tail — быстрый доступ к началу и концу списка.
    

  

### **Методы**

- `AddLast`
    
    Добавляет новый узел в конец. Если список пустой — и head, и tail указывают на новый элемент.
    
- `InsertAfter`(existing, value)
    
    Вставляет узел после указанного: перенастраивает ссылки у трёх элементов (existing, newNode, next).
    
- `Remove`(node)
    
    Удаляет узел: корректирует ссылки у соседей, обновляет head/tail, обнуляет ссылки удаляемого (помогает GC).
    
    В C пришлось бы ещё вызывать free, но в C# этим займётся **сборщик мусора**.
    
- `Forward()` / `Backward()`
    
    Перебор элементов в обе стороны: вперёд по Next, назад по Prev.
    
    Это ключевое преимущество двусвязного списка.
    

  

### **Зачем это нужно?**

> Закрепить понятие «ссылки/указатели» на практике. В C# мы работаем с ссылками, а `CLR` и `GC` берут на себя управление памятью.

---

## 3) Массивы vs списки и `C` vs `C#`

- `Массивы`
    
    Удобны для быстрого случайного доступа O(1) и компактного хранения. Но вставки/удаления в середине требуют сдвига элементов.
    
- `Списки`
    
    Удобны для частых вставок и удалений. Но доступ по индексу медленнее (O(n)).
    
- `C` vs `C#`
    
    - В `C`: ручное управление памятью (malloc/free), явные указатели.
        
    - В `C#`: ссылки, памятью управляют `CLR` и `GC`.
        
    

---

## **Вывод**

- Логика и прогрессия **от простого к сложному** — удачная.
    
- Каждая часть кода «подсвечивает» теоретические объяснения.
    
- Задание даёт целостную картину: от битов до структур данных и модели памяти.