+++
title = "C# + Revit API: Lesson 12 - FilteredElementCollector"
date = 2025-08-15T10:37:24+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
+++

# Goal

- In most Revit add-ins, your first step will be to **collect elements from the model**.
- The go-to tool for this is the `FilteredElementCollector`, which lets you gather elements and then refine your selection using a variety of filtering techniques in C#.
## To explore everything there is to know about:

## `FilteredElementCollector`

- The `FilteredElementCollector` is a special Revit API class that works much like running a **database query**, with your Revit document acting as the database.
- It allows you to start with a broad set of elements and then refine your results using various filtering methods to target exactly what you need.

### **Declaring a Collector**

- To create a collector for the entire document:
```C#
var collector = new FilteredElementCollector(doc);
```

- If you only want elements visible in a specific view, pass the view’s Id:
```C#
var collector = new FilteredElementCollector(doc, view.Id);
```

# Revit API
### `FilteredElementCollector` Constructors

The `FilteredElementCollector` provides multiple constructor overloads, allowing you to start your collection from different scopes depending on your needs.

<br>

**1. Constructor with Document**

The most common constructor — collects elements from the entire document.
- `FilteredElementCollector` Constructor (`Document`):
```C#
public FilteredElementCollector(
	    Document document // The document to search in.
)
```

**Example:**
```C#
var collector = new FilteredElementCollector(doc);
```

<br>
<br>

**2. Constructor with Document and ElementId (View)**

Collects only elements **visible in a specific view**, identified by its ElementId.
- `FilteredElementCollector` Constructor (`Document`, `ElementId`)
```C#
public FilteredElementCollector(
	    Document document,
	    ElementId viewId // The view’s ID.
)
```

**Example:**
```C#
var collector = new FilteredElementCollector(doc, view.Id);
```

<br>
<br>

**3. Constructor with `Document` and `ICollection<ElementId>`**

Filters a **predefined set of elements**. Useful when you’ve already gathered certain elements and want to further refine that list.
- `FilteredElementCollector` Constructor (`Document`, `ICollection(ElementId)`)
```C#
public FilteredElementCollector(
	    Document document,
	    ICollection<ElementId> elementIds // A set of element IDs to filter.
)
```

**Example:**
```C#
var collector = new FilteredElementCollector(doc, myElementIds);
```

<br>
<br>

**4. Constructor with `Document`, `ElementId (View)`, and `ElementId (Link)`**

Filters elements within a **linked Revit model**, scoped to a specific view.
- `FilteredElementCollector` Constructor (`Document`, `ElementId`, `ElementId`)
```C#
public FilteredElementCollector(
	    Document document,
	    ElementId viewId,  // The view ID in the host document.
	    ElementId linkId   // The Revit link instance ID in the host document.
)
```

**Example:**
```C#
var collector = new FilteredElementCollector(doc, view.Id, linkInstance.Id);
```

---
### `FilteredElementCollector` Methods

| Name                                                                                                         | Description                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ContainedInDesignOption](https://www.revitapidocs.com/2025/92a2be0f-f632-2337-5bdd-ae3e832f3c33.htm)        | Applies an ElementDesignOptionFilter to the collector.                                                                                                                              |
| [Dispose](https://www.revitapidocs.com/2025/c23c8781-f645-c059-7db5-d0cfd732dda1.htm)                        |                                                                                                                                                                                     |
| [Equals](https://learn.microsoft.com/dotnet/api/system.object.equals#system-object-equals\(system-object\))  | Determines whether the specified object is equal to the current object.   <br>(Inherited from [Object](https://learn.microsoft.com/dotnet/api/system.object) )                      |
| [Excluding](https://www.revitapidocs.com/2025/80e23fdc-c005-163b-5643-38d84411a73d.htm)                      | Applies an ExclusionFilter to the collector.                                                                                                                                        |
| [FirstElement](https://www.revitapidocs.com/2025/c8c1cae0-4ac8-a309-e915-6d491137d47e.htm)                   | Returns the first element to pass the filter(s).                                                                                                                                    |
| [FirstElementId](https://www.revitapidocs.com/2025/b1b42ac5-e816-983a-f44d-5cf441ca1ad9.htm)                 | Returns the id of the first element to pass the filter(s).                                                                                                                          |
| [GetBasicIEnumerator](https://www.revitapidocs.com/2025/07236f22-1721-1f6e-0fb6-f03709923430.htm)            | Returns an enumerator that iterates through a collection.                                                                                                                           |
| [GetElementCount](https://www.revitapidocs.com/2025/886aabfd-ea87-e54c-d108-37d09a44d612.htm)                | Gets the number of elements in your current filter.                                                                                                                                 |
| [GetElementIdIterator](https://www.revitapidocs.com/2025/0b1cdbeb-21ce-a4c5-6cae-253595818085.htm)           | Returns an element id iterator to the elements passing the filters.                                                                                                                 |
| [GetElementIterator](https://www.revitapidocs.com/2025/7113e21c-90f8-8f58-3b00-407fc1cd56e0.htm)             | Returns an element iterator to the elements passing the filters.                                                                                                                    |
| [GetEnumerator](https://www.revitapidocs.com/2025/746ac65b-35c2-d0db-53d7-4fe0fd61ab1f.htm)                  | Returns an enumerator that iterates through a collection.                                                                                                                           |
| [GetHashCode](https://learn.microsoft.com/dotnet/api/system.object.gethashcode#system-object-gethashcode)    | Serves as the default hash function.   <br>(Inherited from [Object](https://learn.microsoft.com/dotnet/api/system.object) )                                                         |
| [GetType](https://learn.microsoft.com/dotnet/api/system.object.gettype#system-object-gettype)                | Gets the [Type](https://learn.microsoft.com/dotnet/api/system.type) of the current instance.   <br>(Inherited from [Object](https://learn.microsoft.com/dotnet/api/system.object) ) |
| [IntersectWith](https://www.revitapidocs.com/2025/5b204fc8-7702-cf7e-346a-3a4c1767924b.htm)                  | Intersects the set of elements passing the filter in this collector with the set of elements passing the filter in another collector.                                               |
| [IsViewValidForElementIteration](https://www.revitapidocs.com/2025/9c7f3f9c-aa8a-8077-9235-ff1058c8b20b.htm) | Identifies if the particular element is valid for iteration of drawn elements.                                                                                                      |
| [OfCategory](https://www.revitapidocs.com/2025/c3523c35-4a07-9723-3c28-de3cc47b2ad0.htm)                     | Applies an ElementCategoryFilter to the collector.                                                                                                                                  |
| [OfCategoryId](https://www.revitapidocs.com/2025/63304108-73f8-844e-82fc-5b8fad9839b0.htm)                   | Applies an ElementCategoryFilter to the collector.                                                                                                                                  |
| [OfClass](https://www.revitapidocs.com/2025/b0a5f22c-6951-c3af-cd29-1f28f574035d.htm)                        | Applies an ElementClassFilter to the collector.                                                                                                                                     |
| [OwnedByView](https://www.revitapidocs.com/2025/54f2107a-bd87-41fe-dd00-385253ba5915.htm)                    | Applies an ElementOwnerViewFilter to the collector.                                                                                                                                 |
| [ToElementIds](https://www.revitapidocs.com/2025/bfb8c8a2-aa2f-b1bc-7d57-7e3f7d39fcae.htm)                   | Returns the complete set of element ids that pass the filter(s).                                                                                                                    |
| [ToElements](https://www.revitapidocs.com/2025/732b4a0d-62d8-b86d-120b-8ea3d9713b34.htm)                     | Returns the complete set of elements that pass the filter(s).                                                                                                                       |
| [ToString](https://learn.microsoft.com/dotnet/api/system.object.tostring#system-object-tostring)             | Returns a string that represents the current object.   <br>(Inherited from [Object](https://learn.microsoft.com/dotnet/api/system.object) )                                         |
| [UnionWith](https://www.revitapidocs.com/2025/957cc5cb-5c7f-cac9-ec86-35afe824c432.htm)                      | Unites the set of elements passing the filter in this collector with the set of elements passing the filter in another collector.                                                   |
| [WhereElementIsCurveDriven](https://www.revitapidocs.com/2025/3f3269fc-367c-1fec-9ddb-d0b54ecc4f0e.htm)      | Applies an ElementIsCurveDrivenFilter to the collector.                                                                                                                             |
| [WhereElementIsElementType](https://www.revitapidocs.com/2025/77793daa-5a26-b4d6-9019-4d998a55099e.htm)      | Applies an ElementIsElementTypeFilter to the collector.                                                                                                                             |
| [WhereElementIsNotElementType](https://www.revitapidocs.com/2025/061cbbb9-26f1-a8f8-a4b2-3d7ff0105199.htm)   | Applies an inverted ElementIsElementTypeFilter to the collector.                                                                                                                    |
| [WhereElementIsViewIndependent](https://www.revitapidocs.com/2025/38b15459-9ffe-204a-0193-47c3a1b5e6e2.htm)  | Applies an ElementOwnerViewFilter to the collector.                                                                                                                                 |
| [WherePasses](https://www.revitapidocs.com/2025/42d4eef3-55a1-2739-0ef8-6bc1d9fc2755.htm)                    | Applies an element filter to the collector.                                                                                                                                         |

---
# Method Chaining in C# 

## What is Method Chaining?

Method chaining allows you to call multiple methods on an object in a single statement by linking them together with dots (`.`). Each method returns an object that the next method can be called on.

Think of it like a conveyor belt in a factory - each station (method) processes the item and passes it to the next station.

## Basic Concept

Instead of writing multiple separate lines:

```C#
// Without chaining (multiple lines)
var collector = new FilteredElementCollector(doc);
collector = collector.OfClass(typeof(Wall));
collector = collector.WhereElementIsNotElementType();
var elements = collector.ToElements();
```

You can chain methods together:

```C#
// With chaining (single statement)
var elements = new FilteredElementCollector(doc)
    .OfClass(typeof(Wall))
    .WhereElementIsNotElementType()
    .ToElements();
```

## How Method Chaining Works

1. **Return Value**: Each method in the chain returns an object (often the same type)
2. **Dot Notation**: Use `.` to call the next method on the returned object
3. **Left-to-Right**: Methods execute from left to right (or top to bottom when formatted)

## Understanding `.OfClass` vs `.OfCategory`

This is **crucial** to understand! These two methods filter eleme=nts in completely different ways:

### `.OfClass()` - Filters by C# Class Type

- Filters based on the **underlying programming class** in the Revit API
- Examples: `Wall`, `Floor`, `FamilyInstance`, `TextNote`, etc.
- **One class can contain multiple categories**

### `.OfCategory()` - Filters by Revit Category

- Filters based on the **visual category** you see in Revit's interface
- Examples: `OST_Walls`, `OST_Doors`, `OST_Windows`, `OST_Floors`, etc.
- **More specific than class filtering**

### Key Insight: `FamilyInstance` Class

Many different Revit elements share the same class but have different categories:

```C#
// These are ALL FamilyInstance class, but different categories:
var doors = new FilteredElementCollector(doc)
    .OfClass(typeof(FamilyInstance))           // Class: FamilyInstance
    .OfCategory(BuiltInCategory.OST_Doors)     // Category: Doors
    .ToElements();

var windows = new FilteredElementCollector(doc)
    .OfClass(typeof(FamilyInstance))           // Class: FamilyInstance  
    .OfCategory(BuiltInCategory.OST_Windows)   // Category: Windows
    .ToElements();

var furniture = new FilteredElementCollector(doc)
    .OfClass(typeof(FamilyInstance))           // Class: FamilyInstance
    .OfCategory(BuiltInCategory.OST_Furniture) // Category: Furniture
    .ToElements();
```

### When to Use Which?

**Use `.OfClass()` when:**

- You want ALL elements of a specific programming type
- The class directly matches what you want (like `Wall`, `Floor`)

**Use `.OfCategory()` when:**

- You want elements from a specific Revit category
- You're working with FamilyInstances and need to specify which type

**Use `BOTH` when:**

- You want to be very specific and ensure you get exactly what you expect


---

## Understanding `BuiltInCategory` and Alternatives

### What is BuiltInCategory?

`BuiltInCategory` is an **enumeration** (enum) provided by the Revit API that contains predefined constants for all the standard Revit categories. Think of it as a list of "official category names" that Revit recognizes.

```C#
// BuiltInCategory is an enum with values like:
BuiltInCategory.OST_Walls
BuiltInCategory.OST_Doors  
BuiltInCategory.OST_Windows
BuiltInCategory.OST_Floors
BuiltInCategory.OST_Furniture
// ... and hundreds more
```

### Why Use `BuiltInCategory`? (Recommended Approach)

**Advantages:**

- **Type Safety**: The compiler catches typos
- **IntelliSense**: Auto-complete shows you available options
- **No Spelling Errors**: Can't misspell category names
- **Language Independent**: Works regardless of Revit's display language
- **Future Proof**: Updates automatically with new Revit versions

```C#
// ✅ GOOD: Using BuiltInCategory
var doors = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)  // IntelliSense helps, no typos possible
    .WhereElementIsNotElementType()
    .ToElements();
```

### Alternative 1: Using Category `Objects`

You can get Category objects and use their ElementId:

```C#
// Find category by name
var doorCategory = doc.Categories
    .Cast<Category>()
    .FirstOrDefault(c => c.Name == "Doors");

if (doorCategory != null)
{
    var doors = new FilteredElementCollector(doc)
        .OfCategoryId(doorCategory.Id)  // Using ElementId
        .WhereElementIsNotElementType()
        .ToElements();
}
```

**When to use:**

- Working with custom categories created by users
- Dynamic category selection based on user input
- When you need access to Category properties

### Alternative 2: Using Category `Names` (Not Recommended)

```C#
// ❌ PROBLEMATIC: This approach has issues
var allCategories = doc.Categories;
foreach (Category cat in allCategories)
{
    if (cat.Name == "Doors")  // Depends on Revit language!
    {
        var doors = new FilteredElementCollector(doc)
            .OfCategoryId(cat.Id)
            .ToElements();
        break;
    }
}
```

**Problems with this approach:**

- **Language Dependent**: "Doors" in English, "Portes" in French, "Türen" in German
- **Typo Prone**: Easy to misspell category names
- **Performance**: Requires searching through all categories
- **Fragile**: Breaks if category names change

### Alternative 3: Converting Between Approaches

Sometimes you need to convert between different category representations:


```C#
// Convert BuiltInCategory to Category object
var builtInCat = BuiltInCategory.OST_Doors;
var category = Category.GetCategory(doc, builtInCat);

// Convert BuiltInCategory to ElementId
var elementId = new ElementId(builtInCat);

// Use either approach:
var doors1 = new FilteredElementCollector(doc)
    .OfCategory(builtInCat)      // Direct BuiltInCategory
    .ToElements();

var doors2 = new FilteredElementCollector(doc)
    .OfCategoryId(elementId)     // Using ElementId
    .ToElements();
```

### Practical Example: `User-Defined` Categories

When dealing with custom categories (created by users), you'll need the Category object approach:


```C#
// Example: Get elements from a custom category
public IList<Element> GetElementsFromCustomCategory(Document doc, string categoryName)
{
    // Find the custom category
    var customCategory = doc.Categories
        .Cast<Category>()
        .FirstOrDefault(c => c.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));
    
    if (customCategory != null)
    {
        return new FilteredElementCollector(doc)
            .OfCategoryId(customCategory.Id)
            .WhereElementIsNotElementType()
            .ToElements();
    }
    
    return new List<Element>(); // Return empty list if category not found
}
```

### Best Practice Summary

**Use `BuiltInCategory` for standard Revit categories** (95% of cases):

```C#
.OfCategory(BuiltInCategory.OST_Doors)
```


**Use `Category` objects for custom or dynamic scenarios**:

```C#
.OfCategoryId(customCategory.Id)
```

**Avoid string-based category searching** unless absolutely necessary.

### Common `BuiltInCategory` Values

Here are some frequently used categories for reference:

```C#
// Architectural
BuiltInCategory.OST_Walls
BuiltInCategory.OST_Doors  
BuiltInCategory.OST_Windows
BuiltInCategory.OST_Floors
BuiltInCategory.OST_Roofs
BuiltInCategory.OST_Ceilings
BuiltInCategory.OST_Stairs

// MEP
BuiltInCategory.OST_DuctCurves
BuiltInCategory.OST_PipeCurves
BuiltInCategory.OST_ElectricalFixtures
BuiltInCategory.OST_LightingFixtures

// Structural  
BuiltInCategory.OST_StructuralColumns
BuiltInCategory.OST_StructuralFraming
BuiltInCategory.OST_StructuralFoundation

// Furniture & Equipment
BuiltInCategory.OST_Furniture
BuiltInCategory.OST_SpecialityEquipment
BuiltInCategory.OST_PlumbingFixtures
```


---

## `FilteredElementCollector` Examples

### Example 1: Get All `Walls` (Class-based)

```C#
var walls = new FilteredElementCollector(doc)
    .OfClass(typeof(Wall))                // Wall class = Wall category
    .WhereElementIsNotElementType()
    .ToElements();
```

### Example 2: Get `Windows` (Category-based - More Common)

```C#
var windows = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Windows)  // Category filtering
    .WhereElementIsNotElementType()
    .ToElements();
```

### Example 3: Get `Windows` (Belt & Suspenders Approach)

```C#
var windows = new FilteredElementCollector(doc)
    .OfClass(typeof(FamilyInstance))          // Class filtering
    .OfCategory(BuiltInCategory.OST_Windows)  // Category filtering  
    .WhereElementIsNotElementType()
    .ToElements();
```

### Example 4: Get ALL Family Instances (Any Category)

```C#
var allFamilyInstances = new FilteredElementCollector(doc)
    .OfClass(typeof(FamilyInstance))     // Gets doors, windows, furniture, etc.
    .WhereElementIsNotElementType()
    .ToElements();
```

## Understanding `.WhereElementIsNotElementType()`

This method is **extremely important** and addresses a fundamental concept in Revit: the difference between **`Element Types`** and **`Element Instances`**.

### Element Types vs Element Instances

**`Element Types`** (Templates/Definitions):

- These are the "recipes" or "templates" for elements
- Examples: "Interior Door 36"×84"", "Exterior Wall - Brick", "Standard Table"
- You see these in the Project Browser under "Families"
- They define properties but aren't physical objects in your model

**`Element Instances`** (Actual Placed Elements):

- These are the actual elements placed in your model
- Examples: The specific door at coordinate (10, 5), the wall from point A to B
- These are what you see and select in your 3D/plan views
- They reference a type but exist at specific locations

### The Methods

```C#
// Gets ONLY element instances (the actual placed elements)
.WhereElementIsNotElementType()

// Gets ONLY element types (the definitions/templates)  
.WhereElementIsElementType()
```

### Why This Matters

When you collect elements without these filters, you get **BOTH** types and instances:

```C#
// WITHOUT filtering - gets both types and instances
var everything = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .ToElements();
// Result: Door types AND door instances mixed together

// WITH instance filtering - gets only placed doors
var actualDoors = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .WhereElementIsNotElementType()    // Only instances
    .ToElements();
// Result: Only the actual doors placed in the model

// WITH type filtering - gets only door type definitions
var doorTypes = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .WhereElementIsElementType()       // Only types
    .ToElements();
// Result: Only the door type definitions
```

### Common Use Cases

**Most Common: Get Instances (`.WhereElementIsNotElementType()`)**

```C#
// Count how many doors are actually placed in the model
var doorCount = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .WhereElementIsNotElementType()
    .GetElementCount();

// Get all placed walls to analyze their geometry
var walls = new FilteredElementCollector(doc)
    .OfClass(typeof(Wall))
    .WhereElementIsNotElementType()
    .ToElements();
```

**Sometimes Needed: Get Types (`.WhereElementIsElementType()`)**

```C#
// Get all door types to list available options
var doorTypes = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .WhereElementIsElementType()
    .ToElements();

// Get all wall types to copy to another project
var wallTypes = new FilteredElementCollector(doc)
    .OfClass(typeof(WallType))           // WallType class
    .WhereElementIsElementType()         // Redundant but explicit
    .ToElements();
```

### Pro Tip: Some Classes Are Always Types

Some classes like `WallType`, `FloorType`, `FamilySymbol` are **always** types, so `.WhereElementIsElementType()` is redundant (but harmless):

```C#
// These are equivalent for type classes:
var wallTypes1 = new FilteredElementCollector(doc)
    .OfClass(typeof(WallType))
    .ToElements();

var wallTypes2 = new FilteredElementCollector(doc)
    .OfClass(typeof(WallType))
    .WhereElementIsElementType()    // Redundant but OK
    .ToElements();
```

### Memory Aid

- **`Instance`** = "In-stance" = **IN** the model (placed/physical)
- **`Type`** = "Template" = **NOT** placed (definition only)

**Rule of thumb**: 99% of the time you want `.WhereElementIsNotElementType()` because you're working with actual placed elements!
### Example 5: To Get All Elements Visible in a Specific View

```C#
var visibleElements = new FilteredElementCollector(doc, viewId)
    .OfClass(typeof(FamilyInstance))
    .WhereElementIsNotElementType()
    .ToElementIds();
```

---
## Custom Filters

```C#
var filteredElements = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .WhereElementIsNotElementType()
    .WherePasses(new ElementLevelFilter(levelId))
    .ToElements();
```

### Understanding `.WherePasses()` and Custom Filters

The `.WherePasses()` method allows you to apply **custom filters** that go beyond the basic filtering capabilities of `.OfClass()` and `.OfCategory()`. This is where you can get very specific about which elements you want.

### `.WherePasses()` Syntax

```C#
.WherePasses(new SomeFilter(parameters))
```

### `ElementLevelFilter` Example 6

The `ElementLevelFilter` filters elements based on which **level** they belong to:

```C#
// Get all doors on Level 1
var level1Doors = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .WhereElementIsNotElementType()
    .WherePasses(new ElementLevelFilter(levelId))    // Only elements on this level
    .ToElements();
```

**What you need:**

- `levelId` - The ElementId of the specific level you want to filter by

**How to get a levelId:**

```C#
// Option 1: Find level by name
var level1 = new FilteredElementCollector(doc)
    .OfClass(typeof(Level))
    .Cast<Level>()
    .FirstOrDefault(l => l.Name == "Level 1");
var levelId = level1?.Id;

// Option 2: Get all levels and pick one
var allLevels = new FilteredElementCollector(doc)
    .OfClass(typeof(Level))
    .ToElements();
var levelId = allLevels.First().Id;
```

### Complete Working Example 7

```C#
// Step 1: Get the level we want
var targetLevel = new FilteredElementCollector(doc)
    .OfClass(typeof(Level))
    .Cast<Level>()
    .FirstOrDefault(l => l.Name == "Level 1");

if (targetLevel != null)
{
    // Step 2: Get all doors on that level
    var level1Doors = new FilteredElementCollector(doc)
        .OfCategory(BuiltInCategory.OST_Doors)
        .WhereElementIsNotElementType()
        .WherePasses(new ElementLevelFilter(targetLevel.Id))
        .ToElements();
    
    // Now you have only doors that exist on Level 1
}
```

### Other Common Custom Filters

**`ElementClassFilter`** (alternative to `.OfClass()`):

```C#
.WherePasses(new ElementClassFilter(typeof(Wall)))
```

**`ElementCategoryFilter`** (alternative to .`OfCategory()`):

```C#
.WherePasses(new ElementCategoryFilter(BuiltInCategory.OST_Walls))
```

**`LogicalAndFilter`** (combine multiple filters with `AND`):

```C#
var filter1 = new ElementLevelFilter(levelId);
var filter2 = new ElementCategoryFilter(BuiltInCategory.OST_Doors);
var combinedFilter = new LogicalAndFilter(filter1, filter2);

var result = new FilteredElementCollector(doc)
    .WhereElementIsNotElementType()
    .WherePasses(combinedFilter)
    .ToElements();
```

**`LogicalOrFilter`** (combine multiple filters with `OR`):

```C#
var doorsFilter = new ElementCategoryFilter(BuiltInCategory.OST_Doors);
var windowsFilter = new ElementCategoryFilter(BuiltInCategory.OST_Windows);
var doorsOrWindows = new LogicalOrFilter(doorsFilter, windowsFilter);

var result = new FilteredElementCollector(doc)
    .WhereElementIsNotElementType()
    .WherePasses(doorsOrWindows)
    .ToElements();
```

### When to Use `.WherePasses()`

**Use `.WherePasses()` when:**

- Built-in methods (`.OfClass()`, `.OfCategory()`) aren't specific enough
- You need to filter by `level`, `view`, or other specific `properties`
- You need to combine multiple filter conditions
- You're working with complex filtering logic

**Stick with `built-in` methods when:**

- Simple category or class filtering is sufficient
- You want cleaner, more readable code

### Performance Tip

Apply the most restrictive filters first, then use `.WherePasses()` for fine-tuning:

```C#
// Good: Filter by category first, then by level
var efficientQuery = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)          // Narrow down first
    .WhereElementIsNotElementType()
    .WherePasses(new ElementLevelFilter(levelId))   // Fine-tune
    .ToElements();

// Less efficient: Custom filter on everything
var lessEfficientQuery = new FilteredElementCollector(doc)
    .WherePasses(new ElementLevelFilter(levelId))   // Filter everything first
    .OfCategory(BuiltInCategory.OST_Doors)          // Then narrow down
    .ToElements();
```

---
## Formatting for Readability

When chaining gets long, format it vertically for better readability:

```C#
// Good formatting - easy to read
var elements = new FilteredElementCollector(doc)
    .OfClass(typeof(Wall))
    .OfCategory(BuiltInCategory.OST_Walls)
    .WhereElementIsNotElementType()
    .WherePasses(someFilter)
    .ToElements();

// Bad formatting - hard to read
var elements = new FilteredElementCollector(doc).OfClass(typeof(Wall)).OfCategory(BuiltInCategory.OST_Walls).WhereElementIsNotElementType().WherePasses(someFilter).ToElements();
```

## Benefits of Method Chaining

1. **Concise Code**: Less lines, more readable
2. **Fluent Interface**: Reads almost like natural language
3. **Performance**: Can be more efficient (no intermediate variables)
4. **Less Variables**: No need to store intermediate results

## Common Patterns

### Pattern 1: Filter → Refine → Collect

```C#
var result = new FilteredElementCollector(doc)
    .OfClass(typeof(SomeClass))           // Filter by class
    .WhereElementIsNotElementType()       // Refine selection
    .ToElements();                        // Collect results
```

### Pattern 2: Category → Type → Custom Filter

```C#
var result = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Walls)  // Filter by category
    .WhereElementIsNotElementType()         // Exclude types
    .WherePasses(customFilter)              // Apply custom filter
    .ToElements();                          // Collect results
```

### Pattern 3: Count Elements

```C#
var count = new FilteredElementCollector(doc)
    .OfClass(typeof(Wall))
    .WhereElementIsNotElementType()
    .GetElementCount();  // Just get the count, not the elements
```

## Important Notes

- **Order Matters**: Apply the most restrictive filters first for better performance
- **Semicolon**: Don't forget the `;` at the end of the statement
- **Line Breaks**: You can break lines anywhere in the chain for readability
- **Return Types**: Make sure each method returns something the next method can work with

## Practice Exercise

Try converting this non-chained code to use method chaining:

```C#
// Convert this:
var collector = new FilteredElementCollector(doc);
collector = collector.OfCategory(BuiltInCategory.OST_Doors);
collector = collector.WhereElementIsNotElementType();
var doorElements = collector.ToElements();

// To this format:
var doorElements = // Your chained solution here
```

**Solution:**

```C#
var doorElements = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .WhereElementIsNotElementType()
    .ToElements();
```

> Method chaining makes your Revit add-in code cleaner and more professional!


# Homework



# Solution
