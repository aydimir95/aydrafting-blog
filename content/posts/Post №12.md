+++
title = "C# + Revit API: Lesson 12 - FilteredElementCollector"
date = 2025-08-15T10:37:24+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++

# Goal

- In most Revit add-ins, your first step will be to **collect elements from the model**.
- The go-to tool for this is the `FilteredElementCollector`, which lets you gather elements and then refine your selection using a variety of filtering techniques in C#.

> Next, we’ll explore another approach that’s specific to C#: using the `System.Linq` methods to filter and query elements.

---

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

# Method Chaining
- Like `Python` -- C# also supports chaining of multiple methods in succession.
- The `;` symbol is the key to closing a line of code, line beaks do not matter, generally.

```C#
object.Method().Method().Method();
```

