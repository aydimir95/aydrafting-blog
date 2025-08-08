+++
title = "C# + Revit API: Lesson 8 - Tooltips & Icons - Extension Methods"
date = 2025-08-08T13:13:50+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
+++

# 1. Base Command Name
```C#
// Command namespace
guRoo.Cmds_GroupName

//Command Class
guRoo.Cmds_GroupName.Cmd_CommandName

// Preferred method:
GroupName
GroupName._CommandName

// The Approach we will use:
guRoo.Cmds_GroupName.Cmd_CommandName

// Remove guRoo.Cmds_
GroupName.Cmd_CommandName

// Remove .Cmd
GrouName_CommandName
```

### Or you can make things even more resilient by using:
```C#
typeof(CommandName).FullName
```

### How to Name my Resources

Tooltipkey = base name
> GroupName
> GroupName_CommandName

Icons:
>GroupName##
>GroupName_CommandName##
>## => Resolution in pixels (16 / 32px)


## How we will manage `Tooltips`
We will create a **Resources (resx)** file in C# and embed this into our project. It will be available in memory for our project whilst it runs to access. We will store the tooltip and description as a dictionary of keys and values.

We will access this using the dedicated **ResourceManager class**.

## How we will manage Icons
Revit tools feature 2 icon types:

1. `Image` -> 16x16px (96dpi) icon which shows at a smaller resolution (e.g. in pulldown, quick access).
2. `LargeImage` -> 32x32px (96dpi) icon which shows at a larger resoltion (e.g. in PushButtons).

We will store our icons as embedded resources also in a PNG format. We will use a **ResourceStream** in order to decode these resources into a bitmap in our application.

**Streaming** resources is quite common in C/C# and allows decoding of memory into suitable resources, such as an **ImageSource**.


## Consolidation Functionality
> The goal here ultimately is to make the process of adding/assigning icons to our tools as simple as possible for the user.

>This will get around repetitive code, as well as providing a better entry environment for long text inputs such as tooltips.

# Homework:
- Create a command > base name converter
- Set up a tooltips resource 
- Read, store and assign a tooltip
- Set up icon files in 16/32 px format
- Assign the Icons to our Pushbuttons
- Test the changes

## Revit API
>`PushButtonData` Class

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


> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.