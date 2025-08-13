+++
title = "C# + Revit API: Lesson 8 - Tooltips & Icons -> Extension Methods"
date = 2025-08-08T13:13:50+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
+++

- We will cover how to manage resource/command naming,
- And, how to easily manage tooltips for our tools,
- As well as, the standard/large image icons,
- Finally, we will test the tool in action.
# Base Command Naming
```C#
// Command namespace
guRoo.Cmds_GroupName

//Command Class
guRoo.Cmds_GroupName.Cmd_CommandName
```

## Preferred Method:
```C#
// Before: 
guRoo.Cmds_GroupName
// After:
GroupName 

//Before:
guRoo.Cmds_GroupName.Cmd_CommandName
//After
GroupName._CommandName 
```

## The Approach we will use:
```C#
guRoo.Cmds_GroupName.Cmd_CommandName
// Remove guRoo.Cmds_
GroupName.Cmd_CommandName
// Remove .Cmd
GrouName_CommandName
```

## Or you can make things even more resilient by using:
```C#
typeof(CommandName).FullName
```

### Tooltipkey is base name:
```C#
GrouName
GroupName_CommandName
```

### Icons:
```C#
GroupName##
GroupName_CommandName##

## = Reolusion in pixels (16 or 32)
```


# How we will manage `Tooltips`
We will create a `Resources` (resx) file in C# and embed this into our project. It will be available in memory for our project whilst it runs to access. We will store the tooltip and description as a `dictionary` of `keys` and `values`.

We will access this using the dedicated `ResourceManager` class.

# How we will manage `Icons`
Revit tools feature 2 icon types:

1. `Image` -> 16x16px (96dpi) icon which shows at a smaller resolution (e.g. in `pulldown`, quick access).
2. `LargeImage` -> 32x32px (96dpi) icon which shows at a larger resolution (e.g. in `PushButtons`).

We will store our icons as embedded resources also in a `PNG` format. We will use a **ResourceStream** in order to decode these resources into a bitmap in our application.

**Streaming** resources is quite common in C/C# and allows `decoding` of memory into suitable resources, such as an **ImageSource**.


## Consolidation Functionality
> The goal here ultimately is to make the process of adding/assigning `icons` to our tools as simple as possible for the user.

>This will get around repetitive code, as well as providing a better entry environment for long text inputs such as tooltips.

# Homework
- Create a `command` > base `name` converter
- Set up a tooltips `resource` 
- `Read`, `store` and `assign` a tooltip
- Set up `icon` files in 16/32 px format
- Assign the Icons to our `Pushbuttons`
- `Test` the changes

# Solution
## Revit API
>`PushButtonData` Class - ultimately we are just setting Properties of the ButtonData. 
>	Properties we are really interested in are:
>		 `Image`,
>		 `LargeImage`,
>		 `ToolTip`.

| Name                    | Description                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `AssemblyName`          | The assembly path of the button.                                                                         |
| `AvailabilityClassName` | The full class name for the class providing the entry point to decide availablility of this push button. |
| `ClassName`             | The name of the Class containing the implementation for the command.                                     |
| `Image`                 | The image of the button.                                                                                 |
| `LargeImage`            | The large image of the button.                                                                           |
| `LongDescription`       | Long description of the command tooltip.                                                                 |
| `Name`                  | The name of the item.                                                                                    |
| `Text`                  | The user-visible text of the button.                                                                     |
| `ToolTip`               | The description that appears as a ToolTip for the item.                                                  |
| `ToolTipImage`          | The image to show as a part of the button extended tooltip.                                              |
## Tips:
- `Image` - requires an [ImageSource](https://learn.microsoft.com/en-us/dotnet/api/system.windows.media.imagesource?view=windowsdesktop-9.0) which is a Windows C# .NET - API.
- [icons8.com](https://icons8.com) - great resource to find icons for your buttons. 
- [photopea.com](https://www.photopea.com) - to adjust the resolution of the icons downloaded from `icons8` website.

## Code:
### `Overview`
```C#
Solution
|-> guRoo
	|-> Dependencies
	|-> Commands
		|-> General 
			|-> Cmds_General.cs 
	|-> Forms
	|-> General 
		|-> Globals.cs // --------->  Update
	|-> Resources
		|-> Files //--------------->  Add "Files" Folder
			|-> Tooltips.resx //--->  Add "Resources File" item
		|-> Icons //--------------->  Add "Icons" Folder 
		|-> Icons16 //------------->  Add "Icons16" Folder
			|-> General_test16.png // Add an Icon 16px
		|-> Icons32 //------------->  Add "Icons32" Folder
			|-> General_test32.png // Add an Icon 32px
	|-> Utilities
		|-> Ribbon_Utils.cs //----->  Update
	|-> Application.cs //---------->  Update
	|-> guRoo.addin
```
#### `Ribbon_Utils.cs`
```C#
using Autodesk.Revit.UI;
using System.Diagnostics;

namespace guRoo.Utilities
{
	public static class Ribbon_Utils
	{
        // Method to create a "Tab"
        public static Result AddRibbonTab(UIControlledApplication uiCtlApp,string tabName)
        {
            try
            {
                uiCtlApp.CreateRibbonTab(tabName);

                return Result.Succeeded;
            }
            catch
            {
                Debug.WriteLine($"Error: Could not create a tab: {tabName}");
                return Result.Failed;
            }
        }

        // Method to create a "Panel"
        public static RibbonPanel AddRibbonPanelToTab(UIControlledApplication uiCtlApp, string tabName, string panelName)
        {
            try
            {
                var panel = uiCtlApp.CreateRibbonPanel(tabName, panelName);
                return panel;
            }
            catch
            {
                Debug.WriteLine($"Error: Could not add {panelName} to {tabName}");
                return null;
            }
        }

        // Method to get that "Panel"
        public static RibbonPanel GetRibbonPanelByName(UIControlledApplication uiCtlApp, string tabName, string panelName)
        {
            var panels = uiCtlApp.GetRibbonPanels(tabName);
            foreach (var panel in panels)
            {
                if (panel.Name == panelName)
                    return panel;
            }

            // Not found
            return null;
        }

        
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
        public static PushButton AddPushButtonToPanel(RibbonPanel panel, string buttonName, string className)
        // string internalName, -> NOT NEEDED ANYMORE
        // string assemblyPath)-> NOT NEEDED ANYMORE
        {
            if (panel is null)
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
				return null;
            }
            // Open PushButtonData Constructor and check what's needed


// ====The Updated Part 2 Start====
            // Get the base name from below
            var baseName = CommandToBaseName(className);

// ====The Updated Part 2 End====
            // Create a PushButtonData object:
            var pushButtonData = new PushButtonData(baseName, buttonName, Globals.AssemblyPath, className);

            // if the button was made - return it:
            if (panel.AddItem(pushButtonData) is PushButton pushButton)
            {
                pushButton.ToolTip = LookupTooltip(baseName);
                // We will come back to this:
// ====The Updated Part 4 Start====
                pushButton.Image = GetIcon(baseName, resolution: 16);
                pushButton.LargeImage = GetIcon(baseName, resolution: 32);
// ====The Updated Part 4 End====
                return pushButton;
            }
            else
            {
                Debug.WriteLine($"Error: Could not create {buttonName}.");
				return null;
            }
        }


// ====The Updated Part 1 Start====

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

// ====The Updated Part 1 End====

// ====The Updated Part 3 Start====
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
// All you have to do now, is assign these icons back where we added a PushButton
// ====The Updated Part 3 End====

    }
}
```

---
### `Tooltips.resx`
1. Create `Tooltips.resx`  under .../Resources/Files/Tooltips.resx
2. Once created, click Add Resource `+` button on the top left of the screen.
3. Add the following 2 Resources:

|     Name      | Value                                                    | Comment |
| :-----------: | -------------------------------------------------------- | ------- |
| General_Test  | This is a working tooltip.<br><br>We can do extra lines. |         |
| General_Test2 | This is a working tooltip.<br><br>We can do extra lines. |         |

<br>

---
#### `Properties:`
1. Then make sure the properties of the Tooltips.resx are set as follows:

|      **Advanced:**       |       **Value**       |
| :----------------------: | :-------------------: |
|       Build Action       |  `Embedded resource`  |
| Copy to Output Directory |      Do not copy      |
|       Custom Tool        | ResXFileCodeGenerator |

| **Mics:** |     **Value**     |
| :-------: | :---------------: |
| File Name |   Tooltips.resx   |
| Full Path | .../Tooltips.resx |

<br>

### `Globals.cs`
```C#
using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.UI;
using System.Collections;
using System.Globalization;
using System.Resources;
using Assembly = System.Reflection.Assembly;


namespace guRoo
{
	public static class Globals
	{
        #region Properties
        // Applications
        public static UIControlledApplication UiCtlApp { get; set; }
        public static ControlledApplication CtlApp { get; set; }
        public static UIApplication UiApp { get; set; }

        // Assembly
        public static Assembly Assembly { get; set; } // Ambiguity or missing ref
        public static string AssemblyPath { get; set; }

        // Revit Versions
        public static string RevitVersion { get; set; }
        public static int RevitVersionInt { get; set; }

        // User Names
        public static string UsernameRevit { get; set; }
        public static string UsernameWindows { get; set; }

        // GUIDs and Versioning
        public static string AddinVersionNumber { get; set; }
        public static string AddinVersionName { get; set; }
        public static string AddinName { get; set; }
        public static string AddinGuid { get; set; }
        #endregion

        // Dictionaries for resources as a Dict <key, value> Name
        public static Dictionary<string, string> Tooltips { get; set; } = new Dictionary<string, string>();

        #region Register Method
        // Method to Register Variable Properties
        public static void RegisterProperties(UIControlledApplication uiCtlApp)
        {
            UiCtlApp = uiCtlApp;
            CtlApp = uiCtlApp.ControlledApplication;
            // UiApp set on idling

            Assembly = Assembly.GetExecutingAssembly();
            AssemblyPath = Assembly.Location;

            RevitVersion = CtlApp.VersionNumber;
            RevitVersionInt = Int32.Parse(RevitVersion);

            // Revit Username set to idling
            UsernameWindows = Environment.UserName;

            AddinVersionNumber = "25.08.12";
            AddinVersionName = "WIP";
            AddinName = "guRoo";
            AddinGuid = "5FD7523B-5832-4AB8-9B3D-0BE7ACFE1207";
        }
        #endregion

        // Register our tooltup (Microsoft API Methods)
        public static void RegisterTooltips(string resourcePath)
        {
            var resourceManager = new ResourceManager(resourcePath,typeof(Application).Assembly);
            var resourceSet = resourceManager.GetResourceSet(CultureInfo.CurrentCulture, true, true);
            
            foreach (DictionaryEntry entry in resourceSet)
            {
                var key = entry.Key.ToString();
                var value = entry.Value.ToString();

                Tooltips[key] = value;
                // Don't forget to register our Tooltip in the Application.cs
            }
        }

    }
}
```

### `Application.cs`
```C#
// Autodesk
using Autodesk.Revit.UI;

// guRoo
using gRib = guRoo.Utilities.Ribbon_Utils;

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
            // ===========Register Tooltips===========
            Globals.RegisterTooltips("guRoo.Resources.Files.Tooltips");
            #endregion
            
            #region Removed because we added the Global Variables: 
            // Collect the controlled application:
            // var ctlApp = uiCtlApp.ControlledApplication;
            // var assembly = Assembly.GetExecutingAssembly();
            // avr assemblyPath = assembly.Location;
            // Variables
            // string tabName = "guRoo"
            #endregion
            
            #region Ribbon setup
            // Add RibbonTab
            uRib.AddRibbonTab(uiCtlApp, Globals.AddinName); 
            // Create RibbonPanel
            var panelGeneral = uRib.AddRibbonPanelToTab(uiCtlApp, Globals.AddinName, "General");
            // =====Updated Part=====
            // Add PushButton to RibbonPanel
            var buttonTest = uRib.AddPushButtonToPanel(panelGeneral, "Testing", "guRoo.Cmds_General.Cmd_Test");
            // Adjust it in Ribbon_Utils.cs
            // =====Updated Part=====
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

### Add `Icons` to `Resources` folder
1. Add 2 folders under `Resources`:
	1. `Icons16`
	2. `Icons32`
2. Go to [Icons8.com](https://icons8.com) 
3. Search and download the icons you need @ resolution 80x80.
4. Go to [Photopea.com](https://www.photopea.com)
	1. Create a New Project
	2. 96 Width, 96 Height, 96 DPI -> Create
	3. File -> Open -> Choose the downloaded `icon`
	4. Image -> Image Size -> Width=32, Height=32, DPI=96 -> OK
	5. File -> Export as -> PNG
	6. Image -> Image Size -> Width=16, Height=16, DPI=96 -> OK
	7. File -> Export as -> PNG
5. Place those 2 exported `images` to the folders you created earlier:
	1. `Icons16`
		1. Name: `General_test16.png`
	2. `Icons32`
		1. Name: `General_test32.png`
6. In the `Properties` of the images you have to make sure:
	1. `Build Action` -> `Embedded Resource`

> To make things even easier, we can make sure the `Build Action` gets set to `Embedded Resource` for all images added to the `Icons` folders, here how you would do that:

1. Go to the `Solution Explorer` and double click on your project name `guRoo` in this case.
2. Then you should find the following:
```C#
    <!-- Build configuration -->
    <!-- https://github.com/Nice3point/Revit.Build.Tasks -->
    <PropertyGroup>
        <IsRepackable>true</IsRepackable>
        <DeployRevitAddin>true</DeployRevitAddin>
    </PropertyGroup>
    <ItemGroup>
      <None Remove="Resources\Icons16\General_test16.png" />
      <None Remove="Resources\Icons32\General_test32.png" />
    </ItemGroup>
    <ItemGroup>
      <EmbeddedResource Include="Resources\Icons16\General_test16.png" />
      <EmbeddedResource Include="Resources\Icons32\General_test32.png" />
    </ItemGroup>
```
3. You should just replace the name of the images with a star `*`:
```C#
    <!-- Build configuration -->
    <!-- https://github.com/Nice3point/Revit.Build.Tasks -->
    <PropertyGroup>
        <IsRepackable>true</IsRepackable>
        <DeployRevitAddin>true</DeployRevitAddin>
    </PropertyGroup>
    <ItemGroup>
      <None Remove="Resources\Icons16\*.png" />
      <None Remove="Resources\Icons32\*.png" />
    </ItemGroup>
    <ItemGroup>
      <EmbeddedResource Include="Resources\Icons16\*.png" />
      <EmbeddedResource Include="Resources\Icons32\*.png" />
    </ItemGroup>
```
4. That's it, now every `image` you are going to place under these `folders` would automatically be `Embedded as Resources` after you `Build` this project.
5. Now we are going to add a `Method` to get an icon as an image source back in the `Ribbon_Utils.cs`.

### Summary
- All of this was done to make it super easy for you to create new buttons, from now on, you will be able to create a new button, simply by:
	- Going to `Application.cs`
	- Find this part:

```C#
// Add PushButton to RibbonPanel

var buttonTest = uRib.AddPushButtonToPanel(
	panelGeneral, 
	"Testing", 
	"guRoo.Cmds_General.Cmd_Test");
```
---
- And just Make sure to:
	- Get the `Command Class` right = `guRoo.Cmds_General.Cmd_Test`
	- Give it a `Name` = `Testing`
	- And specify what `Panel` is it going on = `panelGeneral`
	- Finally, add the `Icons` & `Tooltips`, that's it, you have a `New Button`.



<br>

> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.


