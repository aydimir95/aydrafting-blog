+++
title = "C# + Revit API: Lesson 7 - Introduction to Classes"
date = 2025-08-08T13:06:57+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
+++

{{< shooter strategy="burst" count="5" spread="1.0" >}}

# 1. Introduction
### Project Folder Structure
1. Commands
2. Extensions
3. Forms 
4. General
5. Resources
6. Utilities
*These are `folders` which contain various files that our toolbar will utilize.*
- *Note that these are not necessarily aligned with `namespaces` (which will be covered later)*

---
# 2. What is a Class?
1. In C#, classes are templates related to the creation and management of objects. There are many predefined `classes` available in C# and the Revit API.
2. We use them for a wide range of things and will regularly be creating and developing our own classes.

---
### Accessing properties / methods of a Class
1. Property:
	1. `object.Property` -> to access a property
2. Method:
	1. `Object.Method(argument1, argument2, etc)` -> to access a method

### Namespaces
1. When we create classes, we first tell them where they belong in our project.
2. `Namespaces` can be nested within others using a dot separator, eventually tied back to our `.addin` namespace.
```C#
// Revit API
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;

// geeWiz - internal project objects
using geeWiz.Extensions;
using geeWiz = geeWiz.Forms;
using geeWiz = geeWiz.Utilities.Workshare_Utils;

// The class belongs to the Commands namespace
namespace geeWiz.Cmds_Audit
{
	// Cmd_DeletePatterns
	// Cmd_PurgeRooms
	// Cmd_PurgeTemplates
	// Cmd_PurgeFilters
}
```

### Basic Class Anatomy
1. `modifers class ClassName : Interface(s)`
	1. Constructor (optional)
	2. Properties (optional)
	3. Methods (optional)

- `Access modifiers` control how this code can be accessed inside and outside your project.
- You will typically need to declare at least on of ***`public/private`***, 
	- And sometimes ***`static`*** for the purposes we will use them for early on.
### `Static` Modifier
- The `static` `access` `modifier` is a difficult concept to grasp at first, so we will simplify it somewhat.
	- Classes with a `static` `modifier` do not support the creation of `objects` of that `class` (instantiated).
	- We commonly take advantage of this to create classes which behave more like toolkits, where the class itself acts more like a singe object we can call upon to do things for us.

 > So basically, the `Static` `modifier` is one instrument that you could use to build a complex script with.

### `Public` and `Private` Modifier
- The ***`public`*** modifier lets you access something anywhere in your project.
- The ***`private`*** modifier limits access to the same class instead (generally for behind-the-scenes code in the class itself).

*There are `other modifiers`, but let's keep it simple.*

### Class Declaration
`modifiers class ClassName : Interface(s)`

After our modifiers we must define our class by using the keyword 'class', followed by a Class Name.

Generally, most people use `PascalCase` for class names, and you should choose names which are not reserved elsewhere.

### Interface(s) (Optional)
`modifiers class ClassName : Interface(s)`

`Interface` - acts as a template that a class should follow. It's like a contract that is formed with your class -> the class must have certain methods / properties / behaviours that this interface would provide to it.

**Formally:**
- `Interfaces` are optional agreements that the class must form with predefined `class` templates. 
- They usually provide `methods` and `properties` which would otherwise be cumbersome to access/define, as well as ensuring the class follows some requirements.

## Referencing a Class

### `Static` example (access without creating an instance):
```C#
var myInstance = ClassName;
```
- A **`static`** class or member belongs to the **class itself**, not to any specific object.
- You use the **`class name`** to access it directly.
- You can call its `methods` or `properties` right away — no need to create an object.
- Because it’s static, you **cannot** use new to make an instance of it.

*Example:*
```C#
// Accessing a static property without creating Math object
Console.WriteLine(Math.PI); 
```

### `Non-static` example – Create and use an object
```C#
var myInstance = new ClassName();
```
- A **`non-static`** class needs to be **instantiated** (created) before you can use it.
- You create a new object using the new keyword and parentheses () to run its `constructor`.
- The variable `myInstance` now **refers to this new object**, and you can use its methods and properties.
- The var keyword tells the compiler to figure out the variable’s type automatically.

*Example:*
```C#
var car = new Car();  
car.Drive(); // Calling an instance method
```

### Homework 
Let's do the following:
- Set up a `class` file (.cs) in our project,
- Create a `namespace` for it,
- Define our class (`non-static`, `public`).

*Its purpose is to store and process results from forms we create.*

### Solution

```C#
// 1. Create a new folder (if you haven't already) and call it 'Forms'
// 2. Add a new item to 'Forms' -> pick the 'Class' type -> name it: "Custom.cs"

using System;
using System.Collection.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guRoo.Forms // try to make your namespace follow your folder structure
{
	public static class Custom // change to 'public' + 'static' class 
	{
		
	}

	public class FormResult // add another 'non-static' class
	{
		
	}
}
```

---
Here’s a cleaner, beginner-friendly rewrite with improved structure, simpler explanations, and a working example that will actually compile.

I’ve also made the terminology more precise and added a clear **generic vs. specific constructor** example.

---

# 3. Constructors 
> Optional but very useful

A `constructor` is a special method that runs automatically when you create a new object from a class:
- It **tells the `class` how it should start** — for example, setting initial values.
- If you don’t add a constructor, C# uses a **default constructor** that simply sets `properties` to their default values, or formally: C# provides an **implicit `parameterless` constructor** that sets members to their type defaults.
- You can make your own constructor to set specific values when an object is created.
- A class can have **multiple constructors** (called **constructor overloading**), which is a form of `polymorphism`.

---

### Constructor Syntax

```C#
class ClassName
{
    // Constructor with parameters
    public ClassName(type parameterName)
    {
        // Initialization logic
    }
}
```

---

### **Example: Generic vs. Specific Constructor**

Let’s create a FormResult class with two constructors:

1. **`Generic` constructor** – takes no arguments (creates a form with default values)
2. **`Specific` constructor** – allows setting a custom status when creating the form

```C#
namespace guRoo.Forms // Use namespaces that match your folder structure
{
    public class FormResult
    {
        public string Status { get; set; }
        // 1. Generic constructor (no parameters)
        public FormResult()
        {
            Status = "Pending"; // Default value
        }
        // 2. Specific constructor (with parameter)
        public FormResult(string status)
        {
            Status = status;
        }
    }
}
```

---

### **Using the Constructors**

```C#
// Using the generic constructor
var form1 = new FormResult();
Console.WriteLine(form1.Status); // Output: Pending

// Using the specific constructor
var form2 = new FormResult("Cancelled");
Console.WriteLine(form2.Status); // Output: Cancelled
```

---
### **Homework**

In this exercise, you’ll learn how to create **two different constructors** in a class — one that uses a **default value** and one that accepts a **custom value** when creating an object.

We’ll do this in a **Revit API context** by making a simple SheetResult class that stores the **name of a sheet**.

**Your task:**
1. Create a new class called SheetResult in `Custom.cs`.
2. Add:
    - A `generic` constructor (no parameters) that sets the `SheetName` property to "Untitled Sheet".
    - A `specific` constructor (with a parameter) that accepts a string and sets `SheetName` to the provided value.
	    - Note: if you add the `specific` constructor, also add the `parameterless` one yourself.
3. In `Custom.cs`, create a static method `ShowSheetResultDemo()` that:
    - Creates one `SheetResult` using the `generic` constructor.
    - Creates another `SheetResult` using the `specific` constructor with a `custom name`.
    - Displays both names in a `TaskDialog`.
4. In your `StartupCommand.Execute()` method, call `Custom.ShowSheetResultDemo()` to run the demo inside Revit.


💡 _This will help you understand how constructors work in C#, and how you can use them to set up different ways of creating an object in your Revit add-ins._

#### Solution (Copy Paste -> Compile & Test it in Revit)

#### `Custom.cs`
```C#
using Autodesk.Revit.UI;

namespace guRoo.Forms
{
    public static class Custom // helper you can call from anywhere
    {
        public static void ShowSheetResultDemo()
        {
            var sheet1 = new SheetResult();                     // generic
            var sheet2 = new SheetResult("A101 - Floor Plan");  // specific
            
            TaskDialog.Show("Sheet Results",
                $"Generic constructor: {sheet1.SheetName}\n" +
                $"Specific constructor: {sheet2.SheetName}");
        }
    }

    public class SheetResult
    {
        public string SheetName { get; set; }
		// Parameterless (generic) constructor
        public SheetResult() => SheetName = "Untitled Sheet";     
		// Constructor with parameters (specific)
        public SheetResult(string sheetName) => SheetName = sheetName; 
    }
}
```
#### `StartupCommand.cs`
```C#
using guRoo.Forms; // add this

public override void Execute()
{
    // ...your existing code...

    Custom.ShowSheetResultDemo(); // <-- shows the dialog from Custom.cs
}
```

---

# 4. Properties

Properties define the **data** that a `class` can store and expose.

While you _can_ make properties publicly accessible, best practice is to keep the underlying data **`private`** (inside the class) and control access through **public** get and set accessors.

This approach:
- Keeps the internal state of your object safe from unintended changes.
- Lets you add validation or extra logic when reading or writing values.

In simple examples, we’ll mostly use **auto-implemented properties** (`public string Name { get; set; }`), but we’ll also show how to back them with **`private fields`** when you need more control.

### Declaring a property
A property is like a **named piece of data** that belongs to a `class`. The simplest form is an **auto-implemented property**, which C# creates for you without needing to write extra code:
```C# 
Class declaration
{
	modifiers type PropertyName{get;set}
}
```

```C#
public class Person
{
    public string Name { get; set; } // auto property
}
```
### Using a private field 
Sometimes you want more control over how a property’s value is stored or changed. In that case, you can store the value in a **private field** and use a property to **get** and **set** it.
```C#
class ClassName
{
    private type fieldName; // lowerCamelCase for fields

    public type PropertyName // PascalCase for properties
    {
        get { return fieldName; }
        set { fieldName = value; }
    }
}
```
### Example:
```C#
public class Person
{
    private string name; // field

    public string Name   // property
    {
        get { return name; }
        set { name = value; }
    }
}
```
> 💡 _Tip:_ By convention, **fields** use camelCase and **properties** use PascalCase. This makes it easier to spot them in your code.

### Homework
Properties let us store and access data in a class. In our earlier example, the `SheetResult` class only had a `SheetName` property. 

**Your task:**
- Let’s expand it to include more information — for example, the `SheetNumber`  
- And show both a simple `auto-property` and a property backed by a `private field`.

---
### Solution
#### `Custom.cs`
```C#
using Autodesk.Revit.UI;

namespace guRoo.Forms
{
    // ===== STATIC CLASS =====
    public static class Custom
    {
        // ===== METHOD =====
        public static void ShowSheetResultDemo()
        {
            // Create objects
            var sheet1 = new SheetResult(); // generic constructor
            var sheet2 = new SheetResult("A101 - Floor Plan", "S-001"); // specific constructor

            // Show results in Revit dialog
            TaskDialog.Show("Sheet Results",
                $"Generic constructor: {sheet1.SheetName}, Number: {sheet1.SheetNumber}\n" +
                $"Specific constructor: {sheet2.SheetName}, Number: {sheet2.SheetNumber}");
        }
        // ===== END METHOD =====
    }
    // ===== END STATIC CLASS =====


    // ===== CLASS =====
    public class SheetResult
    {
        // ===== PROPERTIES =====
        
        // Auto-implemented property
        public string SheetName { get; set; }

        // Private field + property with get/set logic
        private string sheetNumber;
        public string SheetNumber
        {
            get { return sheetNumber; }
            set
            {
                // Example: basic validation
                if (string.IsNullOrWhiteSpace(value))
                    sheetNumber = "No Number";
                else
                    sheetNumber = value;
            }
        }
        // ===== END PROPERTIES =====


        // ===== CONSTRUCTORS =====
        
        // Generic constructor
        public SheetResult()
        {
            SheetName = "Untitled Sheet";
            SheetNumber = "No Number";
        }

        // Specific constructor
        public SheetResult(string sheetName, string sheetNumber = "No Number")
        {
            SheetName = sheetName;
            SheetNumber = sheetNumber;
        }
        // ===== END CONSTRUCTORS =====
    }
    // ===== END CLASS =====
}
```

#### **What Changed?**
- **Auto property**: `SheetName` — quick and simple, no custom logic.
- **Property with private field**: `SheetNumber` — lets us add validation before saving the value.
- **Constructors updated** so both values can be set when creating a `SheetResult`.

#### **Result in Revit**
When you run `StartupCommand`, you’ll still get your original workflow, but now the `Custom.ShowSheetResultDemo()` dialog will display **both the sheet name and the sheet number**, with “No Number” automatically set if no value is given.

---
# 5. Methods
A **method** is an action your class can perform.

Think of it this way:
- **Properties** = what the object **is** (its data).
- **Methods** = what the object **does** (its behavior).

Key points:
- Methods can take **arguments** (optional).
- Methods have a **return type**. If they return nothing, use void.

### Declaring a method
```C#
class ClassName
{
    modifiers returnType MethodName(optionalArguments)
    {
        // Code logic here
        return objectOfType; // omit if return type is void
    }
}
```
## Example (continuing our SheetResult)

- We’ll extend SheetResult with a method that **formats** its data for display.
- This reinforces: **field + property + constructor + method** working together.
```C#
using Autodesk.Revit.UI;

namespace guRoo.Forms
{
    // ------- CALLER (static helper you can invoke from your command) -------
    public static class Custom
    {
        public static void ShowSheetResultDemo()
        {
            var s1 = new SheetResult();                               // generic ctor
            var s2 = new SheetResult("A101 - Floor Plan", "S-001");   // specific ctor

            // Call a METHOD that uses the properties/field
            TaskDialog.Show("Methods Demo",
                $"s1 label: {s1.FormatLabel()}\n" +
                $"s2 label: {s2.FormatLabel()}");
        }
    }

    // ------- DATA MODEL (class with properties, field, constructors, methods) -------
    public class SheetResult
    {
        // Properties
        public string SheetName { get; set; } // auto-property

        // Private field + property with simple validation
        private string _sheetNumber;          // field (camelCase with leading underscore is common)
        public string SheetNumber
        {
            get => _sheetNumber;
            set => _sheetNumber = string.IsNullOrWhiteSpace(value) ? "No Number" : value;
        }

        // Constructors
        public SheetResult()
        {
            SheetName = "Untitled Sheet";
            SheetNumber = "No Number";
        }

        public SheetResult(string sheetName, string sheetNumber = "No Number")
        {
            SheetName = sheetName;
            SheetNumber = sheetNumber;
        }

        // METHODS
        // Returns a formatted label combining the properties
        public string FormatLabel()
        {
            return $"{SheetNumber} - {SheetName}";
        }

        // Example of a void method that changes state (optional)
        public void Rename(string newName)
        {
            SheetName = string.IsNullOrWhiteSpace(newName) ? SheetName : newName;
        }
    }
}
```

### Homework
- Create a `class`
- Add some `properties` 
- Give it a `constructor`
- Demonstrate how to use a `field`
- Demonstrate how to make a `method`
- Reference  our `class` in another part of your code base


### Solution

#### `Custom.cs`
```C#
using System.Collections.Generic;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;

namespace guRoo.Forms
{
    public class FormResult
    {
        // ====== Field + wrapped property (best practice) ======
        private bool _cancelled;
        public bool ExampleCancelled
        {
            get => _cancelled;
            set => _cancelled = value;
        }

        // ====== Properties ======
        public object Payload { get; set; }
        public List<object> Items { get; set; }
        public bool Cancelled { get; set; }
        public bool Valid { get; set; }
        public bool Affirmative { get; set; }

        // ====== Constructors ======
        public FormResult()
        {
            Payload = null;
            Items = new List<object>();
            _cancelled = true;
            Cancelled = true;
            Valid = false;
            Affirmative = false;
        }

        public FormResult(bool isValid)
        {
            Payload = null;
            Items = new List<object>();
            _cancelled = !isValid;
            Cancelled = !isValid;
            Valid = isValid;
            Affirmative = isValid;
        }

        // ====== Methods ======

        // Change state to invalid
        public void SetToInvalid()
        {
            _cancelled = true;
            Cancelled = true;
            Valid = false;
            Affirmative = false;
        }

        // Summary for debugging or UI
        public string Summary() =>
            $"Valid: {Valid}, Cancelled: {Cancelled}, Affirmative: {Affirmative}, Items: {Items.Count}";

        // Real-world method: tries to create a sheet based on form state
        public string TryCreateSheet(Document doc)
        {
            if (!Valid || Cancelled)
                return "Form is invalid or cancelled. No sheet created.";

            // Grab first available title block
            ElementId titleBlockId = new FilteredElementCollector(doc)
                .OfCategory(BuiltInCategory.OST_TitleBlocks)
                .WhereElementIsElementType()
                .FirstElementId();

            if (titleBlockId == ElementId.InvalidElementId)
                return "No title block types found. Cannot create sheet.";

            using (Transaction tx = new Transaction(doc, "Create Sheet"))
            {
                tx.Start();
                ViewSheet.Create(doc, titleBlockId);
                tx.Commit();
            }

            return "Sheet created successfully!";
        }
    }
}
```

#### `StartCommand.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Nice3point.Revit.Toolkit.External;
using gFrm = guRoo.Forms;

namespace guRoo.Commands
{
    [UsedImplicitly]
    [Transaction(TransactionMode.Manual)]
    public class StartupCommand : ExternalCommand
    {
        public override void Execute()
        {
            // Example 1: Default constructor (invalid form)
            // var formResult = new gFrm.FormResult();

            // Example 2: Affirmative constructor (valid form)
            var formResult = new gFrm.FormResult(true);

            // Attach the Revit Document to our form object
            formResult.Payload = Document;

            // Optionally, flip it to invalid to test
            // formResult.SetToInvalid();

            // Try to create the sheet
            string operationResult = formResult.TryCreateSheet(Document);

            // Show result to the user
            TaskDialog.Show("Form + Sheet Creation",
                formResult.Summary() + "\n\n" + operationResult);
        }
    }
}
```
### Disposal
- Later on, we will look into other things we can make use of, such as specifying what happens to our class instances when they are `disposed`.
- Generally, an object will be `disposed` when it us not needed anymore. The compiler tracks and determines when this occurs for us, but we can also manually dispose of or with the disposal of objects.

***From there, we've learnt all about classes!***

We now have a basic understanding of:
1. `Classes` in C#
2. Access `modifiers` 
3. `Initialization` 
4. `Properties` and `methods` 
5. `Namespaces` 


# 6. Introduction to Interfaces
An **interface** is like a **contract** for a class.

It doesn’t contain actual working code — instead, it **defines what properties and methods a class must have**.

If a class **implements** an interface, it promises to include all the members that interface defines.

This is useful for making sure different classes follow the same pattern, even if they work in different ways inside.

> 💡 _Think of it as a checklist: the interface says “you must have these items,” and your class fills in the details._

---

### **Interface Example**
If we have an interface `IAnimal` that says:
- “You must have a `property` Legs”
- “You must have a `property` Name”
- “You must have a `method` `MakeNoise()`”
Then any class implementing `IAnimal` must include all of those members.


```C#
// Pseudo Code
IAnimal 

int Legs;
string Name;


void MakeNoise();
```

Once a class implements an interface:
- You write the actual code for the `methods` in that `class`.
- You can `set` the starting `values` for the interface’s `properties`.
- You can define the `behavior` of each `method` however you want.

This is why interfaces are considered abstract — they don’t tell you how to do something, only that you must have it.

They’re a way to guide multiple classes to share the same “template” of members while letting each class have its own unique implementation.
### **Using an Interface Example**
```C#
// Class that implements the IAnimal interface
public class Dog : IAnimal
{
    public int Legs { get; set; } = 4;
    public string Name { get; set; } = "Dog";

    public void MakeNoise()
    {
        Console.WriteLine("Woof!");
    }
}
```
Explanation:
- The Dog class implements `IAnimal`.
- The `Legs` and `Name` `properties` are given real values.
- The `MakeNoise()` `method` is given actual `behavior` (printing "Woof!").
- You can implement more than one `interface` in a single `class`.
- By convention, `interface` `names` start with `I` (e.g., `IAnimal`, `IExternalCommand`).

### **Argument Provision**
Many interfaces in the **Revit API** come with extra built-in support.

For example:
- Some interfaces include **`methods` that are automatically called** when certain events happen (e.g., a `command starts`, the `application opens`, or a `document changes`).
- When you implement such an interface, you `don’t have to` set up the event wiring yourself — Revit will call the method for you.
- `Your job` is simply to **write the code that runs when the event occurs**.

> 💡 _Think of it like Revit saying: “When this happens, I’ll call your method. Just tell me what you want to do inside it.”_
## Application Variants

| Type                      | Description                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UIControlledApplication` | Provides access to the Revit application, typically used on `startup` and `shutdown` when no document is yet available.                                                         |
| `ControlledApplication`   | Represents the application service, giving access to documents, options, and application-specific settings (e.g., `language`).                                                  |
| `UIApplication`           | Similar to `UIControlledApplication`, but available during a running session. We’ll use this often, and in a future lesson we’ll register it as a globally accessible variable. |
| `UIDocument`              | Represents the current document at the UI level, giving access to things like selections and opened views.                                                                      |
| `Document`                | Represents the current document at the core API level, providing access to Revit API `classes`, `methods`, and `properties` (e.g., collecting elements).                        |
### How we can access them?
These objects are related in a `cascading hierarchy` — you can get one from another:
```C#
UIControlledApplication uiCtlApp;         // Available at startup/shutdown
ControlledApplication ctlApp = uiCtlApp.ControlledApplication;

UIApplication uiApp;                      // Available in commands/events
UIDocument uiDoc = uiApp.ActiveUIDocument;

Document doc = uiDoc.Document;            // The main Revit document API
```

> 💡 _Tip:_ At **`startup`/`shutdown`** you’ll usually have `UIControlledApplication`.   
> 💡 _Tip:_ During a **`command` / `event`**, you’ll start with `UIApplication`. 
### Homework
- Implement *`IExternalApplication`*
- Implement *`IExternalCommand`*
- Collect the *`ControlledApplication`* in your application entry point
- Collect the *`Document`* inside your command
### **Solution**
#### **Step 1 — Learn the interface requirements**

Go to [revitapidocs.com](https://www.revitapidocs.com/2024/d893b9a7-6f3e-bf1f-f4d6-5fbc269544bb.htm).

You’ll see that `IExternalApplication` defines `two` `methods` you must implement:
1. `OnStartup`(`UIControlledApplication` application) — runs when Revit starts.
2. `OnShutdown`(`UIControlledApplication` application) — runs when Revit shuts down.

Both methods must return a **Result** `enum`:
- `Result.Succeeded` — startup/shutdown completed successfully.
- `Result.Cancelled` — you want to cancel the process.
- `Result.Failed` — something went wrong.
---
#### **Step 2 — Understand the `parameters`**

When `OnStartup()` or `OnShutdown()` runs, Revit passes you a `UIControlledApplication` object.

From this you can get:
- `ControlledApplication` → `uiCtlApp.ControlledApplication`
    - Gives access to application-level `settings`, documents `list`, Revit `version` info, `language`, etc.
- `Ribbon` and `UI` setup methods (you can add `panels` and `buttons` here).
---
#### **Step 3 — Implementation in Application.cs**
```C#
// Autodesk
using Autodesk.Revit.UI

// This application belongs to the root namespace
namespace guRoo
{
	// Implementing the interface for applications
	public class Application: IExternalApplication
	{
		//This will run on Startup
		public Result OnStartup(UIControlledApplication uiCtlApp)
		{
			// Not sure what this does, explain:
			car ctlApp = uiCtlApp.ControlledApplication;

			Not sure, explain better:
			// This is supposed to be the end of the construction of our toolbar
			// Meaning it has to result in Success when Revit Launches. 
			return Result.Succeeded; // or Cancelled
		}

		// This will urn on shutdown
		public Result OnShutdown(UIControlledApplication uiCtlApp)
		{
			return Result.Succeeded;
		}
	}
}
```



**We now have a basic understanding of:**
- `Interfaces`
- `IExternalApplication`
- `IExternalCommand`
- `Application` Classes
- `Document` Classes

# 7. Create a `PushButton`
- Let's set up a button we can run our command from (we had this before, but we're doing it the typical way vs the `Nice3point` way).
- We will create a tab, a panel, a button and finally set up a basic command that runs when we press it.

## Understanding Names
1. `RibbonTab`
2. `RibbonPanel`
	- `Ribbon`
3. `PushButton`

### What do we need to do?
1. Create our `add-in` `Tab`
2. Add a `RibbonPanel` to the Tab
3. Add a `PushButton` to the Ribbon Panel

#### *Related API Classes:*
1. `UIControlledApplication` > Tab
2. `Tab` > `RibbonPannel`
3. `RibbonPanel` > `PushButtonData` > `PushButton`

#### *Properties of a PushButton*

| **Property**            | **Description**                                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssemblyName`          | Assembly path of the button.                                                                                                                                                                |
| `AvailabilityClassName` | The full class name of the class providing the entry point to decide availability of this push button.                                                                                      |
| `ClassName`             | The name of the class containing the implementation for the command.                                                                                                                        |
| `Enabled`               | Gets or sets a value indicating whether the item is enabled.                                                                                                                                |
| `Image`                 | The image of the button.                                                                                                                                                                    |
| `IsEnabledByContext`    | Indicates if this button can be executed. `True` if permitted based on the current Revit context (active doc, active view, active tool). `False` if disabled because of the active context. |
| `ItemText`              | Gets or sets the text displayed on the item.                                                                                                                                                |
| `ItemType`              | Gets the item type.                                                                                                                                                                         |
| `LargeImage`            | The large image shown on the button.                                                                                                                                                        |
| `LongDescription`       | Long description of the command tooltip.                                                                                                                                                    |
| `Name`                  | The name of the item.                                                                                                                                                                       |
| `ToolTip`               | The description that appears as a tooltip for the item.                                                                                                                                     |
| `ToolTipImage`          | The image to show as part of the button’s extended tooltip.                                                                                                                                 |
| `Visible`               | Gets or sets a value indicating whether the item is visible.                                                                                                                                |
#### One Important Method -> GetRibbonPanels 
1. `GetRibbonPannels` - Get all the custom Panels on Add-Ins Tab of Revit.
2. `GetRibbonPannels`(String) - Get all the custom Panels on a designated Revit Tab.
3. `GetRibbonPannel`(Tab) - Get all the custom Panels on a designated standard Revit Tab.

## Executing Assembly 
- When our add-in is running, all the classes, resources and code we have produced are executed as an Assembly. We will access this to connect commands to buttons.
```C#
using System.Reflection
Assembly.GetExecutingAssembly()
```
## Homework
1. Create a `static` utility class
2. Add `methods` to `static utility class` that we need
3. Run these methods in `OnStartup` method

- Create and assign `icons` and `tooltips`,
- Develop a `naming system` to simplify it all.


# 8. `Global` Variables
Some programming languages support '`global`' variables, which can be accessed anywhere at any time once set in the project.

To my knowledge, C# does not have a dedicated system for this. We can still achieve this by utilizing a static class that is dedicated to storing and providing these, however.

- Let's set up a Globals Class, which will give us access to objects that would otherwise be inaccessible from various areas of our project.
- We will also look at how we can use an event to capture the `UIApplication`.

### Why can't we get the `UiApp`?
We will collect most variables on startup, but the `UiApplication` is not available during this time in Revit. In order to collect it we will take advantage of the `OnIdling Event`.

## Events 101
1. Events provide us the ability to have code that executes when various events occur in an application. For example, run a code whenever the view is changed.
2. When Revit is available, it is said to be **`Idling`** (not doing anything). The **`OnIdling`** event is commonly used to run some code as soon as Revit is available for code to be run.

## Basic `Sub`/`Unsub` syntax 
Subscribe to `Idling` event 
	`UICtlApp.Idling += MethodName`

Unsubsribe from `idling` event
	`UICtlApp.Idling -= MethodName`

*In most cases, you will want your method to unsubscribe itself once it has run.*

## Homework
1. Create a `static` `Globals` Class
2. Add `properties` and `registration` 
3. Register the `UiApp` using `IdlingEvent` 


> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.