+++
title = "C# + Revit API: Lesson 3 - Fundamental Types of Data in C#"
date = 2025-08-06T14:29:29+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
+++

# Boolean `bool`

- true (1)
- false (0)

# Integer `int`

- Whole number:

- 1, 2, 3, etc.

- Numbers come in different formats but by default they are signable (can be negative).
- Typically, they use 32 bits based.

# Double `double`

- Decimal number:

- 0.0, 1.5, 6.592, -5.00, etc.

- Doubles use 64 bits, and are more common than floats (which use half - 32 bits). In Revit you will typically work with int and double.


# Characters `char`

- 'a', 'b', 'c', etc.

- Chars store a single character (which can be a number - it is ASCII based behind the scenes). They use 1 byte (8 bits).

# Strings `str`
- "string", "example", etc.

- Strings are technically an array of characters (a consecutive set of [[chars]] in memory). They are abstracted for us in C#, and you might sometimes see them called a [[char*]] (CharStar).

# Null pointer `null`

- Always written as [[null]]

- Nulls are a special object that points to the first byte in memory. It represents an absence of data and may commonly be caused through an error or exception.

# `Nullable` Types

- Most objects you use will be [[Nullable]], in that they can be represented and set to [[null]]. 
- [[Integers]] are an example of a type which cannot be set to [[null]] unless you declare them as [[nullable]] (which makes them a different type).
- Revit API Classes are generally nullable.


# `Lists` or `Arrays`?

- [[Arrays]] are important for memory management eventually, but I recommend skipping the use of them initially.
- The Revit API generally works with [[Lists]].

- [[Lists]] - differ to [[arrays]] in that we can add additional objects to them, whereas [[arrays]] have a fixed size upon creation.
- We will learn about [[Lists]] later.

# `Compiling`

- Generally, [[C#]] code will be faster than languages such as [[Python]] as it is compiled before execution.
- Compiling refers to the conversion of written code into machine code (1's and 0's).
- When we build our solution before running it, it is turning our code into a [[Dynamic Linked Library]] ([[DLL]]) which is executed by the application.
- Languages like [[Python]] instead use [[interpreters]].

# `Declaring` a Variable in `C#`

- [[modifier(s)]] type variableName;
	- [[public]]
	- [[private]]
	- [[static]]
	- [[internal]] 
	- [[virtual]]

- We will return to access modifiers later, for now we can avoid using them in basic examples.
- We tell the compiler what [[type]] we need first.
- We then tell it the [[variableName]] to assign to it.

# `Assign` a Variable in `C#`

- [[type]] [[variableName]] = value;

- We can assign a value upon creating the variable.
- Or, we can assign it later on...

```C#
type variableName;     // <= Initialize
variableName = value; // <= Assign
```

- When we assign a value, you need to give it a valid value for its [[type]]:

```C#
int myInteger = 5;
```

- The assigned value must suit the variable type upon assignment. 
- Type safety in C# will ensure this.
- Examples below would cause an error:

```C#
int myInteger = 3.5;   // <= Should be a double
int myInteger = "5";   // <= Should be a string
```

# Creating a `List` in `C#`

```C#
List<int>()myList = new List<int>();
```

- We can also declare a list and store objects to is:

```C#
List<int>()myList = new List<int>(){1,2,3};
```

- We will come back to the braces later.


# Making use of `var`

```C#
var myList = new List<int>();
```

- If the value being assigned on the right implies a specific type, we can instead use the var keyword to simplify our code. This is generally best practice.
- However, if the right side is ambiguous, declare the type on the left. This will matter when we learn about **class inheritance**.

```C#
var myList = new List<object>();
```

- **Object** is a special type which allows the storage of many things. It can be a useful but ambiguous return type for functions and classes through which you might need to pass many things in/out of.
- We will learn in a later lesson about type casting, where the object class can be a useful intermediate type to take advantage of.


# `Inheritance` 101

- The **RevitAPI** uses a lot of class inheritance.

**Metaphorical example:**
- Dogs and Cats are both Animals 
- Dogs are not Cats
- Cats are not Dogs
- But the they both inherit the Animal

**RevitAPI Example:**
- Views and Floors are both Elements 
- Views are not Floors 
- Floors are not Views 
- But they both inherit the Element

	- Elements have an Element**ID** property
	- Views and Floors have an Element**ID** from Element Class

		- Floors have a SlabShapeEditor
		- Elements DO NOT
		- Views DO NOT


# Basic `Type` Checking

```C#
object is type variableName
```

- This syntax can be used to logically check if an object is or inherits a specific type/class.
- We can assign a variable to this object as that type in a statement (e.g. if) to locally work with it as that type instead.


# We now have...

A basic understanding of:
- How `computation` works,
- Basic `variable` types/classes 
- How to `declare` variables
- How to `assign` variables
- `Inheritance`

We will be applying these concepts soon.

> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.