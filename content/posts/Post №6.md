+++
title = "C# + Revit API: Lesson 6 - `if` Statements"
date = 2025-08-08T11:47:12+03:00
draft = false
tags = ["blog"]
+++

# Pseudocode

```C#
try 
{
	try to do this;
}
catch
{
	if try gets exception, rollback and do this;
}
```

## Exceptions

 >Exceptions come in many forms and Revit API Docs typically specifies the types of Exceptions we can catch for its methods. There are also system type exceptions.
 
```C#
catch // Exception as "e" to print the error
{
	To catch a specific exceptions, catch as e;
}
catch
{
	To catch all exceptions, do this; 
	// but better to catch specific exceptions, 
	// otherwise you will catch all necessary and unecessary exceptions.
}
finally
{
	To run a final code regardless of outcome;
}
```

---
## Use Don't Abuse
 > When you first begin using languages, try statements seem great - you can write code, and if you make a mistake your code can continue. THIS IS WRONG!

 > Try statements should be used only when you know there is a chance an exception could occur, and it cannot be otherwise dealt with. 

 > You should make them as robust as possible, and use them only for parts of your code that need them.
 
## DON'T DO THIS!
```C#
try
{
	all code;
}
catch
{
	oh no, somethis went wrong;
}
```

# Example – Creating a Revit Sheet with Error Handling

```C#
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System;

public class CreateSheetExample
{
    public void CreateSheet(Document doc, ElementId titleBlockId)
    {
        try
        {
            using (Transaction tx = new Transaction(doc, "Create New Sheet"))
            {
                tx.Start();

                try
                {
                    // Attempt to create a sheet
                    ViewSheet sheet = ViewSheet.Create(doc, titleBlockId);
                    TaskDialog.Show("Success", $"Sheet '{sheet.Name}' created!");
                    
                    tx.Commit();
                }
                catch (Autodesk.Revit.Exceptions.ArgumentException argEx)
                {
                    // Rollback and handle known Revit-specific error
                    tx.RollBack();
                    TaskDialog.Show("Error", $"Invalid title block: {argEx.Message}");
                }
                catch (Exception ex)
                {
                    // Rollback for unexpected system-level errors
                    tx.RollBack();
                    TaskDialog.Show("Unexpected Error", ex.Message);
                }
            }
        }
        finally
        {
            // Always run this, no matter success or failure
            TaskDialog.Show("Info", "Finished attempting to create a sheet.");
        }
    }
}
```
