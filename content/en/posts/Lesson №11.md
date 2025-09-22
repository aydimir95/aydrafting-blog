+++
title = "C# + Revit API: Lesson 11 - FilteredElementCollector"
date = 2025-11-17T18:00:00+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250902210047.png"
cover.alt = "Create a Pulldown Button"
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

### Why Use [`BuiltInCategory`](https://www.revitapidocs.com/2026/ba1c5b30-242f-5fdc-8ea9-ec3b61e6e722.htm)? (Recommended Approach)

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

- The `.WherePasses()` method allows you to apply **custom filters** that go beyond the basic filtering capabilities of `.OfClass()` and `.OfCategory()`. This is where you can get very specific about which elements you want, such as getting all elements whose parameter meets a certain condition.
- These are often complex to construct but perform faster than the alternative LINQ methods.
	- Custom Filters are considered best-practice to build scalable applications rather than LINQ.
- Here is an example of 5 steps involved constructing a rule to provide to a `WherePasses()` filter:
```C#
var parameterId  = new ElementId(BuiltInParameter);
var provider     = new ParameterValueProvider(parameterId);
var rule         = new FilterNumericLess();
var passesRule   = new FilterDoubleRule(provider, rule, tolerance);
var paramFilter  = new ElementParameterFilter(passesRule);
```

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


---
# [Quick, Slow and LINQ Element Filtering](https://thebuildingcoder.typepad.com/blog/2015/12/quick-slow-and-linq-element-filtering.html)

## Introduction

When working with the Revit API, efficient element filtering is crucial for performance. Understanding the differences between quick filters, slow filters, and LINQ approaches can mean the difference between a tool that runs in milliseconds versus one that takes several seconds to minutes, if not hours. This comprehensive guide explores these filtering methods, their performance characteristics, and best practices for optimal results.

## The Performance Hierarchy: Critical for Understanding

Based on extensive benchmarking by Jeremy Tammik (The Building Coder) and other Revit API developers, there's a clear performance hierarchy you must understand:

**The Golden Rule:** _Revit's `built-in` filters are at least twice as fast as LINQ-based filtering._

### Performance Rankings from Real Benchmarks

From actual performance tests on retrieving specific elements:

```C#
Quick Filters: Baseline performance (100%)
Slow Filters: ~116% of quick filter time (still very efficient)
LINQ Queries: ~128-153% of quick filter time
Manual .NET Iteration: ~153%+ of quick filter time
```

## Understanding Revit's Data Architecture

To grasp why these performance differences exist, you need to understand how Revit stores element data:

### Element Storage Structure

Revit divides element storage into two parts:

1. **Element Header (Record)**: Contains minimal information
    - `Element ID`
    - `Name`
    - `Category ID`
    - `Type ID`
    - `Basic properties` accessible without loading full element

2. **Element Body**: Contains complete element data
    - `Geometry`
    - `Parameters`
    - `Detailed properties`
    - `Relationships`

This architecture explains why quick filters are so fast—they operate only on the `header data` that's always in memory, while slow filters may need to load the complete element information.

## **Why quick filters matter**


Revit stores only a small “header” for each element in memory until more details are needed.  A **quick filter** can test an element using this header, so Revit can decide whether the element passes without loading the full element data.  This makes quick filters very efficient.  In contrast, **slow filters** need the full element, so Revit must load and “expand” each element first.

  

When you use .NET or LINQ to filter, you force Revit to marshal each element’s data into managed memory, so every element is fully expanded before your query runs.  Even if the filter is simple, this marshalling is expensive and can double the execution time.  Benchmarking on the Building Coder blog showed that explicit iteration or LINQ is **over a thousand times slower** than built‑in collector filtering.

  

### **Efficiency guidelines**

- **Use quick filters first.**  Because they operate on element headers, quick filters can discard most elements immediately .
    
- **Apply slow filters next.**  Use them only when necessary to narrow the set further .
    
- **Avoid .NET/LINQ until the end.**  Only when no built‑in filter can express the condition should you post‑process the results using LINQ .
    

  

## **Built‑in filter types**

  

### **Logical filters**

  

Logical filters let you combine other filters:

| **Filter**           | **Description**                                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LogicalAndFilter** | Combines two or more filters; an element must pass all of them.  You can also call `WherePasses` on the collector to add another filter or `IntersectWith` to intersect two independent collector results . |
| **LogicalOrFilter**  | Combines filters so an element only needs to pass one of them.  You can use `UnionWith` on two collectors to achieve the same result .                                                                      |
### **Quick filters**

Quick filters use the element header and therefore have corresponding “shortcut” methods on FilteredElementCollector.  Using the shortcut makes it obvious you are applying a quick filter.  For example, OfClass(typeof(Wall)) calls an ElementClassFilter internally.  The table below summarizes common quick filters .

| **Filter class**                 | **Shortcut**                                                 |
| -------------------------------- | ------------------------------------------------------------ |
| `ElementCategoryFilter`          | `OfCategoryId`                                               |
| `ElementClassFilter`             | `OfClass`                                                    |
| `ElementIsElementTypeFilter`     | `WhereElementIsElementType` / `WhereElementIsNotElementType` |
| `ElementOwnerViewFilter`         | `OwnedByView` / `WhereElementIsViewIndependent`              |
| `ElementDesignOptionFilter`      | `ContainedInDesignOption`                                    |
| `ElementIsCurveDrivenFilter`     | `WhereElementIsCurveDriven`                                  |
| `ElementStructuralTypeFilter`    | —                                                            |
| `FamilySymbolFilter`             | —                                                            |
| `ExclusionFilter`                | `Excluding`                                                  |
| `BoundingBoxIntersectsFilter`    | —                                                            |
| `BoundingBoxIsInsideFilter`      | —                                                            |
| `BoundingBoxContainsPointFilter` | —                                                            |

### **Slow filters**

Slow filters have no shortcut because they need to load each element.  They are still implemented in native code and therefore faster than `.NET` post‑processing, but you should try to reduce their use by narrowing the collector first with quick filters.  

Common slow filters include:

| Class                                                                | Description                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `FamilyInstanceFilter`                                               | Returns instances of a specific family symbol.                                       |
| `ElementLevelFilter`                                                 | Elements associated with a given level ID.                                           |
| ElementParameterFilter                                               | Tests whether an element has a parameter or matches a value/range.                   |
| PrimaryDesignOptionMemberFilter                                      | Returns elements belonging to the primary design option.                             |
| StructuralInstanceUsageFilter                                        | Filters family instances by structural usage.                                        |
| StructuralWallUsageFilter                                            | Filters walls by structural usage.                                                   |
| StructuralMaterialTypeFilter                                         | Filters walls by structural usage.                                                   |
| `RoomFilter`, <br>`SpaceFilter`, <br>`AreaFilter`, <br>`tag` filters | Finds rooms, spaces or areas and their tags.                                         |
| CurveElementFilter                                                   | Filters specific curve elements (model curves, detail lines, symbolic curves, etc.). |

## **`LINQ` and `.NET` post‑processing**


`LINQ` queries or explicit loops over the `FilteredElementCollector` run in managed code.  When you use them, Revit has already marshalled each element from its internal database into your add‑in’s memory.  This marshalling costs far more than the filtering itself.  In the original benchmark, Jeremy Tammik measured several ways of retrieving levels.  The results showed that converting the collector results to a generic list (`ToList`) or using `LINQ` produced **thousands of times more overhead** than simply applying Revit filters.  There was hardly any difference between writing a manual `foreach` loop and using a `LINQ` query—both were similarly `slow` compared with a native filter.

### However, `LINQ` makes collecting and filtering elements much easier than `SlowFilters`
- J.Tamik estimated them to be twice as slow, however, Gavin Crump rarely noticed their impact on performance.
- `LINQ` is provided through the System library and are not specific to the RevitAPI. Look at them like a quick iterations across all items in a list.

## `Lambda` Function
- The `Lambda` shorthand is crucial to understand.
- `Lambda` function acts as a `throwaway` function that is evaluated, then disposed of.
- The `=>` symbols are used to imply a `lambda` function, where the left side is the variable to evaluate upon and the right side is the function to evaluate the outcome.

```C#
Variable => Function;
```

`FilteredELementCollector` vs System `LINQ`
- When using LINQ methods with a filtered element collector, you should use all required `Revit API` methods before switching over to using LINQ Methods.

**Common pattern to follow:**
1. Make a `FilteredElementCollector`
2. Filter by `.OfClass` or `.OfCategory`
3. Switch to `LINQ` Method

### `ToList()`
- When dealing with a `FilteredElementCollectors`, generally you would finish the collector in the Revit API with a closer such as `ToElement()`, which would return an `IList` of Elements.
- We finish a chain of LINQ methods in most cases by using the `ToList()` method.

### `Cast<type>()`
- When we `Cast` in C# - we are changing the `type` of an `object`. 
- This is very important when dealing with the `Element` class, as many things may `inherit` from it.

**For example:** 
- if we collect all sheets in the model, they are still `Element` type.
- If we wanted to ask for a property unique to the `ViewSheet` class (e.g. `SheetNumber`), we would need to `Cast` those `Elements` to `ViewSheet` first.

>>When you work with the `FilteredElementCollector` you are using `Elements` by default, if we wanted to switch over to `Sheets` after collecting `Sheets`, the `FiliteredElementCollector` won't give you back `objects` of the `Sheet` Type, so you have to actually `Cast` the `Object` to the `Sheet` type when you are ready to deal with it as `Sheets`

### `Distinct()`
- If we have a list of objects where we know there may be duplicates that we don't want, we can add this method to remove all duplicate objects.
- For example,
	- maybe we want to know all `values` of a given parameter for a nominated class,
	- we do not need to know every occurrence of of duplicate values, just that they have occurred,
		- so we can make it `distinct` before finishing our `list`.

### `Select(x => function)`
- The `select()` method will evaluate a `lambda`function for all objects in the current list we are working with,
- Note that this may change the type of object being stored in the list,
- For example,
	- if we get the parameter values of elements,
	- we will no longer be dealing with those elements.

### `OrderBy(x => function)`
- Typically, elements are returned to us by collectors in the order by which they were originally added to the Revit Document (DB).
- If we want to reorder them, we can use a lambda function that yields a sortable outcome (typically, must be numeric or alphanumeric in nature). 
- The original elements will be kept, but now in a sorted order.

### `Where(x => function)`
- This is effectively the `LINQ` equivalent to WherePasses(),
- The `lambda` function must evaluate to a true or false outcome,
	- where all elements that evaluate as false will be filtered out of the available elements provided before.
- An example of this being used is:
	- omitting all placeholder `sheets` when collecting `Sheets`.

>> Equivalent to `List.FiltByBoolMask` Node in Dynamo.

## Example №1: Comparing `Quick` and `Slow` Methods
### Method Chaining for `Quick` + `LINQ` Style 
```C#
var sheets = new FilteredElementCollector(doc)
			.OfClass(typeof(ViewSheet))
			.Cast<ViewSheet>()
			.Where(s=>s.IsPlaceholder==false) // Where the sheet is not a placeholder
			.OrderBy(s=>s.SheetNumber) // Order based on Sheet Number
			.ToList(); // Cast them into a list
```
- **Execution:** Runs mostly in .NET after elements are marshalled from Revit.
- **Strength:** Very concise and readable.
- **Weakness:** Potentially slower for large datasets since all elements come into memory first.

**VS.**

### `Slow` `WherePasses()` Method
```C#
// Build a parameter rule: IsPlaceholder == 0 (false)
var rule = ParameterFilterRuleFactory.CreateEqualsRule(
    new ElementId(BuiltInParameter.VIEWER_SHEET_IS_PLACEHOLDER), 0);
var notPlaceholderFilter = new ElementParameterFilter(rule);

var sheets = new FilteredElementCollector(doc)
    .OfClass(typeof(ViewSheet))
    .WherePasses(notPlaceholderFilter)         // Revit-side filter
    .Cast<ViewSheet>()
    .OrderBy(s => s.SheetNumber)               // .NET-side sort
    .ToList();
```
- **Execution:** Filtering happens inside Revit’s engine before elements are marshalled.
- **Strength:** More scalable for large datasets, avoids bringing all elements into .NET first.
- **Weakness:** More verbose; less intuitive to read/write than LINQ.

## Example №2: Comparing `Quick` and `Slow` Methods

### Method Chaining for `Quick` + `LINQ` Style 
```C#
var shortWalls = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Walls)
    .WhereElementIsNotElementType()
    .Cast<Wall>()
    .Where(w =>
    {
        var p = w.get_Parameter(BuiltInParameter.WALL_USER_HEIGHT_PARAM);
        return p != null && p.StorageType == StorageType.Double && p.AsDouble() < 12.0;
    })                                         // .NET-side filter
    .ToList();

TaskDialog.Show(doc.Title, $"We have {shortWalls.Count} walls < 12 ft.");
```


**VS.**

### `Slow` `WherePasses()` Method
```C#
var parameterId = new ElementId(BuiltInParameter.WALL_USER_HEIGHT_PARAM);
var heightRule = ParameterFilterRuleFactory.CreateLessRule(parameterId, 12.0, 0.1);
var heightFilter = new ElementParameterFilter(heightRule);

var shortWalls = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Walls)
    .WhereElementIsNotElementType()
    .WherePasses(heightFilter)                 // Revit-side filter
    .ToElements();

TaskDialog.Show(doc.Title, $"We have {shortWalls.Count} walls < 12 ft.");
```

> **TL;DR:** use `WherePasses()` when filtering by parameters on big sets (faster); use `LINQ` for quick scripts or when the set is already small. Sorting generally happens in `LINQ` after you’ve done the heavy lifting with native filters.
## **Parameter filters vs. LINQ when filtering by property values**

A common case is filtering by a parameter value (e.g., family name).  Developers often write a LINQ query like:

```C#
var result = collect
  .OfClass(typeof(FamilyInstance))
  .Where(x => x.get_Parameter(BuiltInParameter.ELEM_FAMILY_PARAM)
               .AsValueString() == sectionName);
```

> Although this works, the query runs in .NET, so Revit marshals every `FamilyInstance` into memory first.  Jeremy Tammik points out that this is **even slower than a slow filter**.  Instead, you can turn the LINQ query into a parameter filter and let Revit perform the comparison natively.  Implementing a parameter filter requires creating a `ParameterValueProvider`, a `FilterRule` (e.g., `FilterStringRule` or using `ParameterFilterRuleFactory.CreateEqualsRule`) and then applying an `ElementParameterFilter`.

  

The 2019 article [**Slow, Slower Still and Faster Filtering**](https://thebuildingcoder.typepad.com/blog/2019/04/slow-slower-still-and-faster-filtering.html) shows how to implement this.  It provides two LINQ examples and two parameter filter examples for retrieving a family symbol by name; 
- The parameter filter versions avoid marshalling and are an order of magnitude faster.  
- The lesson is: when filtering on parameter values, **always try to use `ElementParameterFilter` instead of `LINQ`**.



## **Collector optimization tips**



Jeremy Tammik also provides general optimization tips in his [FindElement and Collector Optimisation post](https://thebuildingcoder.typepad.com/blog/2012/09/findelement-and-collector-optimisation.html).  Key points include:

- **Avoid language‑dependent names.**  Wherever possible, identify elements by `ID`, `category` or `type` rather than name .
    
- **Use parameter filters instead of LINQ.**  Replacing a LINQ query with a `parameter filter` often **halves execution time** because marshalling to .NET is eliminated .
    
- **Avoid unnecessary conversions.**  A `FilteredElementCollector` already implements `IEnumerable<Element>`, so there is usually no need to convert it to `IEnumerable` or `IList<Element>` .  Instantiating additional lists duplicates data and slows performance.
    
- **Use the collector’s built‑in filters for categories and classes.**  For example, to find door family symbols you can chain: 
	- `.OfCategory(BuiltInCategory.OST_Doors).OfClass(typeof(FamilySymbol)) `
	- and then iterate over the collector directly. This is shorter and faster than iterating over all family symbols and checking their category names.

```C#
// Get all Door family symbols directly
FilteredElementCollector collector = new FilteredElementCollector(doc)
	    .OfCategory(BuiltInCategory.OST_Doors)
	    .OfClass(typeof(FamilySymbol));

foreach (FamilySymbol doorSymbol in collector)
{
    // Do something with each door symbol
    TaskDialog.Show("Door Symbol", doorSymbol.Name);
}
```

### **Why this is better**

- **Shorter:** No need to fetch all family symbols first and then check their categories manually.
    
- **Faster:** Filtering happens natively inside Revit before elements are wrapped into .NET objects, so you avoid the overhead of LINQ or extra if conditions in C#.



If you wanted to collect **instances** instead of symbols, you’d just swap FamilySymbol for FamilyInstance in the loop:

```C#
foreach (FamilyInstance doorInstance in collector)
{
    // Work with each door instance
}
```


---

### **1) Fast (native filters, iterate collector directly)**

```C#
// Fast: everything done natively inside Revit before .NET sees it
var symbols = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .OfClass(typeof(FamilySymbol));

foreach (FamilySymbol sym in symbols)
{
    // use sym
}
```

### **2) Fast (native + parameter filter for a specific name)**

```C#
// Fast and precise: still native, avoids LINQ post-processing
var doorName = "Single-Flush";
var byName = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .OfClass(typeof(FamilySymbol))
    .WherePasses(
        new ElementParameterFilter(
            ParameterFilterRuleFactory.CreateEqualsRule(
                new ElementId(BuiltInParameter.SYMBOL_NAME_PARAM),
                doorName, /* caseSensitive */ true)));

foreach (FamilySymbol sym in byName)
{
    // use sym
}
```

### **3) Slower (native filter + LINQ post-processing)**

```C#
// Slower: brings elements into .NET and then filters with LINQ
var withLinq = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .OfClass(typeof(FamilySymbol))
    .Where(x => x.Name == "Single-Flush"); // LINQ post-filter

foreach (FamilySymbol sym in withLinq)
{
    // use sym
}
```

### **4) Slowest (no native category filter, LINQ checks everything)**

```C#
// Slowest: iterates all symbols, checks category/name in managed code
var allSymbols = new FilteredElementCollector(doc)
    .OfClass(typeof(FamilySymbol));

foreach (FamilySymbol sym in allSymbols)
{
    var cat = sym.Category;
    if (cat != null && cat.Id.IntegerValue == (int)BuiltInCategory.OST_Doors
        && sym.Name == "Single-Flush")
    {
        // use sym
    }
}
```


## **Why #1 and #2 win**

- Revit filters run in native code and trim the search set **before** elements are marshalled into .NET.
- LINQ (and manual if checks) happen after marshaling—extra overhead you don’t want unless you must.


---

## **Quick micro-benchmark scaffolding (optional for demos)**

```C#
using System.Diagnostics;

static TimeSpan TimeIt(Action action)
{
    var sw = Stopwatch.StartNew();
    action();
    sw.Stop();
    return sw.Elapsed;
}

// Example use:
var tFast = TimeIt(() =>
{
    foreach (FamilySymbol _ in new FilteredElementCollector(doc)
        .OfCategory(BuiltInCategory.OST_Doors)
        .OfClass(typeof(FamilySymbol))) { }
});

var tLinq = TimeIt(() =>
{
    foreach (FamilySymbol _ in new FilteredElementCollector(doc)
        .OfCategory(BuiltInCategory.OST_Doors)
        .OfClass(typeof(FamilySymbol))
        .Where(x => x.Name == "Single-Flush")) { }
});

// Show results
TaskDialog.Show("Timing",
    $"Native: {tFast.TotalMilliseconds:F1} ms\nLINQ: {tLinq.TotalMilliseconds:F1} ms");
```

---

## **Practical tips**

- Prefer `.WherePasses(new ElementParameterFilter(...))` to check parameter values; avoid `AsValueString()` for comparisons—use `AsString()` (for text) or typed getters (`AsInteger()`, etc.).
    
- Chain **quick** filters first (`OfCategory`, `OfClass`, `WhereElementIsNotElementType`).
    
- Add **slow** filters only when needed (e.g., `ElementParameterFilter`, `ElementLevelFilter`).
    
- Iterate the collector directly; don’t call `.ToElements()` / `.ToList()` unless you truly need a materialized list.
    
- If you’ll delete/modify elements found, capture `IDs` first and dispose the collector:
    

```C#
var ids = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_Doors)
    .ToElementIds();
// collector eligible for GC now; safe to delete in a loop over ids
```
  

Following these guidelines will yield dramatic performance improvements when writing Revit add‑ins.  Even though the original blog post dates from 2015, later posts and benchmarks confirm that using Revit’s native filtering API—quick or slow—always beats LINQ or explicit iteration in both simplicity and speed.  By designing your search around built‑in filters and using parameter filters for value comparisons, you can make your tools scale to very large projects.

---

# Collector methods and Extensions
- When developing common collectors that you will use in many commands or just generally, you should develop `methods` that can be called-on versus writing the full collector each time.
- Given collectors always begin from a `Document`, is also makes sense to develop these methods as `Extension Methods` for the `Document` class versus containing them in a `static` class.

---

# Overloading Methods (Polymorphism)
- We can also provide multiple argument structures for methods with the same name:
```C#
doc.Ext_Collector();     // Which provides FilteredElementCollector()
doc.Ext_Collector(view); // Which provides another collector that we built
```
- Can co-exist side-by-side as extension methods.

---


# Homework №1

- Create a basic wall collector
- Create a `WherePasses()` condition
- Test your code 

# Solution

## `Project Solution`
```bash
Solution
|-> guRoo
	|-> Dependencies
	|-> Commands
		|-> General 
			|-> Cmds_PushButton.cs  # Rename & Update
			|-> Cmds_PullDown.cs  
			|-> Cmds_Stack1.cs 
			|-> Cmds_Stack2.cs 
			|-> Cmds_Stack3.cs 
	|-> Forms
	|-> General 
	|-> Extensions 
	|-> Resources
	|-> Utilities
	|-> Application.cs           
	|-> guRoo.addin
```

## `Cmds_PushButton.cs`
```C#
// Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;

// Associate with PushButton Commands
namespace guRoo.Cmds_Button
{
    /// <summary>
    ///		Example Command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_Test : IExternalCommand
    {
        public Result Execute(ExternalCommandData CommandData, ref string message, ElementSet elements)
        {
            // Collect the Document and Application objects from the CommandData
            var uiApp = CommandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Collect all walls
            var walls = new FilteredElementCollector(doc)
                .OfClass(typeof(Wall))
                .WhereElementIsNotElementType()
                .ToElements();

            // Show the message dialog with the document title
            TaskDialog.Show( doc.Title, $"We have {walls.Count} walls in the model");

            // Collect all walls lower than 12 feet
            // First: Construct a filter for .WherePasses() Method
            var parameterId = new ElementId(BuiltInParameter.WALL_USER_HEIGHT_PARAM);
            var provider = new ParameterValueProvider(parameterId);
            var rule = new FilterNumericLess();
            var passesRule = new FilterDoubleRule(provider, rule, 12, 0.1);
            var paramFilter = new ElementParameterFilter(passesRule);

            // Then: Apply the filter to the FilteredElementCollector
            var wallsFiltered = new FilteredElementCollector(doc)
                .OfCategory(BuiltInCategory.OST_Walls)
                .WhereElementIsNotElementType()
                .WherePasses(paramFilter)
                .ToElements();

            // Show the message dialog with the document title
            TaskDialog.Show(doc.Title, $"We have {wallsFiltered.Count} walls less than 12 feet in the model");



            // Final return here:
            return Result.Succeeded;
        }
    }
}
```


# Homework №2

- Create a `Document` extension class
- Create basic `collector` method
- Create a `sheet` collector
- Cerate a `revision` collector

# Solution


## `Project Solution`
```bash
Solution
|-> guRoo
	|-> Dependencies
	|-> Commands
		|-> General 
			|-> Cmds_PushButton.cs  # Update to implement new ext .cs 
	|-> Forms
	|-> General 
	|-> Extensions 
		|-> Document_Ext.cs # Create a new extension class 
	|-> Resources
	|-> Utilities
	|-> Application.cs           
	|-> guRoo.addin
```


## `Document_Ext.cs`
```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guRoo.Extensions
{
	public static class Document_Ext
	{
		/// <summary>
		/// 
		/// </summary>
		/// <param name="doc"></param>
		/// <return></return>
		public static FilteredElementCollector Ext_Collector(this Document doc)
		{
			return new FilteredElementCollector(doc);
		}
		/// <summary>
		/// Construct a new FilteredElementCollector
		/// </summary>
		/// <param name="doc">The document (extended)</param>
		/// <param name="view">The view to collect elements from</param>
		/// <return></return>
		public static FilteredElementCollector Ext_Collector(this Document doc, View view)
		{
			return new FilteredElementCollector(doc, view.Id);
		}

		/// <summary>
		/// Collecting sheets
		/// </summary>
		/// <param name="doc"></param>
		/// <param name="sorted"></param>
		/// <param name="includePlaceholders"></param>
		/// <return></return>
		public static List<ViewSheet> Ext_GetSheets(this Document doc, bool sorted true, bool includePlaceholder = false)
		{
			// Collect our sheets
			var sheets = doc.Ext_Collector()
				.OfClass(typeof(ViewSheet))
				.Cast<ViewSheet>()
				.ToList();
			
			// Fileter out placeholders if desired
			if (!includePlaceholders)
			{
				sheets = sheets
					.Where(s => !s.IsPlaceholder) // is the sheet is placeholder, reverse it (if the sheet is not a placeholder, the lambda would return "true". and non-placeholder sheets would "continue" forward)
					.ToList();
			}
			
			// Return elements, optional sorting
			if (sorted)
			{
				return sheets
					.OrderBy(s => s.SheetNumber)
					.ToList();
			}
			else
			{
				return sheets;
			}
		}

		
		/// <summary>
		/// Collecting revisions
		/// </summary>
		/// <param name="doc"></param>
		/// <param name="sorted"></param>
		/// <param name="includePlaceholders"></param>
		/// <return></return>
		public static List<Revisions> Ext_GetRevisions(this Document doc, bool sorted true)
		{
			// Collect our revisions
			var revisions = doc.Ext_Collector()
				.OfClass(typeof(Revision))
				.Cast<Revision>()
				.ToList();
			
			// Return elements, optional sorting
			if (sorted)
			{
				return revisions
					.OrderBy(r => r.SequenceNumber) // this is an element property that's accessible through Casting only, if we didn't Cast<Revision> earlier we wouldn't have access to Revision propeties.
					.ToList();
			}
			else
			{
				return revisions;
			}
		}
		
	}
}
```

## `Cmds_Button.cs`
```C#
// Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;

// Associate with PushButton Commands
namespace guRoo.Cmds_Button
{
    /// <summary>
    ///		Example Command
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_Test : IExternalCommand
    {
        public Result Execute(ExternalCommandData CommandData, ref string message, ElementSet elements)
        {
            // Collect the Document and Application objects from the CommandData
            var uiApp = CommandData.Application;
            var uiDoc = uiApp.ActiveUIDocument;
            var doc = uiDoc.Document;

            // Collect all walls
            var walls = new FilteredElementCollector(doc)
                .OfClass(typeof(Wall))
                .WhereElementIsNotElementType()
                .ToElements();

            // Show the message dialog with the document title
            TaskDialog.Show( doc.Title, $"We have {walls.Count} walls in the model");

            // Collect all walls lower than 12 feet
            // First: Construct a filter for .WherePasses() Method
            var parameterId = new ElementId(BuiltInParameter.WALL_USER_HEIGHT_PARAM);
            var provider = new ParameterValueProvider(parameterId);
            var rule = new FilterNumericLess();
            var passesRule = new FilterDoubleRule(provider, rule, 12, 0.1);
            var paramFilter = new ElementParameterFilter(passesRule);

            // Then: Apply the filter to the FilteredElementCollector
            var wallsFiltered = new FilteredElementCollector(doc)
                .OfCategory(BuiltInCategory.OST_Walls)
                .WhereElementIsNotElementType()
                .WherePasses(paramFilter)
                .ToElements();

            // Show the message dialog with the document title
            TaskDialog.Show(doc.Title, $"We have {wallsFiltered.Count} walls less than 12 ft in the model");

			// Collect all sheets
			var sheets = doc.Ext_GetSheets(); 
			// declare an argument if you need "(includePlaceholders: true)"
			var revisions = doc.Ext_GetRevisions(); 
			
			TaskDialog,Show(doc.Title, $"We have {sheets.Count} sheets in the model");)
			
			TaskDialog,Show(doc.Title, $"We have {revisions.Count} revisions in the model");)



            // Final return here:
            return Result.Succeeded;
        }
    }
}
```




> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.