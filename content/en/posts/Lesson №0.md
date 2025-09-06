+++
title = "C# + Revit API: Lesson 0"
date = 2025-09-01T00:00:00+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250903011611.png"
cover.alt = "Lesson 0"
translationKey = "lesson-0"
+++
# Why C#?
`Scalability`
# Start with
1. [Install Visual Studio 2022 Community](https://visualstudio.microsoft.com/downloads/)
2. [Install .NET SDKs (.NET4.8 & .NET8)](https://dotnet.microsoft.com/en-us/download/visual-studio-sdks)
3. [Install Nice3Point Templates](https://github.com/Nice3point/RevitTemplates)
# Project Solution
## Start a solution / project
1. Create a `new project`
![Pasted image 20250906182035.png](</images/Pasted image 20250906182035.png>)
2. Choose the Revit Addin (`Nice3Point`) Template
![Pasted image 20250906182237.png](</images/Pasted image 20250906182237.png>)
3. Configure your new project
	1. `Name` of the project
	2. `Location` 
	3. `Solution Name` - same as project name (it's a folder name that holds many projects)
![Pasted image 20250906182441.png](</images/Pasted image 20250906182441.png>)
4. Additional Information
	1. Add-in type -> `Application`
	2. User Interface -> `None`
	3. IoC -> `Disabled`
	4. Serilog support -> `unchecked`
![Pasted image 20250906182636.png](</images/Pasted image 20250906182636.png>)

> Keep it simple for now, you can change those settings later in the project.
## **Exploring Your `Visual Studio` Project**

1. **`Solution Explorer` (Like Revit’s Project Browser)**
	- This is where you see all your project’s files, folders, and references. Think of it like Revit’s Project Browser but for your code.
2. **Error List & Output Window**
    - **Error List** shows mistakes or warnings in your code.
    - **Output Window** shows messages from Visual Studio, like when a build succeeds or fails.
3. **The .csproj File**
	- This file stores all your project settings. With the Nice3Point template, it’s already set up for Revit 2025, so you don’t need to configure much yet.
4. **The .addin File**
	- This file tells Revit about your plugin—where it is and how to load it.
	    - For now, just change the GUID (a unique ID for your add-in).
	    - We’ll adjust other settings later.
![Pasted image 20250906184004.png](</images/Pasted image 20250906184004.png>)
## **The Application Class**
> This is the “entry point” of your plugin. Revit looks here first when starting or closing:

![Pasted image 20250906184151.png](</images/Pasted image 20250906184151.png>)
1. **Class Type**: `ExternalApplication`
	- This tells Revit that your add-in is an application (not just a single button command).
2. **The `OnStartup()` Method**
	- This method runs automatically when Revit starts.
	    - It calls another function named CreateRibbon().
	    - CreateRibbon() sets up a **Panel** in the Revit ribbon.
	    - It adds a **Button** to that panel.
	    - The button includes two **Icons** for different sizes.
3. **How `CreateRibbon()` Works**
    - CreatePanel() is a built-in Revit API function that creates a panel.
    - AddPushButton() is another API function that adds a clickable button.
    - Both functions come preconfigured in the template, so you can start coding without needing to set them up yourself.
4. `Commands Folder`
	1. `StartupCommand.cs` - Core Code
	```C#
	using Autodesk.Revit.Attributes;
	using Autodesk.Revit.UI;
	using Nice3point.Revit.Toolkit.External;
	
	namespace Test.Commands
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
				TaskDialog.Show(Document.Title, "Test");
			}
		}
	}
	```
	2. Currently: Task Dialog - Shows the name of the `.addin`
		1. `ExternalCommand`, but we should use `IExternalCommand`
	3. This is the part that writes the logic for your button
	4. Once you click the button, whatever is under Commands Folder connected to the button will be executed.
	5. If you change the TaskDialog.Show(Document.Title, "Hello World");
		1. Once you press the button in Revit it would show "Hello World" 
6. Resources:
	1. Icons
7. Everything is saved in windows explorer
8. Configurations:
	1. Debug and Release
	2. Per Revit Version from R20 to R25
9. References:
	1. Under: This PC > Windows (C:) > Program Files > Autodesk > Revit [2025].
	2. DLL Files that you can reference to your project to build something.
	3. You could even add an excel package to work with Excel, will do that later.
10. Build and test the first plugin
	1. Choose the `Debug R25` for Revit 2025:
![Pasted image 20250906185207.png](</images/Pasted image 20250906185207.png>)
11. Build the solution by clicking on `Run` (Play Button `TEST`) next to `Any CPU`.
12. Launches Revit (Version that you pre-configured)
13. `Always Load` your `.addin`
14. What happened behind the scenes:
	1. VS2022 Added the DLL file and the `.addin` file into the right folder and launched Revit version that you specified with the Plugin loaded into Revit.
	2. That became possible due to preconfigured Visual Studio `Nice3Point` Template that you ran earlier. 
	3. Everything is already set and pathed for you for the ease of starting and launching plugins.
15. Go to `New Project`
	1. Find your new panel in the `panel` tabs on the top of Revit UI.
	2. Find your Plugin / add-in 
![Pasted image 20250906185557.png](</images/Pasted image 20250906185557.png>)
	3. Click on it 
	4. And you will get a message with the `name` of your Tool.
![Pasted image 20250906185624.png](</images/Pasted image 20250906185624.png>)
16. That's it, you can stop `Debug` back in the `Visual Studio` 
	1. Closes Revit & Debug Mode
![Pasted image 20250906190059.png](</images/Pasted image 20250906190059.png>)


> From here, you have created your first application or button in Revit!
> Congratulations! Now, you’re ready to start coding real functionality. **In [Lesson 1](https://blog.aydrafting.com/en/), we’ll walk through a full IExternalCommand example step-by-step**.