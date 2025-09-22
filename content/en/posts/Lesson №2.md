+++
title = "C# + Revit API: Lesson 2 - Bits & Bytes, ASCII Table, Pointers & Structs -> Programming 101"
date = 2025-09-22T00:00:00+03:00
draft = true
tags = ["C#", "RevitAPI", "Tutorial"]
cover.image = "/images/Pasted image 20250902204629.png"
cover.alt = "Bits & Bytes & ASCII Table"
+++
#### Recommendation: Take the [CS50 Course](https://pll.harvard.edu/course/cs50-introduction-computer-science) from Harvard University, or the [Free C# Course by BIMTeam on Stepik](https://t.me/bimteamnews/1974) (by PIK), to build a solid foundation.
1. True and False (true/false)

   In programs we often check conditions. For example: "if the pipe is longer than 10 m — make a joint." A condition can only be either true or false.

2. True and False (0 and 1)

   Computers don’t understand the words true/false — everything is stored as numbers. So true = 1, and false = 0.

3. Binary system (base‑2)

   All information in a computer is stored as combinations of zeros and ones. For us it’s 0 and 1; for the processor it’s the presence of current (1) or the absence of current (0).


> In the end: a programmer writes true/false, but the computer internally works only with 0 and 1.


```bash
1 0 1
x x x
4 2 1 = 5 
	
In other words:
2 2 2
x x x
2 1 0
	 
4 2 1 = 5 
1 0 1
```


---

## How binary notation works

In a computer, every number is stored as bits — 0s and 1s. Each position is a power of 2.

Example: the binary number 101

```
Bits (number):         1   0   1
Positions (powers):    2   1   0
Powers of two:         4   2   1
--------------------------------
Result:                4   0   1   => 5
```

Calculation:

- first 1 = 2^2 = 4
- 0 = skip
- last 1 = 2^0 = 1

Total: 4 + 1 = 5

—

• Each 0 or 1 is a bit.  
• 8 bits = 1 byte.  
• Memory is addressed in bytes.

## `ASCII Tables` bring meaning to what various bytes represent:

ASCII maps integers to characters so raw 0s and 1s can represent letters, digits, and punctuation.

#### For example, the number 48 in the ASCII table corresponds to the character '0':

```bash
ASCII 48 = 0
(00) 110000
1 * 2^4 = 16
1 * 2^5 = 32
16 + 32 = 48
48 = 0 (in ASCII Table)
```

## [ASCII Table](https://www.freecodecamp.org/news/ascii-table-hex-to-ascii-value-character-code-chart-2/?utm_source=chatgpt.com)
![Pasted image 20250922160146.png](</images/Pasted image 20250922160146.png>)
# Pointers and Structs (from `C`)

- `Pointers` are hexadecimal based values that identify an address in computer memory.
- If you write in `C`, you need to manage `pointers` and check memory in and out as you work.
- `C#` bypasses this using a `garbage collector (GC)`.
- `Pointers` and `structs` allow us to connect bytes into lists. We can also array objects adjacently.
- In `C#`, we typically work with `classes`/`structs` and `references`; the `CLR (Common Language Runtime)` manages memory for us.

### What is a reference?

- A reference is not the data itself, but a pointer to where the data lives in memory.  
- Think of it like an address: you hold a note with the address, not the apartment itself.

Example in C#:

```C#
int a = 10;          // variable holds the value 10
int b = a;           // b gets a copy of the value 10

int[] arr1 = {1,2};  // arr1 holds a reference to the array
int[] arr2 = arr1;   // arr2 points to the same array
arr2[0] = 99;        // modify through arr2
Console.WriteLine(arr1[0]); // prints 99, same underlying object
```

### 📊 Breakdown

#### Struct 1 (First Node):
- `Object`: Data (e.g., 10)
- `Null`: No previous node — this is the **start** of the list.
- `Pointer to next`: Points to Struct 2
#### Struct 2 (Middle Node):
- `Object`: Data (e.g., 20)
- `Pointer to previous`: Points back to Struct 1
- `Pointer to next`: Points forward to Struct 3
#### Struct 3 (Last Node):
- `Object`: Data (e.g., 30)
- `Pointer to previous`: Points back to Struct 2
- `Null`: No next node — this is the **end** of the list.

### 🔁 Why use this?

This **doubly linked list** structure allows you to:
- Move **forward** and **backward** through the list,
- Insert or remove elements **in the middle** more easily than with arrays.

#### ASCII diagram
```C
[ null ] <- [10] <-> [20] <-> [30] -> [ null ]
```

A bit more with arrows:

```C
null    10       20       30    null
  |      |        |        |      |
  |    next →   next →   next →   |
  |   ← prev   ← prev   ← prev    |
```

> In short: pointers are like arrows between elements. In `C` you draw and move them yourself; in `C#` the `CLR` manages those references for you.
## Code: first `C`, then `C#`

To cement the ideas:

- In `C` you work directly with pointers and manage memory manually (malloc/free).
- In `C#` you use references and classes; the CLR + GC manages memory.

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
    // Create 3 nodes
    Node* first  = malloc(sizeof(Node));
    Node* second = malloc(sizeof(Node));
    Node* third  = malloc(sizeof(Node));

    // Assign values
    first ->value = 10;
    second->value = 20;
    third ->value = 30;

    // Connect them
    first->prev = NULL;
    first->next = second;

    second->prev = first;
    second->next = third;

    third->prev = second;
    third->next = NULL;

    // Print values
    printf("Forward: %d -> %d -> %d\n", 
		    first->value, 
		    second->value, 
		    third->value);
    printf("Backward: %d <- %d <- %d\n", 
		    third->value, 
		    second->value, 
		    first->value);

    // Clean up
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
        // Create 3 nodes
        var first  = new Node { Value = 10 };
        var second = new Node { Value = 20 };
        var third  = new Node { Value = 30 };

        // Connect them
        first.Next  = second;
        second.Prev = first;
        second.Next = third;
        third.Prev  = second;

        // Traverse forward
        Console.WriteLine("Forward:");
        for (var current = first; 
		        current != null; 
		        current = current.Next)
            Console.Write(current.Value + " ");
        
        Console.WriteLine("\nBackward:");
        for (var current = third; 
		        current != null; 
		        current = current.Prev)
            Console.Write(current.Value + " ");
    }
}
```


### 🧠 Insertion and Removal in a Linked List

In a **linked list** (especially a **doubly linked list** like the one we just looked at), the two most common operations are. Unlike arrays, you don’t shift or copy elements — you just rewire the arrows (references/pointers).

---

## ➕ Insertion

**Adding a new node** between existing nodes.

For example, inserting a new value between `first` and `second`:

**Before:**

```C
first <-> second
```

**After inserting new node (e.g., 15):**

```C
first <-> newNode (15) <-> second
```

To do this in code:

1. Create the new node.
2. Update the `next` of the previous node.
3. Update the `prev` of the next node.
4. Link the new node’s `prev` and `next`.

---

## ➖ Removal

**Deleting a node** from the list.

For example, removing `second`:

**Before:**

```C
first <-> second <-> third
```

**After removal:**

```C
first <-> third
```

To do this in code:

1. Set `first.next = third`.
2. Set `third.prev = first`.
3. (In `C`) `Free` the memory of `second`.

---
## ✅ GOAL:

We’ll insert a node with value `15` between nodes `first` (10) and `second` (20), and later remove it.

---

## 🧱 `C` Code

### 🔧 Insertion in C:

```C
// Inserting between first and second
Node* newNode  = malloc(sizeof(Node));
newNode->value = 15;

// Link new node
newNode->prev = first;
newNode->next = second;

// Update existing links
first->next  = newNode;
second->prev = newNode;
```

### ❌ Removal in C:

```C
// Removing newNode (15)
first->next  = second;
second->prev = first;

// Free memory in C
free(newNode);
```

## 🧱 `C#` Code

### 🔧 Insertion in C#:

```C#
// Inserting between first and second
var newNode = new Node { Value = 15 };

// Link new node
newNode.Prev = first;
newNode.Next = second;

// Update existing links
first.Next  = newNode;
second.Prev = newNode;
```

### ❌ Removal in C#:

```C#
// Removing newNode (15)
first.Next  = second;
second.Prev = first;

// In C#, memory is managed by the GC
// No need to call free()
```

### ✅ Summary

| Operation | C                                  | C#                                   |
| --------- | ---------------------------------- | ------------------------------------ |
| Insert    | `malloc` + update 4 pointers       | `new` + update 4 references          |
| Remove    | update 2 pointers + `free()`       | update 2 references; GC frees memory |

---

# Homework

Build a small console app to practice bits/bytes, ASCII, and linked lists:

1) Binary → Decimal → ASCII
- Write `BinaryToDecimal(string bits)` that converts a binary string (e.g., `"110000"`) to an `int`.
- Write `AsciiFromBinary(string bits)` that returns the corresponding ASCII `char`.
- Given an input like `"01001000 01101001"`, decode it to `"Hi"`.

2) Doubly Linked List basics (C#)
- Implement a minimal `DoublyLinkedList<T>` with inner `Node` having `Prev`, `Next`, and `Value`.
- Support `AddLast`, `InsertAfter(node, value)`, and `Remove(node)`.
- Demonstrate: build `10 <-> 20 <-> 30`, insert `15` between 10 and 20, print forward and backward, then remove `15` and print again.

3) Explain in 2–3 sentences
- When arrays are a better fit than linked lists, and vice versa.
- What the CLR/GC handles for you vs. what C requires you to do manually.

---

# Solution

{{< collapse title="Show/Hide Code" >}}

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
            // 1) ASCII from binary
            string message = DecodeBinaryMessage("01001000 01101001"); // Hi
            System.Console.WriteLine(message);

            // 2) Doubly linked list demo
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

        // --- Part 1: Bits/ASCII ---
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

    // --- Part 2: Doubly linked list ---
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

## Notes
- Arrays are great for indexed random access and compact memory; linked lists are better for frequent inserts/removals in the middle without shifting elements.
- In C, you must `malloc`/`free` and wire pointers; in C#, the CLR manages memory and references via the GC.



{{< /collapse >}}

---

# Homework — breakdown and explanation

Below is an explanation of why each part of the task matters.

## 1) Working with bits and ASCII

### Methods
- BinaryToDecimal(string bits)
  Converts a binary string to a decimal number using shifting:
  ```csharp
  value = (value << 1) + (c - '0');
  ```
  This reinforces the idea that each new digit in base‑2 = multiply by 2 and add the current bit.

- AsciiFromBinary(string bits)
  Casts the decimal value to a char: `(char)BinaryToDecimal(bits)`.
  Here we connect back to the ASCII table — a byte maps to a letter or symbol.

- DecodeBinaryMessage("01001000 01101001") → "Hi"
  Splits the string into bytes, converts each, and assembles text — showing how binary groups directly represent characters.

### Why this matters
It cements the core idea: computers store letters as numbers, and numbers as combinations of bits.

## 2) Doubly linked list (`DoublyLinkedList<T>`)

### Structure
- Inner Node holds:
  - Value — the data
  - Prev — link to previous node
  - Next — link to next node
- head and tail give fast access to the start and end.

### Methods
- AddLast — adds a node to the end. If empty, both head and tail point to the new node.
- InsertAfter(existing, value) — inserts after a given node: rewires links on existing, newNode, and next.
- Remove(node) — removes a node: adjusts neighbors, updates head/tail, and nulls the removed node’s links (helpful for GC).
- Forward()/Backward() — iterate in both directions; this is a key benefit of a doubly linked list.

### Why this matters
It reinforces “references/pointers” in practice. In C#, we work with references while the CLR and GC manage memory.

## 3) Arrays vs lists and C vs C#
- Arrays: O(1) random access and compact memory, but inserts/removals in the middle require shifting.
- Lists: great for frequent inserts/removals; index access is O(n).
- C vs C#: In C you manually manage memory (malloc/free) and raw pointers; in C# you use references and the CLR/GC manages memory.

## Conclusion
- The progression from bits → ASCII → linked lists builds intuition step by step.
- Each code piece highlights the theory with a practical example.
- The assignment ties it together: representation, data structure operations, and the memory model.
