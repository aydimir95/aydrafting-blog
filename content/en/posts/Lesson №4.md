+++
title = "C# + Revit API: Lesson 5 - Fundamental Types of Data in C# Cheat Sheet"
date = 2025-10-06T18:00:00+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250902205255.png"
cover.alt = "try & catch Statements"
+++

> Let's learn some of the fundamentals of programming with the real world examples . 
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

# Logical `Operators`

 > They control logic and flow in our tools.
 > We will have a good understanding of core statements we can use to build Revit Add-ins.

`x == y` => *true  if x is equal to y*

`x != y` => *true if x is not equal to y*

`x > y` => *true if x is greater than y*

`x < y` => *true if x is less than y*

`x >= y` => *true if x greater than or equals to y*

`x <= y` => *true if x less than or equals to y*

---

`x || y` => *true if x OR y are true*

`x && y `=> *true if x AND y are true*

`!(x)` => *true if not x (can also use 'not' x)*

`x ^ y` => *true if x OR y are true, but not both*  

---
## `Null` Operations / Operands


`x?.Method()` => *If x is null, Method() will NOT run*

`x ??= value` => *If x is null, set it to value specified*

`x is null` => *True if x is Null, False if it's not Null*

`if (x)` => *if x is Null, it yields Null or false*

---

# We now have learned:

The basics of:
- How `computation` works,
- Basic `variable` types/classes 
- How to `declare` variables
- How to `assign` variables
- `Inheritance`
- Logical `Operators`

# `if` Statement
```C#
if // Condition
{
	run if condition is true;
}
else // If we have no false outcome -> we can skip 'else' branch altogether
{
	run if condition is false;
}
```

# `else if` Statement

```C#
if // Condition
{
	run if condition is true;
}
else if // Condition
{
	run if there are more conditions;
}
else // If we have no false outcome -> we can skip 'else' branch altogether
{
	run if condition is false;
}
```

# Shorthand `if` Statements

```C#
value = condition?then:else;
```

 > Nearly always used for quickly setting another variable to one of two possibilities, using a conditional outcome. Only used if it's a simple one liner task.

# Example
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;
using Nice3point.Revit.Toolkit.External;
using Microsoft.VisualBasic;

namespace guRoo.Commands
{
    /// <summary>
    ///     External command entry point
    /// </summary>
    [UsedImplicitly]
    [Transaction(TransactionMode.Manual)]
    public class StartupCommand : ExternalCommand
    {
        public override void Execute()
        {
            //TaskDialog.Show(Document.Title, "Hot reload!");

            string input = Interaction.InputBox("Enter a number:", "Input Required", "0");

            if (!int.TryParse(input, out int i))
            {
                TaskDialog.Show(Document.Title, "Invalid number entered.");
                return;
            }

            // Shorthand version
            // string s = i == 3 ? "i is 2" : "i is not 2"; 

            string outcome;

            if (i == 2)
            {
                outcome = "i is 2";
            }
            else if (i == 3)
            {
                outcome = "i is 3";
            }
            else
            {
                outcome = "i is neither 2 nor 3";
            }
            
            TaskDialog.Show(Document.Title, outcome);
            
        }
    }
}
```


# `Try` & `Catch` Statements
## Pseudocode

```C#
try 
{
	try to do this;
}
catch
{
	if try gets exception, rollback and do this;
}
```

## Exceptions

 >Exceptions come in many forms and Revit API Docs typically specifies the types of Exceptions we can catch for its methods. There are also system type exceptions.
 
```C#
catch // Exception as "e" to print the error
{
	To catch a specific exceptions, catch as e;
}
catch
{
	To catch all exceptions, do this; 
	// but better to catch specific exceptions, 
	// otherwise you will catch all necessary and unecessary exceptions.
}
finally
{
	To run a final code regardless of outcome;
}
```

---
## Use Don't Abuse
 > When you first begin using languages, try statements seem great - you can write code, and if you make a mistake your code can continue. THIS IS WRONG!

 > Try statements should be used only when you know there is a chance an exception could occur, and it cannot be otherwise dealt with. 

 > You should make them as robust as possible, and use them only for parts of your code that need them.
 
## DON'T DO THIS!
```C#
try
{
	all code;
}
catch
{
	oh no, somethis went wrong;
}
```

# Example – Creating a Revit Sheet with Error Handling

```C#
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System;

public class CreateSheetExample
{
    public void CreateSheet(Document doc, ElementId titleBlockId)
    {
        try
        {
            using (Transaction tx = new Transaction(doc, 
            "Create New Sheet"))
            {
                tx.Start();

                try
                {
                    // Attempt to create a sheet
                    ViewSheet sheet = ViewSheet.Create(doc, titleBlockId);
                    TaskDialog.Show("Success", 
                    $"Sheet '{sheet.Name}' created!");
                    
                    tx.Commit();
                }
                catch (Autodesk.Revit.Exceptions.
                ArgumentException argEx)
                {
                    // Rollback and handle known Revit-specific error
                    tx.RollBack();
                    TaskDialog.Show("Error", 
                    $"Invalid title block: {argEx.Message}");
                }
                catch (Exception ex)
                {
                    // Rollback for unexpected system-level errors
                    tx.RollBack();
                    TaskDialog.Show("Unexpected Error", 
                    ex.Message);
                }
            }
        }
        finally
        {
            // Always run this, no matter success or failure
            TaskDialog.Show("Info", 
            "Finished attempting to create a sheet.");
        }
    }
}
```

> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.

