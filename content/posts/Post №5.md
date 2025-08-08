+++
title = "C# + Revit API: Lesson 6 - `if` Statements"
date = 2025-08-06T17:36:22+03:00
draft = false
tags = ["blog"]
+++


```C#
if // Condition
{
	run if condition is true;
}
else // If we have no false outcome -> we can skip 'else' branch altogether
{
	run if condition is false;
}
```

# `else if` Statement

```C#
if // Condition
{
	run if condition is true;
}
else if // Condition
{
	run if there are more conditions;
}
else // If we have no false outcome -> we can skip 'else' branch altogether
{
	run if condition is false;
}
```

# Shorthand `if` Statements

```C#
value = condition?then:else;
```

 > Nearly always used for quickly setting another variable to one of two possibilities, using a conditional outcome. Only used if it's a simple one liner task.

# Example
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;
using Nice3point.Revit.Toolkit.External;
using Microsoft.VisualBasic;

namespace guRoo.Commands
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
            //TaskDialog.Show(Document.Title, "Hot reload!");

            string input = Interaction.InputBox("Enter a number:", "Input Required", "0");

            if (!int.TryParse(input, out int i))
            {
                TaskDialog.Show(Document.Title, "Invalid number entered.");
                return;
            }

            // Shorthand version
            // string s = i == 3 ? "i is 2" : "i is not 2"; 

            string outcome;

            if (i == 2)
            {
                outcome = "i is 2";
            }
            else if (i == 3)
            {
                outcome = "i is 3";
            }
            else
            {
                outcome = "i is neither 2 nor 3";
            }
            
            TaskDialog.Show(Document.Title, outcome);
            
        }
    }
}
```