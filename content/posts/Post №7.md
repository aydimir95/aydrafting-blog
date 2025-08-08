+++
title = "C# + Revit API: Lesson 7 - Introduction to Classes"
date = 2025-08-08T13:06:57+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
+++

## 1. Introduction
### Sneak Peak - Project Structure
1. Commands
2. Extensions
3. Forms 
4. General
5. Resources
6. Utilities
*These are folders which contain various files that our toolbar will utilize.*
- *Note that these are not necessarily aligned with namespaces (which will be covered later)*

---
# 2. What is a Class?
1. In C#, classes are templates related to the creation and management of objects. There are many predefined `classes` available in C# and the Revit API.
2. We use them for a wide range of things and will regularly be creating and developing our own classes.

---
### Accessing properties / methods of a Class
1. Property:
	1. `object.Property`
2. Method:
	1. `Object.Method(argument1, argument2, etc)`

### Namespaces
1. When we create classes, we first tell them where they belong in our project.
2. Namespaces can be nested within others using a dot separator, eventually tied back to our `.addin` namespace.
```C#
// Revit API
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;

// geeWiz
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

- Access modifiers control how this code can be accessed inside and outside your project.
- You will typically need to declare at least on of ***public/private***, 
	- And sometimes ***static*** for the purposes we will use them for early on.
### `Static` Modifier
- The static access modifier is a difficult concept to grasp at first, so we will simplify it somewhat.
- Classes with a static modifier do not support the creation of objects of that class (instantiated).
- We commonly take advantage of this to create classes which behave more like toolkits, where the class itself acts more like a singe object we can call upon to do things for us.
```text
So basically, the `STATIC` modifier is one instrument that you could use to build a complex script with.
```
### `Public` and `Private` Modifier
- The ***public*** modifier lets you access something anywhere in your project.
- The ***private*** modifier limits access to the same class instead (generally for behind-the-scenes code in the class itself).

*There are `other modifiers`, but let's keep it simple.*

### Class Declaration
`modifiers class ClassName : Interface(s)`

After our modifiers we must define our class by using the keyword 'class', followed by a Class Name.

Generally, most people use `PascalCase` for class names, and you should choose names which are not reserved elsewhere.

### Interface(s) (optional)
`modifiers class ClassName : Interface(s)`

- Interfaces are optional agreements that the class must form with predefined class templates. We will cover these in our next lesson at a basic level.
- They usually provide methods and properties which would otherwise be cumbersome to access/define, as well as ensuring the class follows some requirements.

### Referencing a Class

- Static example (access):
	- var myInstance = ClassName;
- Non-static example (instantiate)
	- var myInstance = new ClassName();

### Homework 
Let's do the following:
- Set up a `class` file (.cs) in our project
- Create a `namespace` for it
- Define our class (`non-static`, `public`)

*We will use this class later in our toolbar. Its purpose is to store and process results from forms we create.*

---
# 3. Constructors
- By default, your class assumes it is constructed with default options specified for properties it supports.
- If we want to make our constructor more specific, we need to add constructors to the class first.
- We can support more than one constructor, which is typically referred to as polymorphism.

### Constructor Syntax
```C#
Class declaration
{
	modifiers ClassName(arguments)
	{
		Code logic here;
	}
}
```
### Homework
1. Add a generic constructor
2. Add a specific constructor

*We will provide the option for a user to specify the pre-cancelled status of a form, as well as declare one without any arguments.*


# 4. Properties
- We can define custom properties the class is able to support. Whilst you can make the properties available outside the class, best practice is to keep them private to the class, then using the property simple but get/set that value instead.
- Generally, we will be keeping things simple but will show how you can use private properties as well (fields), given it is better practice.

### Declaring a property
```C# 
Class declaration
{
	modifiers type PropertyName{get;set}
}
```

### Using a private field 
```C#
Class declaration
{
	private type fieldName // Camel Case for properties
	public type PropertyName
	{
		get {return fieldname} // lower case for the fields
		set {fieldname=value}
	}
}
```

# 5. Methods
- Unlike the properties, methods generally do something to or with a class object. They are called similarly to a property but support the inclusion of arguments.
- Whilst for a property we declare its type, for a method we declare its return type (the type of data the method returns at the end).

*If we want to return nothing, we can use the type **`void`**.*

### Declaring a method
```C#
Class declaration
{
	modifiers returnType MethodName(kwarg) // kwarg - arguments are optional
	{
		Code logic;
		return objectOfType;
	}
}
```

### Homework
- Add some `properties` 
- Demonstrate how to use a `field`
- Demonstrate how to make a `method`
- Call on our `class` in some code

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


# 6. Interfaces
- Interfaces provide abstract templates (sometimes called contracts) by which classes must more specifically implement them.
- By the end of this lesson we will have implemented two in our add-in.

### Interface Example

- This interface entails that any class implementing it must have 2 properties and methods.
- They are abstractly provided and are specifically built in the class itself.
```C# 
// Pseudo Code
IAnimal 

int Legs;
string Name;


void MakeNoise();
```
```C#
// Real Implementation
class Dog: IAnimal

int Legs = 4;
string Name = "Dog";

void MakeNoise()
{
	Dog.Woof();
}
```
- We provide the interface to the `Dog class`, which will in turn expect the properties and method to be specified further.
- You can add more than 1 interface to a class and we usually name interfaces with a prefix of '`I`'.

### Argument provision
- Many Interfaces provided by the Revit API have further code support included for us.
- For example, Interfaces commonly provide methods which are triggered by events. We do not have to set up the sender/receiver methods if we implement the interface, only specify what happens when the event occurs.


## Application Variants
- When we implement our two interfaces, we will be using some special types.

#### ***`UIControlledApplication`***
- Provides access to the Revit application, is commonly on startup and shutdown, where a document is not yet available.

#### ***`ControlledApplication`***
- Represents the application service, giving us access to documents, options, and application specific settings (e.g. language).

#### ***`UIApplication`***
- Similar to UIControlledApplication, but it is available during our session. We will be using this a lot and in a future lesson we will register it to a globally accessible variable.

#### ***`UIDocument`***
- Represents the current document at a UI level, providing access to aspects such as selection and opened views.

#### ***`Document`***
- Represents the current document, providing access to many Revit API classes, methods, and properties at the document level, e.g. collecting elements in the document.

### How we can access them?
```C#
uiCtlApp // Available at start-up/shutdown
ctlApp   // uiCtlApp.ControlledApplication
uiApp    // Idling event / via commands

uiDoc    // uiApp.ActiveUIDocument 
doc      // uiDoc.Document
```
### Homework
- Implement ***`IExternalApplication`***
- Implement ***`IExternalCommand`***
- Collect the ***`ControlledApplication`***
- Collect the ***`Document`*** in a command

#### We now have a basic understanding of:
- `Interfaces`
- `IExternalApplication`
- `IExternalCommand`
- `Application` Classes
- `Document` Classes

# 7. Create a `PushButton`
- Let's set up a button we can run our command from (we had this before, but we're doing it the typical way vs the `Nice3Point` way).
- We will create a tab, a panel, a button and finally set up a basic command that runs when we press it.

## Understanding Names
1. `RibbonTab`
2. `RibbonPanel`
	1. `Ribbon`
3. `PushButton`

### What do we need to do?
1. Create our `add-in` Tab
2. Add a `RibbonPanel` to the Tab
3. Add a `PushButton` to the Ribbon Panel

#### *Related API Classes:*
1. `UIControlledApplication` > Tab
2. `Tab` > `RibbonPannel`
3. `RibbonPanel` > `PushButtonData` > `PushButton`

#### *Properties of a PushButton*
1. **`AssemblyName`** - Assembly Path of the Button
2. **`AvailabilityClassName`** - The full class name of the class providing the entry point to decide availability of this push button.
3. **`ClassName`** - The name of the class containing the implementation for the command.
4. **`Enabled`** - Gets or sets a value indicating whether the item is enabled.
5. **`Image`** - The image of the button.
6. **`IsEnabledByContext`** - Indicates if this button can be executed. True is the pushbutton is permitted to be executed based on the current Revit context (active doc, active view, active tool). False if the pushbutton is disabled because of the active context.
7. **`ItemText`** - Gets or sets the text displayed of the item.
8. **`ItemType`** - Get the item type.
9. **`LargeImage`** - The large image shown on the button.
10. **`LongDescription`** - Long description of the command tooltip.
11. **`Name`** - The name of the item.
12. **`ToolTip`** - The description that appears as a ToolTip for the item.
13. **`ToolTipImage`** - The image to show as a part of the button extended tooltip.
14. **`Visible`** - Gets or sets a value indicating whether the item is visible.

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

In the next video, we will add to this:
- Create and assign `icons` and `tooltips`,
- Develop a naming system to simplify it all.


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

## Basic `Sub/Unsub` syntax 
Subscribe to `Idling` event 
	`UICtlApp.Idling += MethodName`

Unsubsribe from `idling` event
	`UICtlApp.Idling -= MethodName`

*In most cases, you will want your method to unsubscribe itself once it has run.*

## Homework
1. Create a static Globals Class
2. Add properties and registration 
3. Register the `UiApp` using IdlingEvent 


> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.