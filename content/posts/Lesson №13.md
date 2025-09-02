+++
title = "C# + Revit API: Lesson 13 - MessageBox Forms"
date = 2025-09-01T15:50:07+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250901160911.png"
cover.alt = "MessageBox Forms in C# and Revit API"
+++

 > `MessageBox Forms` - needed to send alerts to the user from our add-in.

- Before, we were using `TaskDialog` to convey outcomes to the user when they run our tools. It's ok for the basic processes but lacks the level of interaction we need.
- We will use a `MessageBox` form to address this and contain it within a custom method we can easily call on and customize further.

# `MessageBox` Anatomy

![Pasted image 20250901160911.png](</images/Pasted image 20250901160911.png>)

- We will use a custom `method` to make a more flexible form with multiple options, icons etc.

# [Microsoft/DotNet Docs](https://learn.microsoft.com/en-us/dotnet/api/system.windows.forms.messagebox?view=windowsdesktop-9.0)
- Most things we will use that are related to Windows tend to fall under the `System` library.
- We will need to get used to consulting the `dotnet` Docs as well as `Revit API` Docs for many things in the future.
## Example:

### `MessageBox` Class
```C#
private void Form1_FormClosing(object sender, FormClosingEventArgs e)
{
	const string message = 
		"Are you sure that you would like to close the form?";
		
	const string caption = "Form Closing";
	
	var result = MessageBox.Show(
		message, 
		caption, 
		MessageBoxButtons.YesNo,  // MessageBoxButtons Enum
		MessageBoxIcon.Question); // MessageBoxIcons Enum
	
	// If the no button was pressed ...
	if (result == Dialog.No) // DialogResult Enum
	{
		// cancel the closure of the form.
		e.Cancel = true;
	}
}
```

### `DialogResult` Enum
| Name     | Value | Description                                                                                    |
| -------- | ----- | ---------------------------------------------------------------------------------------------- |
| None     | 0     | `Nothing` is returned from the dialog box. This means that the modal dialog continues running. |
| OK       | 1     | The dialog box return value is `OK` (usually sent from a button labeled OK).                   |
| Cancel   | 2     | The dialog box return value is `Cancel` (usually sent from a button labeled Cancel).           |
| Abort    | 3     | The dialog box return value is `Abort` (usually sent from a button labeled Abort).             |
| Retry    | 4     | The dialog box return value is `Retry` (usually sent from a button labeled Retry).             |
| Ignore   | 5     | The dialog box return value is `Ignore` (usually sent from a button labeled Ignore).           |
| Yes      | 6     | The dialog box return value is `Yes` (usually sent from a button labeled Yes).                 |
| No       | 7     | The dialog box return value is `No` (usually sent from a button labeled No).                   |
| TryAgain | 10    | The dialog box return value is Try Again (usually sent from a button labeled Try Again).       |
| Continue | 11    | The dialog box return value is Continue (usually sent from a button labeled Continue).         |

### `MessageBoxButtons` Enum
|Name|Value|Description|
|---|---|---|
|OK|0|The message box contains an OK button.|
|OKCancel|1|The message box contains OK and Cancel buttons.|
|AbortRetryIgnore|2|The message box contains Abort, Retry, and Ignore buttons.|
|YesNoCancel|3|The message box contains Yes, No, and Cancel buttons.|
|YesNo|4|The message box contains Yes and No buttons.|
|RetryCancel|5|The message box contains Retry and Cancel buttons.|
|CancelTryContinue|6|Specifies that the message box contains Cancel, Try Again, and Continue buttons.|

### `MessageBoxIcons` Enum
| Name        | Value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| None        | 0     | The message box contains no symbols.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Error       | 16    | The message box contains a symbol consisting of white X in a circle with a red background.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Hand        | 16    | The message box contains a symbol consisting of a white X in a circle with a red background.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Stop        | 16    | The message box contains a symbol consisting of white X in a circle with a red background.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Question    | 32    | The message box contains a symbol consisting of a question mark in a circle. The question mark message icon is no longer recommended because it does not clearly represent a specific type of message and because the phrasing of a message as a question could apply to any message type. In addition, users can confuse the question mark symbol with a help information symbol. Therefore, do not use this question mark symbol in your message boxes. The system continues to support its inclusion only for backward compatibility. |
| Exclamation | 48    | The message box contains a symbol consisting of an exclamation point in a triangle with a yellow background.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Warning     | 48    | The message box contains a symbol consisting of an exclamation point in a triangle with a yellow background.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Asterisk    | 64    | The message box contains a symbol consisting of a lowercase letter i in a circle.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Information | 64    | The message box contains a symbol consisting of a lowercase letter i in a circle.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

# `FormResult` Class from `Lesson 4`
- We will always have our `forms` return a consistent custom object which tells us:
	- If the form was `cancelled`, `valid`, `affirmative`
	- If there are `object(s)` returned
	- If there is a single `object` returned

# Homework
- Tidy up the FormResult Class
- Set up a Custom Method
- Develop fixed variants

# Solution

### `Project Solution`
```bash
Solution
|-> ViewOnSheets2025
	|-> Dependencies
	|-> Properties
	|-> Commands
		|-> Cmd_Button.cs # Update
	|-> Forms
		|-> Custom.cs     # Update
	|-> Extensions
	|-> General 
	|-> Models
	|-> Resources
	|-> Services
	|-> Utilities
	|-> Views
	|-> Application.cs  
	|-> Host.cs         
	|-> guRoo.addin
``` 

### `Custom.cs`
```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms; // Might need to add the Forms in Assemblies 

namespace guRoo.Forms
{
	public static class Custom
	{
		/// <Summary>
		/// 
		/// </Summary>
		/// <param name="title"></param>
		/// <param name="message"></param>
		/// <param name="yesNo"></param>
		/// <param name="noCancel"></param>
		/// <param name="icon"></param>
		/// <return></return>
		public static FormResult Message(
			string title = null, 
			string message = null,
			message = null,
			bool yesNo = false,
			bool noCancel = false,
			MessageBoxIcon icon = MessageBoxIcon.None) // by default = no icons
		{
			var formResult = new FromResult(isValid: false);
			
			title ??= "Message";
			message ??= "No message was provided.";
			
			if (yesNo && icon == MessageBoxIcon.None) 
			{ 
				icon = MessageBoxIcon.Question;
			}
			
			buttons = MessageBoxButtons.OKCancel;
			
			if (noCancel)
			{
				buttons = MessageBoxButtons.OK;
			}
			else if (yesNo)
			{
				buttons = MessageBoxButtons.YesNo;
			}
			
			var dialogResult = MessageBox.Show(
				message,
				title,
				buttons,
				icon);
			
			if (dialogResult == DialogResult.Yes || 
				dialogResult == DialogResult.OK)
			{
				formResult.Validate();
				return formResult;
			}
		}
		
		/// <Summary>
		/// 
		/// </Summary>
		/// <param name="message"></param>
		/// <return></return>
		public static Result Completed(string message)
		{
			Message(
			title: "Task Completed", 
			message: message, 
			yesNo: false, 
			noCancel: true
			icon: MessageBoxIcon.Information);
			
			return Result.Succeded;
		}
		
		/// <Summary>
		/// 
		/// </Summary>
		/// <param name="message"></param>
		/// <return></return>
		public static Result Cancelled(string message)
		{
			Message(
			title: "Task Cancelled", 
			message: message, 
			yesNo: false, 
			noCancel: true
			icon: MessageBoxIcon.Warning);
			
			return Result.Cancelled;
		}
		
		/// <Summary>
		/// 
		/// </Summary>
		/// <param name="message"></param>
		/// <return></return>
		public static Result Error(string message)
		{
			Message(
			title: "Error", 
			message: message, 
			yesNo: false, 
			noCancel: true
			icon: MessageBoxIcon.Error);
			
			return Result.Cancelled;
		}
	}
	
	public class FormResult
	{
		public object Object{ get; set; }
		public List<object> Objects { get; set; }
		
		public bool Cancelled { get; set; }
		public bool Valid { get; set; }
		public bool Affirmative { get; set; }
		
		// Constructor (Default)
		public FormResult()
		{
			this.Object = null;
			this.Objects = new List<object>();
			this.Cancelled = true;
			this.Valid = false;
			this.Affirmative = false;
		}
		
		// Constructor (Alternative)
		public FormResult(bool isValid)
		{
			this.Object = null;
			this.Objects = new List<object>();
			this.Cancelled = !isValid;
			this.Valid = isValid;
			this.Affirmative = isValid;
		}
		
        // Method to validate
        public void Validate()
        {
            this.Cancelled = true;
            this.Valid = true;
            this.Affirmative = true;
        }
        
		// Method to validate
        public void Validate(object obj)
        {
	        this.Validate();
            this.Object = obj;
        }
        
		// Method to validate
        public void Validate(List<object> objs)
        {
	        this.Validate();
            this.Objects = objs;
        }
	}
}
```

### `Cmds_Button.cs`
```C#
// Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;

//UKON
using UKON.Extensions;
using gFrm = guRoo.Forms;


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


            // Collect all walls
            var walls = new FilteredElementCollector(doc)
                .OfClass(typeof(Wall))
                .WhereElementIsNotElementType()
                .ToElements();


            // Show the message dialog with the document title
            gFrm.Custom.Message( doc.Title, $"We have {walls.Count} walls in the model" );


            // Collect all walls lower than 12 feet
            // First: Construct a filter for .WherePasses() Method
            var parameterId = new ElementId(BuiltInParameter.WALL_USER_HEIGHT_PARAM);
            var provider = new ParameterValueProvider(parameterId);
            var rule = new FilterNumericLess();
            var passesRule = new FilterDoubleRule(provider, rule, 12, 0.1);
            var paramFilter = new ElementParameterFilter(passesRule);


            // Then: Apply the filter to the FilteredElementCollector
            var wallsFiltered = new FilteredElementCollector(doc)
                .OfCategory(BuiltInCategory.OST_Walls)
                .WhereElementIsNotElementType()
                .WherePasses(paramFilter)
                .ToElements();


            // Show the message dialog with different warning MessageBoxes
            var yesNoResult = uFrm.Custom.Message(doc.Title, $"We have {wallsFiltered.Count} walls less than 12 feet in the model", yesNo: true);
            if (yesNoResult.Cancelled) { return Result.Cancelled; }

            if (yesNoResult.Cancelled)
            {
                return gFrm.Custom.Cancelled("\'No\' was chosen.");
            }

            gFrm.Custom.Error("An error did not occur, just showing this form.");

            return gFrm.Custom.Completed("Script completed");
        }
    }
}

```