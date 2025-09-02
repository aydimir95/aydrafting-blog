+++
title = "C# + Revit API: Lesson 2 - Bits & Bytes, ASCII Table, Pointers & Structs - Programming 101"
date = 2025-08-06T14:23:14+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250902204629.png"
cover.alt = "Bits & Bytes & ASCII Table"
+++
#### I suggest taking [CS50 Course](https://pll.harvard.edu/course/cs50-introduction-computer-science) to understand the basics of Programming
1. True & False
2. 0 and 1
3. Base 2 numbering system


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


```C#
We call these bits 
Eight bits = 1 byte
Memory is addressed into bytes
```

## ASCII Tables bring meaning to what various bytes represent:

```bash
ASCII 48 = 0
(00) 110000
1 * 2^4 = 16
1 * 2^5 = 32
16 + 32 = 48
48 = 0 (in ASCII Table)
```
# Pointers = Structs (in C)

- Pointers are hexadecimal based values that identify an address in computer memory.
- If you write in C, you need to manage pointers and check memory in and out as you work.
- C# bypasses this using a `garbage collector (GC)`.
- Pointers and structs allow us to connect bytes into lists. We can also array objects adjacently.
- In C#, this is all managed for you.

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
### Code Example:

```C#
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

In a **linked list** (especially a **doubly linked list** like the one we just looked at), the two most common operations are:

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
3. (In C) Free the memory of `second`.

---
## ✅ GOAL:

We’ll insert a node with value `15` between nodes `first` (10) and `second` (20), and later remove it.

---

## 🧱 C Code

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
// Removing the newNode (15)
first->next  = second;
second->prev = first;

// Free memory
free(newNode);
```

---

## 🧱 C# Code

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
// Removing the newNode (15)
first.Next  = second;
second.Prev = first;

// In C#, memory is handled automatically
// So we don't call free(); GC will collect it later
```

---

### ✅ Summary

| Operation | C                               | C#                                |
| --------- | ------------------------------- | --------------------------------- |
| Insert    | Use `malloc`, fix 4 pointers    | Use `new`, fix 4 references       |
| Remove    | Fix 2 pointers, `free()` memory | Fix 2 references, GC does cleanup |

> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.