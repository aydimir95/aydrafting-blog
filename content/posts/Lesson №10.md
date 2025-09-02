+++
title = "C# + Revit API: Lesson 10 - Create a Pulldown Button"
date = 2025-08-14T12:02:26+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250814142840.png"
cover.alt = "Create a Pulldown Button"
+++

# The Goal

We will create a `PulldownButton` and add a few `PushButtons` to it.

We will also create some helper methods to generate `ButtonData` objects given we are beginning to use these in lots of places.

In the next post we will stack `PulldownButtons`.

![Pasted image 20250814122745.png](</images/Pasted image 20250814122745.png>)
[Aussie BIM Guru](https://www.youtube.com/watch?v=Zx5Aadrq7RY)

## What we need
1. Create a data creation methods,
2. Add a `PulldownButton` to our panel,
3. Add `PushButtons` to it,
4. Add `Icons`

## Related API Classes
1. `RibbonPanel`
	1. `PulldownButtonData`
		1. `PulldownButton`
	2. `PushButtonData`
		1. `PushButton`

# Homework
1. Create a `static utility` methods on the `Ribbon_Util.cs`
2. Modify a `PushButton` method to use `static utility` methods
3. Create a `PulldownButton` method
4. Create a `PulldownButton` method `Extension` class to add `PushButton` to `PulldownButton` 
5. Update the `Strartup` method


# Solution 
## Code

### `Project Solution`
```bash
Solution
|-> guRoo
	|-> Dependencies
	|-> Commands
		|-> General 
			|-> Cmds_General.cs 
			|-> Cmds_PullDown.cs  // Create a New Class
	|-> Forms
	|-> General 
		|-> Globals.cs 
	|-> Extensions 
		|-> UIControlledApplicaiton_Ext.cs 
		|-> RibbonPanel_Ext.cs    // Update
		|-> PulldownButton_Ext.cs // Create New Extension Class
	|-> Resources
		|-> Files 
			|-> Tooltips.resx     // Update
		|-> Icons 
		|-> Icons16 
			|-> General_test16.png 
		|-> Icons32 
			|-> General_test32.png 
	|-> Utilities
		|-> Ribbon_Utils.cs       // Update
	|-> Application.cs            // Update
	|-> guRoo.addin
```


### `Cmd_PullDown.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guRoo.Cmds_PullDown
{
    /// <summary>
    ///		Example Command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_1Button : IExternalCommand
    {
        public Result Execute(ExternalCommandData CommandData, ref string message, ElementSet elements)
        {
            var uiApp = CommandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Code logic here:
            TaskDialog.Show("Button 1 is Working!", doc.Title);

            // Final return here:
            return Result.Succeeded;
        }
    }

    /// <summary>
    ///		Example Command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_2Button : IExternalCommand
    {
        public Result Execute(ExternalCommandData CommandData, ref string message, ElementSet elements)
        {
            var uiApp = CommandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Code logic here:
            TaskDialog.Show("Button 2 is Working!", doc.Title);

            // Final return here:
            return Result.Succeeded;
        }
    }

    /// <summary>
    ///		Example Command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_3Button : IExternalCommand
    {
        public Result Execute(ExternalCommandData CommandData, ref string message, ElementSet elements)
        {
            var uiApp = CommandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Code logic here:
            TaskDialog.Show("Button 3 is Working!", doc.Title);

            // Final return here:
            return Result.Succeeded;
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
        # region Add Button Creation
        /// <summary>
        /// Adds a Pushbutton to the panel.
        /// </summary>
        /// <typeparam name="CommandClass">The related Command class.</typeparam>
        /// <param name="ribbonPanel">The RibbonPanel (extended).</param>
        /// <param name="buttonName">The name for the button.</param>
        /// <param name="availability">The availability name.</param>
        /// <param name="suffix">The icon suffix (none by default).</param>
        /// <returns>A Pushbutton object.</returns>

        public static PushButton Ext_AddPushButton(this RibbonPanel panel, string buttonName, string className)
        {
            if (panel is null)
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
                return null;
            }

            // Create a Data Object
            var pushButtonData = gRib.NewPushButtonData(buttonName, className);
            
            if (panel.AddItem(pushButtonData) is PushButton pushButton)
            {
                // If the button was made, return it.
                return pushButton;
            }
            else
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
                return null;
            }
        }


        /// <summary>
        /// Adds a PulldownButton to the panel.
        /// </summary>
        /// <typeparam name="CommandClass">The related Command class.</typeparam>
        /// <param name="ribbonPanel">The RibbonPanel (extended).</param>
        /// <param name="buttonName">The name for the button.</param>
        /// <param name="availability">The availability name.</param>
        /// <param name="suffix">The icon suffix (none by default).</param>
        /// <returns>A PulldownButton object.</returns>

        public static PulldownButton Ext_AddPulldownButton(this RibbonPanel panel, string buttonName, string className)
        {
            if (panel is null)
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
                return null;
            }

            // Create a Data Object
            var pulldownButtonData = gRib.NewPulldownButtonData(buttonName, className);

            if (panel.AddItem(pulldownButtonData) is PulldownButton pulldownButton)
            {
                // If the button was made, return it.
                return pulldownButton;
            }
            else
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
                return null;
            }
        }

        #endregion
    }
}
```


### `PulldownButton_Ext.cs`
```C#
using Autodesk.Revit.UI;
using System.Diagnostics;
using gRib = guRoo.Utilities.Ribbon_Utils;

namespace guRoo.Extensions
{
    public static class PulldownButton_Ext
    {
        # region Add Button Creation
        /// <summary>
        /// Adds a PulldownButton to the panel.
        /// </summary>
        /// <typeparam name="CommandClass">The related Command class.</typeparam>
        /// <param name="pulldownButton">The RibbonPanel to add the button to (Extended).</param>
        /// <param name="buttonName">The name for the button.</param>
        /// <param name="className">The full class name the button runs.</param>
        /// <returns>A PulldownButton object.</returns>

        public static PushButton Ext_AddPushButton(this PulldownButton pulldownButton, string buttonName, string className)
        {
            if (pulldownButton is null)
            {
                Debug.WriteLine($"Error: Could not add {buttonName} to pulldown.");
                return null;
            }

            // Create a Data Object
            var pushButtonData = gRib.NewPushButtonData(buttonName, className);

            if (pulldownButton.AddPushButton(pushButtonData) is PushButton pushButton)
            {
                // If the button was made, return it.
                return pushButton;
            }
            else
            {
                Debug.WriteLine($"Error: Could not add {buttonName} to pulldown.");
                return null;
            }
        }
        #endregion
    }
}
```


### `Tooltips.resx`

|       Name       | Value                                                    | Comment |
| :--------------: | -------------------------------------------------------- | ------- |
|   General_Test   | This is a working tooltip.<br><br>We can do extra lines. |         |
|  General_Test2   | This is a working tooltip.<br><br>We can do extra lines. |         |
|     PullDown     | This is a PulldownButton                                 |         |
| PullDown_1Button | This is Button 1 of the Pulldown Button.                 |         |
| PullDown_2Button | This is Button 2 of the Pulldown Button.                 |         |
| PullDown_3Button | This is Button 3 of the Pulldown Button.                 |         |


### `Ribbon_Utils.cs`
```C#
using Autodesk.Revit.UI;
using System;
using System.Diagnostics;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace guRoo.Utilities
{
    public static class Ribbon_Utils
    {
        #region PushButton Data
        /// <summary>
        /// Create a PushButtonData object.
        /// </summary>
        /// <param name="buttonName">The name for the button.</param>
        /// <param name="className">The availability name.</param>
        /// <returns>A PushButtonData object.</returns>

        public static PushButtonData NewPushButtonData(string buttonName, string className)
        {
            var baseName = CommandToBaseName(className);

            var pushButtonData = new PushButtonData(baseName, buttonName, Globals.AssemblyPath, className);

            // Set the values
            pushButtonData.ToolTip = LookupTooltip(baseName);
            pushButtonData.Image = GetIcon(baseName, resolution: 16);
            pushButtonData.LargeImage = GetIcon(baseName, resolution: 32);

            return pushButtonData;

        }
        #endregion

        #region Pulldown Data
        /// <summary>
        /// Create a PulldownButtonData object.
        /// </summary>
        /// <param name="buttonName">The name for the button.</param>
        /// <param name="className">The availability name.</param>
        /// <returns>A PulldownButtonData object.</returns>

        public static PulldownButtonData NewPulldownButtonData(string buttonName, string className)
        {
            var baseName = CommandToBaseName(className);

            var pulldownButtonData = new PulldownButtonData(baseName, buttonName);

            // Set the values
            pulldownButtonData.ToolTip = LookupTooltip(baseName);
            pulldownButtonData.Image = GetIcon(baseName, resolution: 16);
            pulldownButtonData.LargeImage = GetIcon(baseName, resolution: 32);

            return pulldownButtonData;

        }
        #endregion

        #region Method to get the base name of a command
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
        #endregion

        #region Method to get an icon as an image source
        public static ImageSource GetIcon(string baseName, int resolution = 32)
        {
            var resourcePath = $"guRoo.Resources.Icons{resolution}.{baseName}{resolution}.png";

            using (var stream = Globals.Assembly.GetManifestResourceStream(resourcePath))
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
        #endregion 


    }
}
```

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

