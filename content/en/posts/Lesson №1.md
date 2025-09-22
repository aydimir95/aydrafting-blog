+++
title = "C# + Revit API: Lesson 1 - Creating a Command to Automate Sheet Creation"
date = 2025-09-15T00:00:00+03:00
draft = false
tags = ["C#", "RevitAPI", "Tutorial"]
cover.image = "/images/Pasted image 20250915030834.png"
cover.alt = "What Each Part Does (Beginner-Friendly)"
+++

This lesson delivers on the promise from [Lesson 0](http://blog.aydrafting.com/en/posts/lesson-0/) — we’ll build a **real command** that:

- Tries to create a sheet (with proper error handling)
- Counts existing sheets in the document
- Shows a friendly summary to the user

> ✅ **Prereqs:** Finish Lesson 0’s `Application` setup first. If your project has no title blocks loaded, the command will tell you and exit safely.

---

# Application vs. Command

- **Application** (starts with Revit): sets up your add‑in — e.g., creates ribbon panels and buttons. Think “**wiring & menu**.”
- **Command** (runs when you click a button): does the actual work — reads/modifies the model. Think “**tool action**.”

In code, these map to different interfaces:

| Interface | When it runs | What it’s for | Typical examples |
|---|---|---|---|
| `IExternalApplication` | On Revit startup/shutdown | Add ribbon, register events | Add a panel & button |
| `IExternalCommand` | When user clicks a button | Do work (read/modify model) | Create sheets, place views |
| `IExternalDBApplication` | On startup/shutdown (no UI) | Listen to DB events | Batch/monitoring, analytics |
| `IExternalCommandAvailability` | Before command enables | Enable/disable buttons based on state | Disable when no doc |
| `IExternalEventHandler` | On demand from modeless UI | Safely touch model from background/UI threads | Progress windows, async tasks |

> 🧰 Using `Nice3point.Revit.Toolkit`, it offers convenience base classes like `ExternalApplication` and `ExternalCommand` that wrap these patterns. In this lesson we’ll **use the raw `IExternalCommand`** to learn fundamentals, while still showing how to hook it to a Nice3point ribbon.


## Why does Revit require `IExternal*` vs `External*` classes?

**Short answer:** Revit is a host application. It will only call classes that implement its well‑known **interfaces**. The official entry points are `IExternalApplication` (app startup/shutdown) and `IExternalCommand` (user‑invoked tools). 

**Where do `ExternalApplication` / `ExternalCommand` (no `I`) come from?**
Those are **convenience base classes** from libraries like Nice3point. They already implement the official interfaces for you and expose friendlier properties (e.g., `Document`, `UiDocument`), so your code is shorter. Under the hood, Revit still “sees” the interface through the base class.

### Do I ever put both on the **same class**?
Usually **no**. Keep them **separate** because their lifecycles differ:
- `IExternalApplication` (or `ExternalApplication`) runs **once per Revit session** — ideal for **creating ribbon UI**, registering events, etc.
- `IExternalCommand` (or `ExternalCommand`) runs **each time the user clicks** your button — ideal for **doing the work** (transactions, edits).

You *can* technically have a single assembly that contains **two classes**:
```text
Test.Application                → IExternalApplication / ExternalApplication
Test.Commands.CreateSheetCommand→ IExternalCommand     / ExternalCommand
```
That’s the normal pattern.

### How Revit finds your code (`.addin` mapping)
Revit looks for an **.addin** file that points to your assembly and the entry class. Two common setups:

**A) Recommended: Application loader + ribbon (one .addin entry)**
- Add one `<AddIn Type="Application">` entry that points to your `Application` class.
- In `OnStartup`, you create a ribbon panel and add a **push button** that targets your command class.

```xml
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<RevitAddIns>
  <AddIn Type="Application">
    <Name>MyAddin</Name>
    <Assembly>C:\Path\To\MyAddin.dll</Assembly>
    <FullClassName>Test.Application</FullClassName>
    <VendorId>AYD</VendorId>
    <VendorDescription>AYDrafting</VendorDescription>
  </AddIn>
</RevitAddIns>
```
> Your `Application.OnStartup()` then registers a push button like:
> `new PushButtonData("CreateSheet", "Create Sheet", assemblyPath, "Test.Commands.CreateSheetCommand");`

**B) Command‑only (shows under Add‑Ins → External Tools)**
- Add a `<AddIn Type="Command">` entry pointing **directly** to a command class. No ribbon setup.

```xml
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<RevitAddIns>
  <AddIn Type="Command">
    <Name>CreateSheet</Name>
    <Assembly>C:\Path\To\MyAddin.dll</Assembly>
    <FullClassName>Test.Commands.CreateSheetCommand</FullClassName>
    <VendorId>AYD</VendorId>
    <VendorDescription>AYDrafting</VendorDescription>
  </AddIn>
</RevitAddIns>
```

### When to use which
| You need… | Use |
|---|---|
| A button on a custom ribbon, app‑wide startup logic | `IExternalApplication` (or `ExternalApplication`) to create UI and wire buttons to commands |
| A user action that edits/reads the model on click | `IExternalCommand` (or `ExternalCommand`) with transactions |
| DB‑level event listeners with no UI | `IExternalDBApplication` |
| Enable/disable a command based on context | `IExternalCommandAvailability` |
| Safely modify the model from modeless UI/async | `IExternalEventHandler` |

**TL;DR:** The **`IExternal*` interfaces are the contract Revit calls**. Libraries provide `External*` base classes to make your life easier, but they still satisfy the same contract. Keep **Application** (startup & UI) and **Command** (do the work) in **separate classes** and wire them via the ribbon or a `.addin` entry.

---

# Homework

A single command called **`CreateSheetCommand`** that:
1. Get the active `Document` from the Revit context.
2. Start a `Transaction` named "Create Sheet".
3. Find a Title Block type (not instance!) and use it to create a new `ViewSheet`.
4. `Commit` the transaction on success.
5. `Collect` all sheets in the model and build a short summary:
	- Total number of sheets
	- Up to the first 5 sheets as `SheetNumber` - `Name`
6. Display the summary with a Revit-native dialog (`TaskDialog`).
7. Return `Result.Succeeded` if the command completes, otherwise use a rollback + error message as appropriate.


---

# Solution

{{< collapse title="Show/Hide Code" >}}

## `Project Solution`
```bash
Solution
|-> Test.csproj  
	|-> Commands
		|-> StartupCommand.cs  # Update
	|-> Resources
	|-> Application.cs  # Update
	|-> Test.addin
```

## `StartupCommand.cs` (the command)
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Test.Commands
{
    [Transaction(TransactionMode.Manual)]
    public class CreateSheetCommand : IExternalCommand
    {
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            // 1) Get the current document
            Document doc = commandData.Application.ActiveUIDocument.Document;

            string resultMessage = string.Empty;

            // 2) Try to create a sheet inside a transaction
            using (Transaction transaction = new Transaction(doc, "Create Sheet"))
            {
                transaction.Start();

                try
                {
                    // Find a title block TYPE (not instance)
                    ElementId titleBlockId = new FilteredElementCollector(doc)
                        .OfCategory(BuiltInCategory.OST_TitleBlocks)
                        .WhereElementIsElementType()
                        .FirstElementId();

                    // Create the sheet
                    ViewSheet newSheet = ViewSheet.Create(doc, titleBlockId);
                    transaction.Commit();

                    resultMessage = $"✅ Sheet created successfully!\nSheet Number: {newSheet.SheetNumber}";
                }
                catch (InvalidOperationException)
                {
                    // No title blocks in the project
                    transaction.RollBack();
                    resultMessage = "❌ No title blocks found in the project.\nInsert → Load Family → add a title block first.";
                }
                catch (Exception ex)
                {
                    // Any other error
                    transaction.RollBack();
                    resultMessage = $"❌ Error creating sheet: {ex.Message}";
                }
            }
			
            // 3) Count existing sheets
            var allSheets = new FilteredElementCollector(doc)
                .OfClass(typeof(ViewSheet))
                .Cast<ViewSheet>()
                .ToList();
			
            resultMessage += $"\n\n📊 Total sheets in document: {allSheets.Count}";
			
            if (allSheets.Count > 0)
            {
                resultMessage += "\n\nFirst 5 sheets:";
                foreach (var sheet in allSheets.Take(5))
                {
                    resultMessage += $"\n• {sheet.SheetNumber} - {sheet.Name}";
                }
            }
			
            // 4) Show a result dialog
            TaskDialog.Show("Sheet Creation Result", resultMessage);
            return Result.Succeeded;
        }
    }
}
```

## `Application.cs` (the ribbon wiring)
```csharp
using Nice3point.Revit.Toolkit.External;
using Test.Commands;

namespace Test
{
    /// <summary>
    ///     Application entry point
    /// </summary>
    [UsedImplicitly]
    public class Application : ExternalApplication
    {
        public override void OnStartup()
        {
            CreateRibbon();
        }

        private void CreateRibbon()
        {
            var panel = Application.CreatePanel("Commands", "Test");

            panel.AddPushButton<CreateSheetCommand>("Execute")
                .SetImage("/Test;component/Resources/Icons/RibbonIcon16.png")
                .SetLargeImage("/Test;component/Resources/Icons/RibbonIcon32.png");
        }
    }
}
```

> If you aren’t using Nice3point, you’ll add the button via plain Revit API in your `IExternalApplication.OnStartup` implementation and map the button to `CreateSheetCommand` in your `.addin` file. We’ll cover a plain‑API ribbon in one of the later lessons.

## Result

![Pasted image 20250915031251.png](</images/Pasted image 20250915031251.png>)

---
{{< /collapse >}}

# Walkthrough (beginner‑friendly)

## 1) The required attribute

```csharp
[Transaction(TransactionMode.Manual)]
```
**Why Manual?** You choose when to `Start()`, `Commit()`, or `RollBack()` a change to the model. That’s the normal mode for anything that **modifies** the model.

Other options you’ll see:
- `ReadOnly` — safe for analysis/reporting (no model edits allowed)
- `Automatic` — legacy; not recommended

## 2) The command contract

```csharp
public class CreateSheetCommand : IExternalCommand
{
    public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
    {
        // ...
    }
}
```
- Revit **calls** `Execute` when the user clicks your button.
- You **return** a `Result`: `Succeeded`, `Cancelled`, or `Failed`.
- The three parameters give you context; most commonly you’ll use:
  - `commandData.Application.ActiveUIDocument.Document` → the active `Document` (your model)

## 3) Transactions (the safety net)

Everything that changes the model must be wrapped in a `Transaction`:

```csharp
using (var t = new Transaction(doc, "Something"))
{
    t.Start();
    try
    {
        // modify model
        t.Commit();
    }
    catch
    {
        t.RollBack(); // undo all changes if something failed
        throw;        // or set a user‑friendly message
    }
}
```

## 4) Finding elements efficiently

`FilteredElementCollector` is your workhorse for querying the model:

```csharp
var titleBlockTypeId = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_TitleBlocks)
    .WhereElementIsElementType() // types, not placed instances
    .FirstElementId();           // throws if none → we catch it
```

## 5) Creating a sheet

```csharp
ViewSheet newSheet = ViewSheet.Create(doc, titleBlockTypeId);
```
If there’s no title block type, Revit can’t create a sheet — hence the `InvalidOperationException` catch above.

## 6) Talking to the user

Use `TaskDialog` for in‑Revit messages. It supports titles, main text, and buttons, and it looks native.

---

# `Interfaces` — clear differences at a glance

```text
IExternalApplication  → runs at app start/stop, set up ribbon & events
IExternalCommand      → runs on click, does the work (transactions inside)
IExternalDBApplication→ runs at start/stop (no UI), hooks DB‑level events
IExternalEventHandler → bridge for modeless UIs / async → into the model
IExternalCommandAvailability → enable/disable commands based on context
```

### “`I` vs. `Nice3point` base class”
Two equivalent ways to write a command:

**Raw interface (this lesson)**
```csharp
public class MyCommand : IExternalCommand
{
    public Result Execute(ExternalCommandData c, ref string m, ElementSet e) { /* ... */ }
}
```

**Nice3point convenience**
```csharp
public class MyCommand : ExternalCommand
{
    public override void Execute() { /* Document, UiDocument available as properties */ }
}
```

Use whichever your team prefers. Understanding the **raw interface** helps you debug anything.

---

# Troubleshooting

- **“No title blocks found”** → Insert → Load Family → add a title block (`.rfa`). Try again.
- **Button doesn’t appear** → Check your `.addin` mapping and the fully‑qualified class name. If using Nice3point, ensure your `ExternalApplication` runs on startup.
- **Transaction errors** → Make sure you call `Start()` **before** modifying the model, and either `Commit()` or `RollBack()` for every started transaction.
- **Null `ActiveUIDocument`** → There is no open project/document. Open a model first.

---

# What’s next

- **Lesson 2**: A quick pit stop on fundamentals (bits, bytes, number systems in C#) to level‑set.
- Then: placing views on sheets, element filters in depth, selection APIs, and building small modeless tools with `IExternalEventHandler`.

> Shout‑out to [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru) for great Revit API inspiration.