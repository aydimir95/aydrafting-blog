+++
title = "C# + Revit API: Lesson 1 — A Simple Walkthrough of the Command"
date = 2025-08-06T01:00:00+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
+++

This post explains **one concrete command**—line by line—so a beginner can follow without extra abstractions.

  

**What this command does when you click your add-in button:**

1. Tries to create a **sheet** (using an **invalid** title block on purpose → shows how error handling works).
    
2. Collects up to **10 existing sheets** and formats their numbers/names.
    
3. Displays the result in a **WPF dialog** via a ViewModel.
  

> ✅ This article focuses only on the command. It assumes you’ve already wired a ribbon button (and .addin) that triggers StartupCommand.

---

## **The Command (Full Code)**

```C#
using Autodesk.Revit.Attributes;
using Nice3point.Revit.Toolkit.External;
using UKON.Views;
using UKON.ViewModels;

namespace UKON.Commands
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
            var viewModel = Host.GetService<UKONViewModel>();
            
            var titleBlockId = ElementId.InvalidElementId;
            string resultMessage = "";
            
            using (var transaction = new Transaction(Document, "Create Sheet"))
            {
                transaction.Start();
                
                try
                {
                    var sheet = ViewSheet.Create(Document, titleBlockId);
                    transaction.Commit();
                    resultMessage = "Sheet created successfully!";
                }
                catch (Autodesk.Revit.Exceptions.ArgumentException ex)
                {
                    transaction.RollBack();
                    resultMessage = $"Sheet could not be made: {ex.Message}";
                }
                catch (Exception ex)
                {
                    transaction.RollBack();
                    resultMessage = $"Error: {ex.Message}";
                }
            }
            
            // Get sheet information to display
            var allSheets = new FilteredElementCollector(Document).
					            OfClass(typeof(ViewSheet)).
					            ToElements().
					            ToList();
				
            if (allSheets.Count > 0)
            {
                var sheetNames = new List<string>();
                for (int i = 0; i < Math.Min(10, allSheets.Count); i++)
                {
                    var sheet = allSheets[i] as ViewSheet;
                    sheetNames.Add($"{sheet.SheetNumber} - {sheet.Name}");
                }
                
                resultMessage += $"\n\nFound {allSheets.Count} sheets:
					               \n" + string.Join("\n", sheetNames);
            }
            else
            {
                resultMessage += "\n\nNo sheets found in document.";
            }
            
            viewModel.ResultMessage = resultMessage;
            
            var view = new UKONView(viewModel);
            view.ShowDialog();
        }
    }
}
```

---

## **What Each Part Does (Beginner-Friendly)**

  

### **1) Imports**

```C#
using Autodesk.Revit.Attributes;         // [Transaction(...)] attribute
using Nice3point.Revit.Toolkit.External; // ExternalCommand base + Host DI
using UKON.Views;                        // WPF Window (UKONView)
using UKON.ViewModels;                   // ViewModel (UKONViewModel)
```

- **Revit attributes** let you declare transaction behaviour.
    
- **Nice3point Toolkit** provides a simplified ExternalCommand base (gives you Document) and DI access via `Host.GetService<T>().`
    
- **Views/ViewModels** are your WPF MVVM types.
    

---

### **2) Class & Attributes**

```C#
[UsedImplicitly]
[Transaction(TransactionMode.Manual)]
public class StartupCommand : ExternalCommand
```

- StartupCommand runs **when the user clicks** your button.
    
- `[Transaction(TransactionMode.Manual)]` = **you** start/commit/rollback changes.
    
- ExternalCommand (Nice3point) simplifies the Revit command pattern.
    

  

> UsedImplicitly is an analyzer hint (e.g., JetBrains) so tooling doesn’t flag it as “unused.”

---

### **3) Getting the `ViewModel`**

```C#
var viewModel = Host.GetService<UKONViewModel>();
```

- Pulls a **ViewModel instance** from DI so the dialog can display results via data binding.
    

---

### **4) Intentionally Invalid Title Block**

```C#
var titleBlockId = ElementId.InvalidElementId; // invalid on purpose
string resultMessage = "";
```

- We **force a failure** to demonstrate safe error handling.
    
- resultMessage will collect feedback for the user.
    

---

### **5) Transaction + Error Handling Around** 

### `ViewSheet.Create`

```C#
using (var transaction = new Transaction(Document, "Create Sheet"))
{
    transaction.Start();
    try
    {
        var sheet = ViewSheet.Create(Document, titleBlockId);
        transaction.Commit();
        resultMessage = "Sheet created successfully!";
    }
    catch (Autodesk.Revit.Exceptions.ArgumentException ex)
    {
        transaction.RollBack();
        resultMessage = $"Sheet could not be made: {ex.Message}";
    }
    catch (Exception ex)
    {
        transaction.RollBack();
        resultMessage = $"Error: {ex.Message}";
    }
}
```

- **Revit is read-only** unless you’re inside a Transaction.
    
- Creating a sheet with an invalid title block throws **ArgumentException** → we **rollback** safely and show the message.
    
- Any unexpected error also triggers a rollback.
    

  

> This is the core pattern you’ll reuse for **any change** in Revit: _Start → Do work → Commit or RollBack on error_.

---

### **6) Collecting Existing Sheets**

```C#
var allSheets = new FilteredElementCollector(Document)
				    .OfClass(typeof(ViewSheet))
				    .ToElements()
				    .ToList();
```

- Use FilteredElementCollector to **find elements** in the document.
    
- Here we collect **all sheets**.
    

  

Then we format a short list for display:

```C#
if (allSheets.Count > 0)
{
    var sheetNames = new List<string>();
    for (int i = 0; i < Math.Min(10, allSheets.Count); i++)
    {
        var sheet = allSheets[i] as ViewSheet;
        sheetNames.Add($"{sheet.SheetNumber} - {sheet.Name}");
    }

    resultMessage += $"\n\nFound {allSheets.Count} sheets:\n" + string.Join("\n", sheetNames);
}
else
{
    resultMessage += "\n\nNo sheets found in document.";
}
```

- We show **up to 10** sheets as "A101 - Floor Plan".
    
- If there are none, we display that clearly.
    

---

### **7) Show the Result in WPF**

```C#
viewModel.ResultMessage = resultMessage;

var view = new UKONView(viewModel);
view.ShowDialog();
```

- Set the ViewModel **property** (MVVM). 
- Open your WPF **dialog** to show the message.

---

## **Why the Sheet Creation “Fails” (and How to Make It Succeed)**

  

It fails because we passed `ElementId.InvalidElementId`. To actually create a sheet, find a **real title block type** first:

```C#
var titleBlockId = new FilteredElementCollector(Document)
    .OfCategory(BuiltInCategory.OST_TitleBlocks)
    .WhereElementIsElementType()
    .FirstElementId(); // throws if none exist
```

> Replace the invalid id with this titleBlockId before ViewSheet.Create(...) and the command will create a sheet (assuming at least one title block type is loaded).

---

## **Optional Cleanups (Beginner-Safe)**

- **Safer casting with LINQ**:
    

```C#
var sheets = new FilteredElementCollector(Document)
    .OfClass(typeof(ViewSheet))
    .Cast<ViewSheet>()
    .ToList();
```

-   
    
- **StringBuilder** for long messages (not required, just tidy for larger outputs).
    

---

## **Key Takeaways**

- **Always use a Transaction** to modify the model.
    
- **Handle exceptions** and **rollback** on failure—never leave a transaction open.
    
- **Collectors** are how you **find elements** efficiently.
    
- **MVVM + WPF**: set data on the ViewModel; the dialog updates automatically.
    
- For creating sheets, you need a **valid title block type** (`OST_TitleBlocks`).