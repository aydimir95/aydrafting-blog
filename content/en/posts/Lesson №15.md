+++
title = "C# + Revit API: Lesson 15 - Managing Element Editability"
date = 2025-09-15T18:00:00+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image .png"
cover.alt = "ListView (Win)Form in C# + Revit API"
+++

> Fix: actual post date: 2025-12-15T18:00:00+03:00
# The goal
- We are working towards developing your first complete command that can edit elements.
- But what if those elements are checked out by another user? or not current with the central model? 
- We need to ensure all elements are editable by checking their ownership first, before we start editing them.

# Homework
- Check the related Revit API - that we would need to use to assess the status of the check out and also the edibility of elements.
- Extend the `Element` class with a new method - that would allow us to verify if an `element` is editable.
- Develop an edibility check - build a `worksharing` utility class and a special class which we can use to assess how we would like to proceed with the outcome, if we run into the scenario that some elements are NOT editable. 
- These tools will provide us with a means of filtering out non-editable elements, or cancelling a script run partway through.

# Solution
## Revit API Docs
- `WorkSharingUtils` Class
	- `GetCheckoutStatus` Method (`Document`, `ElementId`)
		- Receive: `CheckoutStatus` Enum
			- Members:
				- `OwnedByCurrentUser` - The element is owned by the current user (good).
				- `OwnedByOtherUser` - The element is owned by some user other than the current user (need to catch this scenario with the previous method).
				- `NotOwned` - The element is not owned by anyone (can be used to make it owned by current user).
	- `GetModelUpdateStatus` Method (`Document`, `ElementId`)
		- Receive: `ModelUpdateStatus` Enum
			- Members:
				- `CurrentWithCentral` - The element has no additional changes in the central model.
				- `NotYetInCentral` - The element is new in the current model and has not been saved to the central model. Note that this status will apply to newly created elements even if they are created in the central model.
				- `DeletedInCentral` - The element has been deleted in the central model.
				- `UpdatedInCentral` - The element has additional user changes in the central model. A reload latest will be required before it be modified in the current model.

### `GetCheckoutStatuc Method`:
```C#
public static CheckoutStatus GetCheckoutStatuc(
		Document document,
		ElementId elementId
)
```
- `Document`:
	- This is the active Revit project (or a linked document) where the element lives.
	- Think of it as the container of everything — walls, doors, levels, etc. The method needs to know _which file_ you’re asking about.
- `ElementId`: 
	- This is the unique identifier of a specific element inside that Document.
	- For example, the ID of a wall, a door, or even a level. Revit assigns every element an ElementId.
	- You pass this in so Revit knows _which element_ you’re checking.


## `Project Solution`
```bash
Solution
|-> guRoo.csproj  
	|-> Dependencies
	|-> Properties
	|-> Commands
		|-> Cmds_PushButton.cs  # Update - add the Editability Check
	|-> Forms
	|-> Extensions
		|-> Element_Ext.cs  # Create the New Extension Class
	|-> General 
	|-> Models
	|-> Resources
	|-> Services
	|-> Utilities
		|-> Workshare_Utils  # Create a new Utilities Class
	|-> Views
	|-> Application.cs  
	|-> Host.cs         
	|-> guRoo.addin
```

### `Element_Ext.cs`
```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guRoo.Extensions
{
	public static class Element_Ext 
	{
		public static bool Ext_IsEditable(this Element element, Document doc = null)
        {
            doc ??= element.Document;

            if (!doc.IsWorkshared) { return true; }

            var checkoutStatuc = WorksharingUtils.GetCheckoutStatus(doc, element.Id);
            var updateStatus = WorksharingUtils.GetModelUpdatesStatus(doc, element.Id);

            if (checkoutStatuc == CheckoutStatus.OwnedByOtherUser) { return false; }
            else if (checkoutStatuc == CheckoutStatus.OwnedByCurrentUser) { return true; }
            else { return updateStatus == ModelUpdatesStatus.CurrentWithCentral; }
		
        }

	}
}
```


### `Workshare_Utils.cs`
```C#
using Autodesk.Revit.DB;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using guRoo.Extensions;
using gFrm = guRoo.Forms;

namespace guRoo.Utilities
{
    public static class Workshare_Utils
    {
        public static WorksharingResult ProcessElements(List<Element> elements, Document doc = null)
        {
            // Create a worksharing resul and element lists
            var worksharingResult = new WorksharingResult() { Cancelled = false };
            var editable = new List<Element>();
            var notEditable = new List<Element>();

            // Add elements to the lists
            foreach (var element in elements)
            {
                if (element.Ext_IsEditable(doc))
                {
                    editable.Add(element);
                }
                else
                {
                    notEditable.Add(element);
                }
            }

            // Assign the lists to the result
            worksharingResult.EditableElements = editable;
            worksharingResult.NoneditableElements = notEditable;
            worksharingResult.Cancelled = false;

            // Catch non editable elements
            if (editable.Count == 0)
            {
                if (elements.Count > 0)
                {
                    gFrm.Custom.Cancelled("No Required Elements are Editable. \n\n" +
                        "The Task CAN NOT Proceed, and has been cancelled.");
                }
                worksharingResult.Cancelled = true;

            }
            // Catch not all elements are editable
            else if (notEditable.Count > 0)
            {
                var formResult = gFrm.Custom.Message(title: "Choose how to proceed",
                    message: "Not all elements are editable, would you like to proceed with those that are?",
                    yesNo: true);

                if (!formResult.Affirmative)
                {
                    worksharingResult.Cancelled = true;
                }
            }

            // Return the worksharing Result
            return worksharingResult;
        }
    }

    public class WorksharingResult
    {
        public List<Element> EditableElements { get; set; }
        public List<Element> NoneditableElements { get; set; }
        public bool Cancelled { get; set; }
    }
}
```


### `Cmds_PushButton.cs`
```C#
// Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;

//guRoo
using guRoo.Extensions;
using gFrm = guRoo.Forms;
using System.Linq;
using gWsh = guRoo.Utilities.Workshare_Utils;


// Associate with PushButton Commands
namespace guRoo.Commands.General
{
    /// <summary>
    ///		Example Command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_Test : IExternalCommand
    {
        public Result Execute(ExternalCommandData CommandData, ref string message, ElementSet elements)
        {
            // Collect the Document and Application objects from the CommandData
            var (uiApp, uiDoc, doc) = CommandData.Ext_GetRevitContext();

            // Select a revision
            var revisionResult = doc.Ext_SelectRevision();
            if (revisionResult.Cancelled) { return Result.Cancelled; }
            var selectedRevision = revisionResult.Object as Revision;

            // Select Sheets
            var sheetResult = doc.Ext_SelectSheets();
            if (sheetResult.Cancelled) { return Result.Cancelled; }
            var selectedSheets = sheetResult.Objects.Cast<ViewSheet>().ToList();

            // Editability Check
            if (doc.IsWorkshared)
            {
                var worksharingResult = gWsh.ProcessElements(selectedSheets.Cast<Element>().ToList(), doc);
                if (worksharingResult.Cancelled) { return Result.Cancelled; }
                selectedSheets = worksharingResult.EditableElements.Cast<ViewSheet>().ToList();
            }

            return Result.Succeeded;
        }
    }
}
```


