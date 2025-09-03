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
1. Start a solution / project
	1. Create a `new project`
	2. Choose the Revit Addin (`Nice3Point`) Template
	3. Configure your new project
		1. `Name` of the project
		2. `Location` 
		3. `Solution Name` - same as project name (it's a folder name that holds many projects)
	4. Additional Information
		1. Add-in type -> `Application`
		2. User Interface -> `None`
		3. IoC -> `Disabled`
		4. Serilog support -> `unchecked`
2. Explore `Visual Studio`
	1. Properties & Solution Explorer (Project Browser in Revit)
	2. Error & Output
	3. `CSProj` -> Preconfigured up to Revit v.2025
	4. `.addin` -> Change GUID (The rest we will change later)
	5. Application Class:
		1. Tells your `.addin` how to begin and how to finish when Revit opens and closes.
		2. `Class`: External Application
		3. Method: `OnStartup()`
			1. Will run `Create Ribbon()`
			2. Creates a **`Panel`** 
			3. Adds a **`PushButton`** to that **Panel**
			4. With 2 **`Icons`**
		4. Our Application
			1. `OnStartup`
			2. When it begins, it calls a Function "`CreateRibbon()`"
			3. And CreateRibbon is a defined function below that:
				1. Creates a panel
					1. This is possible due to pre-configured Revit API that we are using
					2. `CreatePanel` - is a pre-defined method under Revit API that, you guessed it, Creates a Panel in Revit.
				2. Creates a button
					1. Same for the Button 
					2. `AddPushButton` Method in Revit API - Creates a button 
	6. Commands Folder
		1. Core Code
		2. Currently: Task Dialog - Shows the name of the `.addin`
			1. `ExternalCommand`, but we should use `IExternalCommand`
		3. This is the part that writes the logic for your button
		4. Once you click the button, whatever is under Commands Folder connected to the button will be executed.
		5. If you change the TaskDialog.Show(Document.Title, "Hello World");
			1. Once you press the button in Revit it would show "Hello World" 
	7. Resources:
		1. Icons
	8. Everything is saved in windows explorer
	9. Configurations:
		1. Debug and Release
		2. Per Revit Version from R20 to R25
	10. References:
		1. Under: This PC > Windows (C:) > Program Files > Autodesk > Revit [2025].
		2. DLL Files that you can reference to your project to build something.
		3. You could even add an excel package to work with Excel, will do that later.
3. Build and test the first plugin
	1. Build the solution by clicking on `Run` (Play Button) next to `Any CPU`.
	2. Launches Revit (Version that you pre-configured)
	3. `Always Load` your `.addin`
	4. What happened behind the scenes:
		1. VS2022 Added the DLL file and the `.addin` file into the right folder and launched Revit version that you specified with the Plugin loaded into Revit.
		2. That became possible due to preconfigured Visual Studio `Nice3Point` Template that you ran earlier. 
		3. Everything is already set and pathed for you for the ease of starting and launching plugins.
	5. Go to `New Project`
		1. Find your new panel in the `panel` tabs on the top of Revit UI.
		2. Find your Plugin / add-in 
		3. Click on it 
		4. And you will get a message with the `name` of your Tool.
	6. Stop `Debug`
		1. Closes Revit & Debug Mode
