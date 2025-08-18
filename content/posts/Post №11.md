+++
title = "C# + Revit API: Lesson 11 - Stacking Buttons"
date = 2025-08-14T18:30:33+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++


# The Goal

![Pasted image 20250814192206.png](</images/Pasted image 20250814192206.png>)

[Aussie BIM Guru](https://www.youtube.com/watch?v=zaouXDa1dTc)

- Stacks can vertically contain 2 or 3 items.

# Homework
1. Create a stack
2. Access stacked items

# Solution

## Revit API
- `AddStackedItems` Method
	- 2 overloads available, you can either add 2 items or 3 items.
- `RibbonItemData` Class - is the object that we are going to be adding:
	- `ComboBoxData` Class
	- `RadioButton`Class
	- `ButtonData` Class
		- `PulldownButton`
		- `PushButton`


## Tips
- We will be adding it to `RibbonPanel`
- But we will not create an `Extension` for this, since the the Method itself is sufficient to run this process.
- But we are going to have to access the projects once we create them as well.


### `Project Solution`
```bash
Solution
|-> guRoo
	|-> Dependencies
	|-> Commands
		|-> General 
			|-> Cmds_General.cs 
			|-> Cmds_Button.cs // Add a New Class
			|-> Cmds_PullDown.cs  
			|-> Cmds_Stack1.cs // Add a New Class
			|-> Cmds_Stack2.cs // Add a New Class
			|-> Cmds_Stack3.cs // Add a New Class
	|-> Forms
	|-> General 
		|-> Globals.cs 
	|-> Extensions 
		|-> UIControlledApplicaiton_Ext.cs 
		|-> RibbonPanel_Ext.cs
		|-> PulldownButton_Ext.cs 
	|-> Resources
		|-> Files 
			|-> Tooltips.resx       // Update
		|-> Icons 
		|-> Icons16 
			|-> General_test16.png 
			|-> Stack1_Button16.png // add a .png
			|-> Stack116.png        // add a .png
			|-> Stack2_Button16.png // add a .png
			|-> Stack216.png        // add a .png
			|-> Stack3_Button16.png // add a .png
			|-> Stack316.png        // add a .png
		|-> Icons32      
			|-> General_test32.png  // add a .png
			|-> Stack1_Button32.png // add a .png
			|-> Stack132.png        // add a .png
			|-> Stack2_Button32.png // add a .png
			|-> Stack232.png        // add a .png
			|-> Stack3_Button32.png // add a .png
			|-> Stack332.png        // add a .png
	|-> Utilities
		|-> Ribbon_Utils.cs
	|-> Application.cs              // Update
	|-> guRoo.addin
```

### `Cmds_Stack1.cs`
```C#
// Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;

// Associate with stack commands
namespace guRoo.Cmds_Stack1
{
    /// <summary>
    /// Example command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_Button : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            // Collect the document
            var uiApp = commandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Testing if the command worked
            TaskDialog.Show("It's working!", doc.Title);

            // Final return
            return Result.Succeeded;
        }
    }
}
```


### `Cmds_Stack2.cs`
```C#
// Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;

// Associate with stack commands
namespace guRoo.Cmds_Stack2
{
    /// <summary>
    /// Example command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_Button : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            // Collect the document
            var uiApp = commandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Testing if the command worked
            TaskDialog.Show("It's working!", doc.Title);

            // Final return
            return Result.Succeeded;
        }
    }
}
```

### `Cmds_Stack3.cs`
```C#
// Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;

// Associate with stack commands
namespace guRoo.Cmds_Stack3
{
    /// <summary>
    /// Example command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_Button : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            // Collect the document
            var uiApp = commandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Testing if the command worked
            TaskDialog.Show("It's working!", doc.Title);

            // Final return
            return Result.Succeeded;
        }
    }
}
```

### `Tooltips.resx`

| **Name**         | **Value**                                                                    |
| ---------------- | ---------------------------------------------------------------------------- |
| Button           | The user will generally not see this - it just holds the PushButton example. |
| Button_Button    | This is an example of adding a PushButton to a RibbonPanel.                  |
| PullDown         | This is an example of adding a PulldownButton to a RibbonPanel.              |
| PullDown_1Button | This is button 1 of the PulldownButton.                                      |
| PullDown_2Button | This is button 2 of the PulldownButton.                                      |
| PullDown_3Button | This is button 3 of the PulldownButton.                                      |
| Stack1           | This is an example of stacking buttons.                                      |
| Stack1_Button    | This is an example of stacking buttons.                                      |
| Stack2           | This is an example of stacking buttons.                                      |
| Stack2_Button    | This is an example of stacking buttons.                                      |
| Stack3           | This is an example of stacking buttons.                                      |
| Stack3_Button    | This is an example of stacking buttons.                                      |

### `Application.cs`
```C#
// Autodesk
using Autodesk.Revit.UI;
using Autodesk.Revit.UI.Events;


// guRoo
using gRib = guRoo.Utilities.Ribbon_Utils;
using guRoo.Extensions;

// This application belongs to the root namespace
namespace guRoo
{
    // Implementing the interface for application.cs class
    public class Application : IExternalApplication
    // IExternalApplication for the interface
    {
        // Make a private uiCtlApp method:
        private static UIControlledApplication _uiCtlApp;

        //This will return a result on Startup method - requires uiCtlApp
        public Result OnStartup(UIControlledApplication uiCtlApp)
        {

            #region Globals registration
            // Store _uiCtlApp, register on idling
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

            // Register Globals
            Globals.RegisterProperties(uiCtlApp);

            // Register Tooltips
            Globals.RegisterTooltips("guRoo.Resources.Files.Tooltips");
            #endregion

            #region Ribbon setup
            // Add RibbonTab
            uiCtlApp.Ext_AddRibbonTab(Globals.AddinName); 

            // Create RibbonPanel
            var panelGeneral = uiCtlApp.Ext_AddRibbonPanel(Globals.AddinName, "General");

            // Add PushButton to RibbonPanel
            var buttonTest = panelGeneral.Ext_AddPushButton("Testing", "guRoo.Cmds_General.Cmd_Test");

            // Add PulldownButton to RibbonPanel
            var pulldownTest = panelGeneral.Ext_AddPulldownButton("PullDown", "guRoo.Cmds_PullDown");

            // Add Buttons to Pulldown
            pulldownTest.Ext_AddPushButton("Button 1", "guRoo.Cmds_PullDown.Cmd_1Button");
            pulldownTest.Ext_AddPushButton("Button 2", "guRoo.Cmds_PullDown.Cmd_2Button");
            pulldownTest.Ext_AddPushButton("Button 3", "guRoo.Cmds_PullDown.Cmd_3Button");

			// Create data objects for the stack
            var stack1Data = gRib.NewPulldownButtonData("Stack1", "guRoo.Cmds_Stack1");
            var stack2Data = gRib.NewPulldownButtonData("Stack2", "guRoo.Cmds_Stack2");
            var stack3Data = gRib.NewPulldownButtonData("Stack3", "guRoo.Cmds_Stack3");

            // Create the Stack
            var stack = panelGeneral.AddStackedItems(stack1Data, stack2Data, stack3Data);
            var pulldownStack1 = stack[0] as PulldownButton;
            var pulldownStack2 = stack[1] as PulldownButton;
            var pulldownStack3 = stack[2] as PulldownButton;

            // Add buttons to stacked pulldowns
            pulldownStack1.Ext_AddPushButton("Button", "guRoo.Cmds_Stack1.Cmd_Button");
            pulldownStack2.Ext_AddPushButton("Button", "guRoo.Cmds_Stack2.Cmd_Button");
            pulldownStack3.Ext_AddPushButton("Button", "guRoo.Cmds_Stack3.Cmd_Button");

            #endregion


            // Final return:
            return Result.Succeeded; // or Cancelled
        }

        #region On shutdown method
        // This will urn on shutdown
        public Result OnShutdown(UIControlledApplication uiCtlApp)
        {
            return Result.Succeeded;
        }
        #endregion

        #region Use idling to register UiApp
        // On idling, register UiApp/username
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


<br>

> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.
