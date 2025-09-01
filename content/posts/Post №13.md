+++
title = "C# + Revit API: Lesson 13 - Case Study №1 [Section Automation]"
date = 2025-08-16T19:10:51+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++

# Introduction

## `Project Solution`
```bash
Solution
|-> ViewOnSheets2025
	|-> Dependencies
	|-> Properties
	|-> Commands
		|-> Cmd_AutoSect.cs
		|-> AutoSection
			|-> Cmd_AutoSectByBody.cs
			|-> Cmd_AutoSectByModel.cs
			|-> Cmd_AutoSectByPlane.cs
		|-> General
	|-> Extensions
		|-> AutoSection
			|-> Element_AutoSectionExt.cs
			|-> ViewSection_AutoSectionExt.cs
		|-> Document_Ext.cs
		|-> Element_Ext.cs
		|-> PulldownButton_Ext.cs
		|-> RibbonPanel_Ext.cs
		|-> UIControlledApplication_Ext.cs
		|-> ViewSection_Ext.cs
	|-> General 
		|-> Globals.cs
	|-> Models
		|-> AutoSection
			|-> BodySection
				|-> ElementTypeInfo.cs
				|-> SectionCreationSettings.cs
			|-> Common
				|-> AutoSectScenario.cs
			|-> ReferencePlaneItem.cs
	|-> Resources
		|-> Icons
	|-> Services
		|-> AutoSection
			|-> BodySectionService.cs
			|-> ModelSectionService.cs
			|-> PlaneSectionService.cs
		|-> SectionCreationService.cs
	|-> Utilities
		|-> Geometry_Utils.cs
		|-> Ribbon_Utils.cs
	|-> Views
		|-> AutoSectScenarioWindow.xaml
		|-> ReferencePlaneSelectionWindow.xaml
		|-> RevitSectionCreatorWindow.xaml
	|-> Application.cs  
	|-> Host.cs         
	|-> UKON.addin
```

---

# `Cmd_AutoSect.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using UKON.Views;
using UKON.Models.AutoSection.Common;
using UKON.Commands.AutoSection;
using System;

namespace UKON.Commands
{
    [Transaction(TransactionMode.Manual)]
    public class Cmd_AutoSect : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            try
            {
                // Показать диалог выбора типа разреза
                var scenarioWindow = new AutoSectScenarioWindow();
                if (scenarioWindow.ShowDialog() != true)
                    return Result.Cancelled;

                var selectedScenario = scenarioWindow.SelectedScenario;
                
                // Делегировать выполнение соответствующей команде
                return selectedScenario switch
                {
                    AutoSectScenario.ByBody => new Cmd_AutoSectByBody().Execute(commandData, ref message, elements),
                    AutoSectScenario.ByPlane => new Cmd_AutoSectByPlane().Execute(commandData, ref message, elements),
                    AutoSectScenario.ByModel => new Cmd_AutoSectByModel().Execute(commandData, ref message, elements),
                    _ => Result.Cancelled
                };
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return Result.Failed;
            }
        }
    }
}
```
# `Cmd_AutoSectByPlane.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using UKON.Services;
using UKON.Services.AutoSection;
using System;

namespace UKON.Commands.AutoSection
{
    [Transaction(TransactionMode.Manual)]
    public class Cmd_AutoSectByPlane : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            var uiApp = commandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            try
            {
                var planeSectionService = Host.GetService<PlaneSectionService>();
                return planeSectionService.ExecuteByPlane(uiDoc);
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return Result.Failed;
            }
        }
    }
}

```

![[Pasted image 20250829161635.png]]



