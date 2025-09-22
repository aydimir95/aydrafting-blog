+++
title = "C# + Revit API: Lesson 8 - Static vs. Extension Methods"
date = 2025-10-27T18:00:00+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250902205904.png"
cover.alt = "Static vs. Extension Methods"
+++

```C#
modifiers returnType Method(this extendedType, args)
{
	coding logic;
}
```

So far, we have been using `static utility classes` to store common methods to call upon. Alternatively, we can use `Extension Methods` to: 
1. Make the code readable.
2. To let you `Add` methods to existing types.
	- They provide **syntactic sugar** (a nicer way to write code), so calls look like instance methods:
```C#
string x = "hello";
string y = x.Reverse();  // Looks built-in, but it's actually an extension
```

---

if `Reverse` was written as a **static utility method** instead of an **extension**, it might look like this:

### **`Utility method version`**
```C#
public static class StringUtils
{
    public static string Reverse(string s)
    {
        char[] arr = s.ToCharArray();
        Array.Reverse(arr);
        return new string(arr);
    }
}
```
**`Usage (static way):`**
```C#
string x = "hello";
string y = StringUtils.Reverse(x); // <-- utility call
```

---

### `Extension Method` version
```C#
public static class StringExtensions
{
    public static string Reverse(this string s) // "this" turns it into an extension
    {
        char[] arr = s.ToCharArray();
        Array.Reverse(arr);
        return new string(arr);
    }
}
```

**Usage (`extension` way):**
```C#
using MyExtensions; // namespace with StringExtensions

string x = "hello";
string y = x.Reverse(); // looks like built-in, but calls static method under the hood
```

**Key difference:**
- **Static** → `StringUtils.Reverse(x)` — always pass the value as an argument.
- **Extension** → `x.Reverse()` — looks like the method belongs to string, but it’s just compiler sugar for `StringExtensions.Reverse(x)`.

3. Microsoft’s Official Definition
	- **Extension members** let you add methods to an existing type **without** subclassing, recompiling, or modifying its original code.
	- These methods must be declared in a **static class**, using the this keyword on the first parameter to indicate the extended type.
	- Example: LINQ methods like Where, Select, GroupBy are extension methods on `IEnumerable<T>.`

---
## The idea in one picture

- **Utility method** = a tool on the shelf you call by name.
    `MathUtils.IsEven(4)`
- **Extension method** = the same tool glued onto the type so it _reads_ like a built-in ability.
    `4.IsEven()`
Same logic, different syntax.

**Utility (plain function in a static class)**
```C#
public static class MathUtils
{
    public static bool IsEven(int n) => n % 2 == 0;
}

// use
bool a = MathUtils.IsEven(4);
```

<br>

**Extension (adds “instance-like” call to a type)**
```C#
namespace MyExtensions
{
    public static class IntExtensions     // class must be static
    {
		// method must be static; first param has `this`
        public static bool IsEven(this int n)  

            => n % 2 == 0;
    }
}
```

<br>

**Usage**
```C#
using MyExtensions;  // import the namespace that contains IntExtensions

bool b = 4.IsEven(); // now it reads like a built-in method
```

---
# C# Extension Methods vs Static Utilities — Cheat Sheet

_A one‑pager you can print and keep by your keyboard._

---

## **The 5‑second summary**
- **Static utility**: call a function on a helper class. `StringUtils.Reverse(x)`
- **Extension method**: same function, but _called like an instance_. `x.Reverse()`
- **Truth**: `x.Reverse()` is compiler sugar for `StringExtensions.Reverse(x)`.

---

## **Static Utility Pattern**

```C#
public static class StringUtils
{
    public static string Reverse(string s)
    {
        var a = s.ToCharArray();
        Array.Reverse(a);
        return new string(a);
    }
}

// Usage
var y = StringUtils.Reverse("hello");
```

---

## Extension Method Pattern
Rules:
1. Method **lives in a static class**
2. Method itself is **static**
3. **First parameter** has this and is the type you’re extending
4. The **namespace must be in scope** via using

```C#
namespace MyExtensions
{
    public static class StringExtensions
    {
        public static string Reverse(this string s)
        {
            var a = s.ToCharArray();
            Array.Reverse(a);
            return new string(a);
        }
    }
}


// Usage (note the "using")
using MyExtensions;

var y = "hello".Reverse();
```

---

## **What the Compiler Actually Does**

```bash
Your code:                 Desugared by compiler:
---------                  ----------------------------------
"hello".Reverse()   ==>    StringExtensions.Reverse("hello");
```

**Lookup steps**

1. Check receiver type (string) for an **instance** `Reverse()` → none.
2. Search imported `namespaces` for **static methods** whose **first param** is this string.
3. Pick best match (normal overload rules). Instance methods (if any) always **win** over extensions.

---

## **When to Use Which**

- **Use static utility** when:
    - It’s general‑purpose or spans many types (logging, parsing, config).
    - You don’t want to pollute IntelliSense for common types.
    
- **Use extension method** when:
    - The behavior clearly “belongs” to a single type.
    - You want fluent, chainable syntax (e.g., LINQ‑style pipelines).

---

## **Memorize these**

- Extensions **don’t modify** the type; they’re just syntax `sugar`.
- If the type later adds a real instance method with the same signature, the **real one wins**.
- Resolution uses the variable’s **compile‑time type**, not runtime.
- You must `using` the extension’s **namespace**, or it won’t be found.
- Keep extensions **focused**; too many can clutter `IntelliSense`.

---

## Minimal Working Example (copy/paste)

```C#
// StringExtensions.cs
namespace MyExtensions
{
    public static class StringExtensions
    {
        public static bool IsNullOrBlank(this string? s)
            => string.IsNullOrWhiteSpace(s);
    }
}

// Program.cs
using System;
using MyExtensions;

class Program
{
    static void Main()
    {
        string x = "  ";
        Console.WriteLine(x.IsNullOrBlank()); // True
    }
}
```

---

## **Quick Troubleshooting**

- **CS1061: ‘Type’ does not contain a definition for ‘Foo’** → Missing `using` for the extension’s namespace or wrong this type.
- **Ambiguous call** → Multiple extensions in scope with same signature; qualify with full class `name` or remove one `using`.
- **Not being called** → A real instance method with same signature exists and **shadows** your extension.    

---

### Mental Model (ASCII)

```C#
Caller                       Compiler Resolution
------                       ------------------
x.Reverse()          ->      1) Check instance on string → none
                             2) Scan imported namespaces for
                                static methods with first param: this string
                             3) Choose best match
                             4) Rewrite to StringExtensions.Reverse(x)
```

> `utilities` = toolbox; `extensions` = bolt‑on skills. Same logic, nicer syntax.

# Extension Method Naming

```C#
// Extension namespace
guRoo.Extensions

// Class file name
guRoo\Extentions\ExtendedClass_Ext

// Extension method
Ext_MethodName
```

# Homework
### Extend your methods:
- Set up a new folder and namespace
- Set up 2 extension classes in your project
- Set up extension methods
- Modify some of our code to use the above

# Solution
## Code:
### `Project Solution`
```bash
Solution
|-> guRoo
	|-> Dependencies
	|-> Commands
		|-> General 
			|-> Cmds_General.cs 
	|-> Forms
	|-> General 
		|-> Globals.cs 
	|-> Extensions // Add a New Folder
		|-> UIControlledApplicaiton_Ext.cs // Create a New Class
		|-> RibbonPanel_Ext.cs // Create another New Class
	|-> Resources
		|-> Files 
			|-> Tooltips.resx 
		|-> Icons 
		|-> Icons16 
			|-> General_test16.png 
		|-> Icons32 
			|-> General_test32.png 
	|-> Utilities
		|-> Ribbon_Utils.cs 
	|-> Application.cs // Updated
	|-> guRoo.addin
```

1. Borrow an existing static method from `Ribbon_Utils.cs` and extend it:
### `UIControlledApplicaiton_Ext.cs`
```C#
using Autodesk.Revit.UI;
using System.Diagnostics;

namespace guRoo.Extensions
{
	public static class UIControlledApplication_Ext
	{

// ----------------------------------------------------------------------------
// 1. Add "this"
// 2. AddRibbonTabToPanel -> AddRibbonTab
// ----------------------------------------------------------------------------
		public static Result AddRibbonTab(this UIControlledApplication uiCtlApp, string tabName)
        {
            try
            {
	            // Try to add a tab:
                uiCtlApp.CreateRibbonTab(tabName);
                return Result.Succeeded;
            }
            catch
            {
	            // Report the error if it fails:
                Debug.WriteLine($"Error: Could not create a tab: {tabName}");
                return Result.Failed;
            }
        }

// ----------------------------------------------------------------------------
// 1. Add "this"
// 2. AddRibbonPanelByName -> AddRibbonPanel
// ----------------------------------------------------------------------------

		        // Method to create a "Panel"
        public static RibbonPanel AddRibbonPanel(this UIControlledApplication uiCtlApp, string tabName, string panelName)
        {
            try
            {
                uiCtlApp.CreateRibbonPanel(tabName, panelName);
            }
            catch
            {
                Debug.WriteLine($"Error: Could not add {panelName} to {tabName}");
                return null;
            }
            return uiCtlApp.GetRibbonPanel(tabName, panelName);
        }

        // Method to get that "Panel"
        public static RibbonPanel GetRibbonPanel(this UIControlledApplication uiCtlApp, string tabName, string panelName)
        {
            var panels = uiCtlApp.GetRibbonPanels(tabName);
            foreach (var panel in panels)
            {
                if (panel.Name == panelName)
                    return panel;
            }

            // If Not found
            return null;
        }

// ----------------------------------------------------------------------------

	}
}
```

2. Update `Applications.cs`:
### `Application.cs`
```C#
// Autodesk
using Autodesk.Revit.UI;

// guRoo =======IMPORTANT=======
using gRib = guRoo.Utilities.Ribbon_Utils;
using guRoo.Extensions;

namespace guRoo
{
    public class Application : IExternalApplication
    {
        private static UIControlledApplication _uiCtlApp;
        public Result OnStartup(UIControlledApplication uiCtlApp)
        {


            #region Globals registration
            _uiCtlApp = uiCtlApp;
            try
            {
                _uiCtlApp.Idling += RegisterUiApp;
            }
            catch
            {
                Globals.UiApp = null;
                Globals.UsernameRevit = null;
            }
            Globals.RegisterProperties(uiCtlApp);
            Globals.RegisterTooltips("guRoo.Resources.Files.Tooltips");
            #endregion

            #region Ribbon setup
            
            //Add Ribbon Tab
            uiCtlApp.AddRibbonTab(Globals.AddinName); 
            
            // Create a Panel
            var panelGeneral = uiCtlApp.AddRibbonPanel(uiCtlApp, Globals.AddinName, "General");
            
            // Add Button to Panel
            var buttonTest = panelGeneral.AddPushButton("Testing", "guRoo.Cmds_General.Cmd_Test");
            #endregion
            
            // Final Return
            return Result.Succeeded;
        }

        #region On shutdown method
        public Result OnShutdown(UIControlledApplication uiCtlApp)
        {
            return Result.Succeeded;
        }
        #endregion

        #region Use idling to register UiApp
        private static void RegisterUiApp(object sender, IdlingEventArgs e)
        {
            _uiCtlApp.Idling -= RegisterUiApp;
            if (sender is UIApplication uiApp)
            {
                Globals.UiApp = uiApp;
                Globals.UsernameRevit = uiApp.Application.Username;
            }
        }
        #endregion
    }
}
```

3. And remove that part from `Ribbon_Utils.cs`:
### `Ribbon_Utils.cs`
```C#
using Autodesk.Revit.UI;
using System.Diagnostics;

namespace guRoo.Utilities
{
	public static class Ribbon_Utils
	{

// =====REMOVED to UIControlledApplicaiton_Ext.cs=====
        // Method to create a "Tab"
//        public static Result AddRibbonTab(UIControlledApplication uiCtlApp,string tabName)
//        {
//            try
//            {
//                uiCtlApp.CreateRibbonTab(tabName);

//                return Result.Succeeded;
//            }
//            catch
//            {
//                Debug.WriteLine($"Error: Could not create a tab: {tabName}");
//                return Result.Failed;
//            }
//        }

        //// Method to create a "Panel"
        //public static RibbonPanel AddRibbonPanelToTab(UIControlledApplication uiCtlApp, string tabName, string panelName)
        //{
        //    try
        //    {
        //        uiCtlApp.CreateRibbonPanel(tabName, panelName);
        //    }
        //    catch
        //    {
        //        Debug.WriteLine($"Error: Could not add {panelName} to {tabName}");
        //        return null;
        //    }
        //    return GetRibbonPanelByName(uiCtlApp, tabName, panelName);
        //}

        //// Method to get that "Panel"
        //public static RibbonPanel GetRibbonPanelByName(UIControlledApplication uiCtlApp, string tabName, string panelName)
        //{
        //    var panels = uiCtlApp.GetRibbonPanels(tabName);
        //    foreach (var panel in panels)
        //    {
        //        if (panel.Name == panelName)
        //            return panel;
        //    }

        //    // Not found
        //    return null;
        //}
// =====REMOVED to UIControlledApplicaiton_Ext.cs=====



// =====REMOVED to RibbonPanel_Ext.cs=====
        // Method to create a "Button" to "Panel"
        
        /// <summary>
        /// Fill this summary for Methods to be described on Mouse Hover.
        /// </summary>
        /// <param name="panel">This is the RibbonPanel to add to.</param>
        /// <param name="buttonName">Test</param>
        /// <param name="className">Test</param>
        /// <param name="internalName">Test</param>
        /// <param name="assemblyPath">Test</param>
        /// <returns></returns>
//    public static PushButton AddPushButtonToPanel(RibbonPanel panel, string buttonName, string className)
//    // string internalName, -> NOT NEEDED ANYMORE
//    // string assemblyPath)-> NOT NEEDED ANYMORE
//    {
//        if (panel is null)
//        {
//            Debug.WriteLine($"Error: Could not create {buttonName}.");
			//return null;
//        }
//        // Open PushButtonData Constructor and check what's needed

//        // Get the base name from below
//        var baseName = CommandToBaseName(className);
//        #endregion 

//        // Create a PushButtonData object:
//        var pushButtonData = new PushButtonData(baseName, buttonName, Globals.AssemblyPath, className);

//        // if the button was made - return it:
//        if (panel.AddItem(pushButtonData) is PushButton pushButton)
//        {
//            pushButton.ToolTip = LookupTooltip(baseName);
//            #region ====The Updated Part 4 Start====
//            // We will come back to this:
//            pushButton.Image = GetIcon(baseName, resolution: 16);
//            pushButton.LargeImage = GetIcon(baseName, resolution: 32); return pushButton;
//        }
//        else
//        {
//            Debug.WriteLine($"Error: Could not create {buttonName}.");
			//return null;
//        }
//    }
// =====REMOVED to RibbonPanel_Ext.cs=====


        // Method to get the base name of a command:
        public static string CommandToBaseName(string commandName)
        {
            return commandName.Replace("guRoo.Cmds_", "").Replace(".Cmd", "");
        }

        // Method to get a value from a dictionary key
        public static string LookupTooltip(string key, string failValue = null)
        {
            failValue ??= "No tooltip value was found."; // ??= -> if this is null set it to the following

            if (Globals.Tooltips.TryGetValue(key, out string value))
            {
                return value;
            }

            return failValue;
        }

		// Method to get an icon as an image source
		public static ImageSource GetIcon(string baseName, int resolution = 32)
		{
			var resourcePath = $"guRoo.Resources.Icons{resolution}.{baseName}{resolution}.png";
			
			using  (var stream = Globals.Assembly.GetManifestResourceStream(resourcePath))
			{
				if (stream is null) { return null; }
				
				var decoder = new PngBitmapDecoder(
					stream, 
					BitmapCreateOptions.PreservePixelFormat, 
					BitmapCacheOption.Default);
				
				if (decoder.Frames.Count > 0)
				{
					return decoder.Frames.First();
				}
				else
				{
					return null;
				}
			}
		}
    }
}
```


### `RibbonPanel_Ext.cs`
```C#
using Autodesk.Revit.UI;
using System.Diagnostics;
using gRib = guRoo.Utilities.Ribbon_Utils;

namespace guRoo.Extensions
{
    public static class RibbonPanel_Ext
    {

    // Adds a new push button to a specified RibbonPanel in Revit.
        /// <summary>
        /// Creates and adds a <see cref="PushButton"/> to the given <see cref="RibbonPanel"/>.
        /// Configures the button’s tooltip and icon images based on the associated command name.
        /// </summary>
        /// <param name="panel">The target RibbonPanel where the button will be added.</param>
        /// <param name="buttonName">The display name of the button as it appears in the UI.</param>
        /// <param name="className">The full class name (namespace + class) of the command to execute when the button is clicked.</param>
        /// <returns>
        /// The created <see cref="PushButton"/> instance if successful; otherwise, <c>null</c>.
        /// </returns>

        public static PushButton AddPushButton(this RibbonPanel panel, string buttonName, string className)
        {
            if (panel is null)
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
                return null;
            }
            // Open PushButtonData Constructor and check what's needed
            var baseName = gRib.CommandToBaseName(className);
            var pushButtonData = new PushButtonData(baseName, buttonName, Globals.AssemblyPath, className);

            if (panel.AddItem(pushButtonData) is PushButton pushButton)
            {
                pushButton.ToolTip = gRib.LookupTooltip(baseName);
                pushButton.Image = gRib.GetIcon(baseName, resolution: 16);
                pushButton.LargeImage = gRib.GetIcon(baseName, resolution: 32); return pushButton;
            }
            else
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
                return null;
            }
        }
    }
}
```



<br>

> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.

