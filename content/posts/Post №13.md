+++
title = "C# + Revit API: Lesson 13 - Case Study №1 [Section Automation]"
date = 2025-08-16T19:10:51+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++

# Introduction

This is the automation I made for my client and I would like to share the insights.

## Plan:
1. Refactor the automation to properly organize the project.
2. Start with understanding how to organize the WPF forms better.
3. Seems like I have lots of functions just jumbled together in each file.
4. Basically, separate and refactor the code.


```C#
Based on analyzing the current "Cmds_AutoDim.cs" implementation and comparing it with the established codebase patterns, here are my refactoring suggestions:  
  
Key Refactoring Recommendations  

1. Namespace Inconsistency  

Current: namespace DimensionAutomation  
Suggested: namespace UKON.Commands.General  
	- Follow the established pattern from other command files in the same directory  

2. Class Naming Convention  

Current: public class DimensionAutomation  
Suggested: public class Cmd_AutoDim  
	- Match the naming pattern used throughout the codebase (e.g., Cmd_Test, Cmd_1Button)  

3. Variable Naming Consistency  

Current: UIApplication uiapp = commandData.Application;  
Suggested: var uiApp = commandData.Application;  
	- Follow the camelCase pattern used in other files (uiApp, uiDoc, not uiapp, uidoc)  

4. Comments Structure  

Current: Uses // only elements actually visible in this view  
Suggested: Add proper method-level XML documentation comments like other files:  
/// <summary>  
/// Auto-dimensioning command for section views  
/// </summary>  

5. File Organization  

Current: Single complex class with multiple private methods  
Suggested: Consider splitting into:  
	- Main command class (Cmd_AutoDim)  
	- Separate service/helper classes for dimension logic  
	- This follows the single responsibility principle  

6. Error Handling Pattern  

Current: Generic try-catch with Russian error messages  
Suggested:  
	- Use consistent error message language (English like other files)  
	- Follow the established error handling pattern from other commands  

7. External Dependencies  

Current: References DimensionAutomation.UI namespace  
Suggested: Ensure UI classes follow the project's namespace structure (UKON.UI or similar)  

8. Transaction Naming  

Current: "Создание маркеров и размерений" (Russian)  
Suggested: Use English transaction names for consistency  

9. Method Extraction Opportunities  

The Execute method is quite long. Consider extracting:  
	- User input validation logic  
	- Section processing setup  
	- Error message display logic  

10. Constants Organization  

Current: MIN_CURVE_LENGTH defined in class  
Suggested: Consider a constants class or configuration file for project-wide constants  

The current implementation is functional but doesn't follow the established architectural patterns of the UKON  
project. The main issues are namespace inconsistency, naming conventions, and language mixing.
```


# Old Code

## `Project Solution`
```bash
Solution
|-> ViewOnSheets2025
	|-> Dependencies
	|-> Properties
	|-> Commands
		|-> AutoLevelMarker.cs 
		|-> DimensionAutomation.cs  
		|-> RevitSectionCreator.cs 
		|-> SpotDimensionAutomation.cs 
		|-> ViewsOnSheets.cs 
	|-> Globals 
		|-> ElementTypeInfo.cs
		|-> ParameterUtilities.cs
		|-> PointOnElement.cs
	|-> Resources
		|-> Icons
	|-> Services
		|-> ViewsOnSheetsR2025Service.cs
	|-> UI
		|-> AutoLevelMarker.xaml
		|-> DimensionAutomationWindow.xaml
		|-> RevitSectionsCreatorWindow.xaml
		|-> ViewOnSheetsR2025Windown.xaml
	|-> Application.cs           
	|-> guRoo.addin
```




---



### `RevitSectionCreator.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using RevitSectionCreator.UI;

namespace RevitSectionCreator
{
    [Transaction(TransactionMode.Manual)]
    public class Command : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            UIApplication uiapp = commandData.Application;
            UIDocument uidoc = uiapp.ActiveUIDocument;
            Document doc = uidoc.Document;

            try
            {
                // STEP 1: Collect element types for section creation.
                List<ElementTypeInfo> elementTypes = new List<ElementTypeInfo>();

                // Collect FamilyInstance elements and group them by the family name.
                var familyInstances = new FilteredElementCollector(doc)
                    .OfClass(typeof(FamilyInstance))
                    .Cast<FamilyInstance>()
                    .ToList();

                var familyGroups = familyInstances
                    .GroupBy(fi => fi.Symbol.FamilyName)
                    .Select(g => new ElementTypeInfo
                    {
                        TypeName = g.Key,
                        Category = "Семейство", // "Family" in Russian
                        ElementIds = g.Select(fi => fi.Id).ToList()
                    })
                    .ToList();
                elementTypes.AddRange(familyGroups);

                // Collect DirectShape elements.
                var directShapes = new FilteredElementCollector(doc)
                    .OfClass(typeof(DirectShape))
                    .Cast<DirectShape>()
                    .ToList();

                var directShapeGroups = directShapes
                    .GroupBy(ds => ds.Category?.Name ?? "Без категории")
                    .Select(g => new ElementTypeInfo
                    {
                        TypeName = $"DirectShape - {g.Key}",
                        Category = "DirectShape",
                        ElementIds = g.Select(ds => ds.Id).ToList()
                    })
                    .ToList();
                elementTypes.AddRange(directShapeGroups);

                // Collect ImportInstance elements (excluding links).
                var importInstances = new FilteredElementCollector(doc)
                    .OfClass(typeof(ImportInstance))
                    .Cast<ImportInstance>()
                    .Where(ii => !ii.IsLinked)
                    .ToList();

                var importGroups = importInstances
                    .GroupBy(ii => ii.Category?.Name ?? "Без категории импорта")
                    .Select(g => new ElementTypeInfo
                    {
                        TypeName = $"Import - {g.Key}",
                        Category = "Import",
                        ElementIds = g.Select(ii => ii.Id).ToList()
                    })
                    .ToList();
                elementTypes.AddRange(importGroups);

                if (elementTypes.Count == 0)
                {
                    TaskDialog.Show("Ошибка", "В документе не найдено подходящих элементов.");
                    return Result.Failed;
                }

                // Sort the element types by category then by type name.
                elementTypes = elementTypes
                    .OrderBy(et => et.Category)
                    .ThenBy(et => et.TypeName)
                    .ToList();

                // STEP 2: Display the unified WPF window to get user choices.
                RevitSectionCreatorWindow sectionWindow = new RevitSectionCreatorWindow(elementTypes);
                if (sectionWindow.ShowDialog() != true)
                {
                    return Result.Cancelled;
                }

                // Retrieve selections from the combined window.
                ElementTypeInfo selectedType = sectionWindow.SelectedElementType;
                string selectedFace = sectionWindow.SelectedFace; // e.g., "Левая грань"
                double offsetMm = sectionWindow.OffsetValue;

                // STEP 3: Create section views.
                using (Transaction t = new Transaction(doc, $"Создание разрезов для {selectedType.TypeName}"))
                {
                    t.Start();

                    // Get the Section ViewFamilyType.
                    using ViewFamilyType sectionType = new FilteredElementCollector(doc)
                        .OfClass(typeof(ViewFamilyType))
                        .Cast<ViewFamilyType>()
                        .FirstOrDefault(vt => vt.ViewFamily == ViewFamily.Section);

                    if (sectionType == null)
                    {
                        TaskDialog.Show("Ошибка", "Не найден тип семейства для разреза.");
                        return Result.Failed;
                    }

                    // Retrieve the actual elements from the selected type.
                    List<Element> elementsToProcess = new List<Element>();
                    foreach (ElementId id in selectedType.ElementIds)
                    {
                        Element elem = doc.GetElement(id);
                        if (elem != null)
                        {
                            elementsToProcess.Add(elem);
                        }
                    }

                    if (!elementsToProcess.Any())
                    {
                        TaskDialog.Show("Ошибка", $"Элементы типа '{selectedType.TypeName}' не найдены.");
                        return Result.Failed;
                    }

                    // Determine the base direction from the selected face.
                    XYZ baseDirection = GetDirectionFromFace(selectedFace);
                    int sectionCount = 0;

                    foreach (Element element in elementsToProcess)
                    {
                        string elementMark = GetElementMark(element) ?? element.Name;
                        List<ElementId> partIds = new List<ElementId>();

                        // For FamilyInstance elements, try to get associated parts.
                        if (element is FamilyInstance familyInstance)
                        {
                            ICollection<ElementId> associatedParts = PartUtils.GetAssociatedParts(doc, familyInstance.Id, true, true);
                            partIds.AddRange(associatedParts);
                        }

                        // If no associated parts, use the element itself.
                        if (partIds.Count == 0)
                        {
                            partIds.Add(element.Id);
                        }

                        foreach (ElementId partId in partIds)
                        {
                            Element part = doc.GetElement(partId);
                            string partMark = GetElementMark(part) ?? part.Name;

                            // Use the base direction from the unified dialog.
                            XYZ finalDirection = baseDirection;

                            // Find the best-aligned face on the element.
                            Face chosenFace = GetLocalDirectionFace(part, finalDirection);
                            if (chosenFace == null)
                                continue;

                            // Create the section view.
                            ViewSection sectionView = CreateSectionView(doc, sectionType.Id, chosenFace, offsetMm);
                            if (sectionView != null)
                            {
                                try
                                {
                                    // Build a name for the new section view.
                                    string rawPartName = !string.IsNullOrEmpty(partMark) ? partMark : elementMark;
                                    string faceLabel = selectedFace.Replace(" ", ""); // Remove spaces for naming.
                                    string offsetStrForm = (offsetMm % 1 == 0) ? $"{(int)offsetMm}мм" : $"{offsetMm}мм";
                                    string combinedName = $"{rawPartName}_{faceLabel}_{offsetStrForm}";
                                    string uniqueName = GenerateUniqueName(doc, combinedName);
                                    sectionView.Name = uniqueName;

                                    // Apply crop region to the section view.
                                    CreateViewCrop(sectionView, chosenFace);
                                    sectionCount++;
                                }
                                catch (Exception ex)
                                {
                                    TaskDialog.Show("Предупреждение", $"Не удалось задать имя для вида: {ex.Message}");
                                }
                            }
                        }
                    }

                    t.Commit();
                    TaskDialog.Show("Успех", $"Создано {sectionCount} разрезов для {selectedType.TypeName}.");
                }

                return Result.Succeeded;
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return Result.Failed;
            }
        }

        #region Helper Methods

        // Maps Russian face names to direction vectors.
        private XYZ GetDirectionFromFace(string faceName)
        {
            var directionMap = new Dictionary<string, XYZ>
            {
                { "Левая грань", new XYZ(-1, 0, 0) },
                { "Правая грань", new XYZ(1, 0, 0) },
                { "Передняя грань", new XYZ(0, 1, 0) },
                { "Задняя грань", new XYZ(0, -1, 0) },
                { "Верхняя грань", new XYZ(0, 0, 1) },
                { "Нижняя грань", new XYZ(0, 0, -1) }
            };

            if (directionMap.TryGetValue(faceName, out XYZ direction))
            {
                return direction;
            }
            return XYZ.BasisY; // Fallback
        }

        // Retrieves the element's "mark" or returns its name.
        private string GetElementMark(Element element)
        {
            Parameter markParam = element.get_Parameter(BuiltInParameter.ALL_MODEL_MARK);
            if (markParam != null && markParam.HasValue)
            {
                string markValue = markParam.AsString();
                if (!string.IsNullOrEmpty(markValue) && markValue.Contains("Ст."))
                {
                    string numberPart = markValue.Split(new[] { "Ст." }, StringSplitOptions.None)[1].Trim();
                    return $"О_Р_{numberPart}";
                }
                return markValue;
            }
            return null;
        }

        // Generates a unique name for a view by appending additional characters if needed.
        private string GenerateUniqueName(Document doc, string baseName)
        {
            string testName = baseName;
            int counter = 1;
            List<string> existingNames = new FilteredElementCollector(doc)
                .OfClass(typeof(View))
                .Cast<View>()
                .Select(v => v.Name)
                .ToList();

            while (existingNames.Contains(testName))
            {
                counter++;
                testName = baseName + new string('*', counter);
            }
            return testName;
        }

        // Creates a crop boundary (CurveLoop) from a given face.
        private CurveLoop CreateCropBoundary(Face face)
        {
            try
            {
                BoundingBoxUV uvBbox = face.GetBoundingBox();
                List<XYZ> points = new List<XYZ>
                {
                    face.Evaluate(new UV(uvBbox.Min.U, uvBbox.Min.V)),
                    face.Evaluate(new UV(uvBbox.Max.U, uvBbox.Min.V)),
                    face.Evaluate(new UV(uvBbox.Max.U, uvBbox.Max.V)),
                    face.Evaluate(new UV(uvBbox.Min.U, uvBbox.Max.V))
                };

                List<Curve> curves = new List<Curve>();
                for (int i = 0; i < 4; i++)
                {
                    XYZ start = points[i];
                    XYZ end = points[(i + 1) % 4];
                    curves.Add(Line.CreateBound(start, end));
                }
                return CurveLoop.Create(curves);
            }
            catch
            {
                return null;
            }
        }

        // Sets up the crop boundary on a section view.
        private bool CreateViewCrop(ViewSection view, Face face)
        {
            try
            {
                if (!view.CropBoxActive)
                    view.CropBoxActive = true;

                CurveLoop cropLoop = CreateCropBoundary(face);
                if (cropLoop != null)
                {
                    view.GetCropRegionShapeManager().SetCropShape(cropLoop);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        // Determines the face on an element that best aligns with the local direction.
        private Face GetLocalDirectionFace(Element element, XYZ localDir)
        {
            Transform instTransform = Transform.Identity;
            if (element is FamilyInstance familyInstance)
                instTransform = familyInstance.GetTransform();
            else if (element is ImportInstance importInstance && !importInstance.IsLinked)
                instTransform = importInstance.GetTransform();

            Transform invTransform = instTransform.Inverse;
            Face chosenFace = null;
            double bestAlignment = -999;

            Options options = new Options
            {
                ComputeReferences = true,
                DetailLevel = ViewDetailLevel.Fine
            };

            GeometryElement geoElem = element.get_Geometry(options);
            if (geoElem == null)
                return null;

            void ProcessGeometry(GeometryObject geo, Transform transform)
            {
                if (geo is Solid solid && solid.Volume > 0)
                {
                    foreach (Face face in solid.Faces)
                    {
                        XYZ faceNormalWorld = face.ComputeNormal(new UV(0.5, 0.5)).Normalize();
                        XYZ faceNormalLocal = invTransform.OfVector(faceNormalWorld).Normalize();
                        double alignment = faceNormalLocal.DotProduct(localDir);
                        if (alignment > bestAlignment)
                        {
                            bestAlignment = alignment;
                            chosenFace = face;
                        }
                    }
                }
                else if (geo is GeometryInstance instance)
                {
                    Transform instanceTransform = instance.Transform;
                    GeometryElement instGeo = instance.GetInstanceGeometry();
                    if (instGeo != null)
                    {
                        foreach (GeometryObject obj in instGeo)
                        {
                            ProcessGeometry(obj, instanceTransform);
                        }
                    }
                }
            }

            foreach (GeometryObject geo in geoElem)
            {
                ProcessGeometry(geo, Transform.Identity);
            }
            return chosenFace;
        }

        // Creates and returns a section view based on the given face and offset.
        private ViewSection CreateSectionView(Document doc, ElementId sectionTypeId, Face face, double offsetMm)
        {
            try
            {
                // 1. Compute face center in world coords
                BoundingBoxUV uvBbox = face.GetBoundingBox();
                double midU = (uvBbox.Min.U + uvBbox.Max.U) / 2.0;
                double midV = (uvBbox.Min.V + uvBbox.Max.V) / 2.0;
                XYZ faceCenter = face.Evaluate(new UV(midU, midV));

                // 2. Get the outward normal, then invert it for “inward” view direction
                XYZ faceNormalOut = face.ComputeNormal(new UV(midU, midV)).Normalize();
                XYZ inwardNormal = faceNormalOut.Multiply(-1.0);

                // 3. Build the section’s coordinate system
                Transform transFace = Transform.Identity;
                transFace.Origin = faceCenter;
                transFace.BasisZ = inwardNormal; // ← view direction toward element

                // 4. Choose a reasonable X axis for the section
                XYZ basisX = inwardNormal.CrossProduct(XYZ.BasisZ);
                if (basisX.IsAlmostEqualTo(XYZ.Zero))
                    basisX = inwardNormal.CrossProduct(XYZ.BasisX);
                transFace.BasisX = basisX.Normalize();
                transFace.BasisY = transFace.BasisZ.CrossProduct(transFace.BasisX).Normalize();

                // 5. Apply offset *along* the inward normal
                //    Convert mm → ft, then move inward
                double offsetFt = offsetMm / 304.8;
                transFace.Origin = faceCenter.Add(inwardNormal.Multiply(offsetFt));

                // 6. Define the crop box in this new coordinate system
                BoundingBoxXYZ sectionBox = new BoundingBoxXYZ
                {
                    Transform = transFace,
                    Min = new XYZ(-2.5, -50, -0.1),
                    Max = new XYZ(2.5, 50, 0.25)
                };

                // 7. Create and return the section
                return ViewSection.CreateSection(doc, sectionTypeId, sectionBox);
            }
            catch
            {
                return null;
            }
        }

        #endregion
    }
}

```




---




### `DimensionAutomation.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using DimensionAutomation.UI;

namespace DimensionAutomation
{
    [Transaction(TransactionMode.Manual)]
    public class DimensionAutomation : IExternalCommand
    {
        private const double MIN_CURVE_LENGTH = 0.001;

        private XYZ GetVerticalInView(XYZ viewDir)
        {
            XYZ upDir = XYZ.BasisZ;
            XYZ verticalInView = upDir - viewDir.Multiply(upDir.DotProduct(viewDir));
            if (verticalInView.GetLength() < MIN_CURVE_LENGTH)
                return null;
            return verticalInView.Normalize();
        }

        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            UIApplication uiapp = commandData.Application;
            UIDocument uidoc = uiapp.ActiveUIDocument;
            Document doc = uidoc.Document;

            try
            {
                // Show the WPF window to get user choices.
                var window = new DimensionAutomationWindow(doc);
                if (window.ShowDialog() != true)
                    return Result.Cancelled;

                // Gather user selections.
                var selectedSections = window.SelectedSectionViews;
                var selectedFamilyTypes = window.SelectedFamilyTypes;
                var selectedDimType = window.SelectedDimensionType;
                double offsetFeet = window.OffsetValue * 3.28084;

                // Basic checks.
                if (selectedSections == null || !selectedSections.Any())
                {
                    TaskDialog.Show("Информация", "Не выбраны виды разрезов. Операция прервана.");
                    return Result.Cancelled;
                }
                if (selectedFamilyTypes == null || selectedFamilyTypes.Count < 1)
                {
                    TaskDialog.Show("Информация", "Пожалуйста, выберите хотя бы один тип семейства.");
                    return Result.Cancelled;
                }
                if (selectedDimType == null)
                {
                    TaskDialog.Show("Ошибка", "Тип размерения не выбран.");
                    return Result.Failed;
                }

                // Process each section view.
                foreach (ViewSection section in selectedSections)
                {
                    var instancesInSection = new FilteredElementCollector(doc, section.Id)
                        // only elements actually visible in this view
                        .WherePasses(new VisibleInViewFilter(doc, section.Id))
                        .OfClass(typeof(FamilyInstance))
                        .Cast<FamilyInstance>()
                        .Where(fi =>
                            fi.Symbol != null &&
                            selectedFamilyTypes.Any(fs => fs.Id == fi.Symbol.Id)
                        )
                        .ToList();

                    if (instancesInSection.Count < 2)
                        continue;

                    ProcessSectionView(doc, section, selectedDimType, offsetFeet, instancesInSection);
                }

                return Result.Succeeded;
            }
            catch (Exception ex)
            {
                TaskDialog.Show("Ошибка", ex.ToString());
                return Result.Failed;
            }
        }

        private void ProcessSectionView(
            Document doc,
            ViewSection sectionView,
            DimensionType dimType,
            double offsetDist,
            List<FamilyInstance> instances)
        {
            XYZ viewDir = sectionView.ViewDirection.Normalize();
            XYZ verticalInView = GetVerticalInView(viewDir);
            if (verticalInView == null)
            {
                TaskDialog.Show("Предупреждение", "Не удалось определить вертикальное направление в виде. Пропускаем...");
                return;
            }

            // Collect bounding-box centers.
            var centerPoints = new List<XYZ>();
            foreach (var fi in instances)
            {
                var bb = fi.get_BoundingBox(sectionView);
                if (bb != null)
                    centerPoints.Add((bb.Min + bb.Max) * 0.5);
            }
            if (centerPoints.Count < 2)
                return;

            // Sort by vertical location.
            centerPoints = centerPoints.OrderBy(p => p.DotProduct(verticalInView)).ToList();
            var dim3d = centerPoints.Last() - centerPoints.First();
            if (dim3d.GetLength() < MIN_CURVE_LENGTH)
                return;

            // Project onto view plane.
            double dot = dim3d.DotProduct(viewDir);
            var dimPlane = (dim3d - viewDir.Multiply(dot)).Normalize();
            if (dimPlane.GetLength() < MIN_CURVE_LENGTH)
                return;

            // Marker direction perpendicular to dimension direction.
            var refsDir = viewDir.CrossProduct(dimPlane).Normalize();

            using (var tx = new Transaction(doc, "Создание маркеров и размерений"))
            {
                tx.Start();
                var detailLines = CreateDetailLines(doc, sectionView, centerPoints, refsDir, viewDir);
                doc.Regenerate();
                CreateDimensionsBetweenLines(doc, sectionView, detailLines, refsDir, offsetDist, dimType);
                tx.Commit();
            }
        }

        private List<DetailCurve> CreateDetailLines(
            Document doc,
            ViewSection view,
            List<XYZ> centers,
            XYZ dir,
            XYZ viewDir)
        {
            const double markerLen = 0.01;
            double half = markerLen * 0.5;
            var lines = new List<DetailCurve>();

            foreach (var cp in centers)
            {
                var p1 = cp - dir.Multiply(half);
                var p2 = cp + dir.Multiply(half);
                var plane = Plane.CreateByNormalAndOrigin(viewDir, cp);
                SketchPlane.Create(doc, plane);
                var line = Line.CreateBound(p1, p2);
                lines.Add(doc.Create.NewDetailCurve(view, line));
            }
            return lines;
        }

        private void CreateDimensionsBetweenLines(
            Document doc,
            ViewSection view,
            List<DetailCurve> lines,
            XYZ dir,
            double offset,
            DimensionType dimType)
        {
            for (int i = 0; i < lines.Count - 1; i++)
            {
                var a = lines[i].GeometryCurve.Reference;
                var b = lines[i + 1].GeometryCurve.Reference;
                var refs = new ReferenceArray();
                refs.Append(a);
                refs.Append(b);

                var midA = lines[i].GeometryCurve.Evaluate(0.5, true);
                var midB = lines[i + 1].GeometryCurve.Evaluate(0.5, true);

                var offA = midA + dir.Multiply(offset);
                var offB = midB + dir.Multiply(offset);

                var dimLine = Line.CreateBound(offA, offB);

                try
                {
                    var dim = doc.Create.NewDimension(view, dimLine, refs);
                    dim.ChangeTypeId(dimType.Id);
                }
                catch (Exception ex)
                {
                    TaskDialog.Show("Ошибка размерения", ex.Message);
                }
            }
        }
    }
}

```



---



### `SpotDimensionAutomation.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Autodesk.Revit.UI.Selection;

namespace SpotDimensionTest.Commands
{
    [Transaction(TransactionMode.Manual)]
    public class StartupCommand : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            UIDocument uiDoc = commandData.Application.ActiveUIDocument;
            Document doc = uiDoc.Document;

            // STEP 1: Get preselected section views
            ICollection<ElementId> viewSelectionIds = uiDoc.Selection.GetElementIds();
            List<View> sectionViews = new List<View>();

            foreach (ElementId id in viewSelectionIds)
            {
                Element elem = doc.GetElement(id);
                if (elem is View view && view.ViewType == ViewType.Section)
                {
                    sectionViews.Add(view);
                }
            }

            if (sectionViews.Count == 0)
            {
                TaskDialog.Show("Info", "Please preselect section views first.");
                return Result.Succeeded;
            }

            // STEP 2: User selects family instances
            TaskDialog.Show("Selection", "Now select family instances for spot elevations.");
            IList<Reference> familyRefs = uiDoc.Selection.PickObjects(
                ObjectType.Element,
                "Select family instances for spot elevations");

            List<FamilyInstance> familyInstances = new List<FamilyInstance>();
            foreach (Reference famRef in familyRefs)
            {
                Element elem = doc.GetElement(famRef.ElementId);
                if (elem is FamilyInstance fi)
                {
                    familyInstances.Add(fi);
                }
            }

            if (familyInstances.Count == 0)
            {
                TaskDialog.Show("Info", "No family instances selected.");
                return Result.Succeeded;
            }

            // STEP 3: User picks a face on one of the family instances
            Reference pickedFaceRef = uiDoc.Selection.PickObject(
                ObjectType.Face,
                "Select a face for the spot elevation");

            Element templateElem = doc.GetElement(pickedFaceRef.ElementId);
            GeometryObject geoObj = templateElem.GetGeometryObjectFromReference(pickedFaceRef);
            Face templateFace = geoObj as Face;
            XYZ pickedPoint = pickedFaceRef.GlobalPoint;
            XYZ templatePoint = CalculatePointOnFace(templateElem, templateFace, pickedPoint);

            // STEP 4: Create spot elevations on all family instances in all section views
            using (TransactionGroup tg = new TransactionGroup(doc, "Create Multiple Spot Elevations"))
            {
                tg.Start();

                int successCount = 0;

                foreach (View sectionView in sectionViews)
                {
                    using (Transaction trans = new Transaction(doc, $"Spot Elevations in {sectionView.Name}"))
                    {
                        trans.Start();

                        XYZ viewDir = sectionView.ViewDirection.Normalize();
                        XYZ viewUp = sectionView.UpDirection.Normalize();
                        XYZ viewRight = viewUp.CrossProduct(viewDir).Normalize();

                        XYZ originalPickedPoint = pickedPoint;
                        bool viewHasSpotElevation = false;

                        foreach (FamilyInstance fi in familyInstances)
                        {
                            if (viewHasSpotElevation)
                                break;

                            try
                            {
                                Options options = new Options
                                {
                                    View = sectionView,
                                    ComputeReferences = true,
                                    IncludeNonVisibleObjects = false
                                };

                                GeometryElement geometry = fi.get_Geometry(options);
                                if (geometry == null || !geometry.Any())
                                    continue;

                                List<Face> faces = new List<Face>();
                                foreach (GeometryObject geomObj in geometry)
                                {
                                    ExtractFacesFromGeometry(geomObj, faces);
                                }

                                List<Face> sortedFaces = SortFacesByPriority(faces, viewDir);

                                foreach (Face face in sortedFaces)
                                {
                                    try
                                    {
                                        IList<CurveLoop> edgeLoops = face.GetEdgesAsCurveLoops();
                                        if (edgeLoops == null || edgeLoops.Count == 0)
                                            continue;

                                        XYZ elevationPoint = CalculatePointOnFace(fi, face, originalPickedPoint);

                                        try
                                        {
                                            XYZ lineStart = elevationPoint - viewRight * 0.1;
                                            XYZ lineEnd = elevationPoint + viewRight * 0.1;
                                            DetailLine? detailLine = doc.Create.NewDetailCurve(
                                                sectionView,
                                                Line.CreateBound(lineStart, lineEnd)) as DetailLine;

                                            if (detailLine != null)
                                            {
                                                XYZ bendPoint = elevationPoint;
                                                XYZ endPoint = elevationPoint;
                                                Reference lineRef = new Reference(detailLine);
                                                try
                                                {
                                                    SpotDimension spotDimension = doc.Create.NewSpotElevation(
                                                        sectionView,
                                                        lineRef,
                                                        elevationPoint,
                                                        bendPoint,
                                                        endPoint,
                                                        elevationPoint,
                                                        true);

                                                    if (spotDimension != null)
                                                    {
                                                        successCount++;
                                                        viewHasSpotElevation = true;
                                                        break;
                                                    }
                                                    else
                                                    {
                                                        doc.Delete(detailLine.Id);
                                                    }
                                                }
                                                catch (Exception)
                                                {
                                                    doc.Delete(detailLine.Id);
                                                }
                                            }
                                        }
                                        catch (Exception)
                                        {
                                            // Continue to next face
                                        }
                                    }
                                    catch (Exception)
                                    {
                                        // Continue to next face
                                    }

                                    if (viewHasSpotElevation)
                                        break;
                                }
                            }
                            catch (Exception)
                            {
                                // Continue to next family instance
                            }

                            if (viewHasSpotElevation)
                                break;
                        }

                        trans.Commit();
                    }
                }

                tg.Assimilate();

                TaskDialog resultsDialog = new TaskDialog("Spot Elevation Results");
                resultsDialog.MainInstruction = $"Created {successCount} spot elevations";
                resultsDialog.MainContent = $"Successfully created {successCount} spot elevations across {sectionViews.Count} section views.";
                resultsDialog.Show();
            }
            return Result.Succeeded;
        }

        private List<Face> SortFacesByPriority(List<Face> faces, XYZ viewDir)
        {
            List<Tuple<Face, double>> facesWithScores = new List<Tuple<Face, double>>();

            foreach (Face face in faces)
            {
                try
                {
                    BoundingBoxUV bb = face.GetBoundingBox();
                    UV centerUV = new UV((bb.Min.U + bb.Max.U) * 0.5, (bb.Min.V + bb.Max.V) * 0.5);
                    XYZ normal = face.ComputeNormal(centerUV);
                    double dotProduct = Math.Abs(normal.DotProduct(viewDir));
                    double score = dotProduct < 0.3 ? 1.0 : (dotProduct > 0.7 ? 2.0 : 3.0);
                    facesWithScores.Add(Tuple.Create(face, score));
                }
                catch
                {
                    facesWithScores.Add(Tuple.Create(face, 10.0));
                }
            }

            return facesWithScores
                .OrderBy(tuple => tuple.Item2)
                .Select(tuple => tuple.Item1)
                .ToList();
        }

        private void ExtractFacesFromGeometry(GeometryObject geomObj, List<Face> faces)
        {
            if (geomObj is GeometryInstance geomInstance)
            {
                GeometryElement symbolGeometry = geomInstance.GetSymbolGeometry();
                Transform instanceTransform = geomInstance.Transform;
                if (symbolGeometry != null)
                {
                    ExtractSolidsFromGeometry(symbolGeometry, instanceTransform, faces);
                }
                return;
            }

            if (!(geomObj is Solid solid) || solid.Faces.Size == 0)
            {
                return;
            }

            for (int i = 0; i < solid.Faces.Size; i++)
            {
                Face face = solid.Faces.get_Item(i);
                if (face != null && face.Reference != null)
                {
                    faces.Add(face);
                }
            }
        }

        private void ExtractSolidsFromGeometry(GeometryElement geometry, Transform transform, List<Face> faces)
        {
            foreach (GeometryObject obj in geometry)
            {
                if (obj is GeometryInstance nestedInstance)
                {
                    GeometryElement nestedGeometry = nestedInstance.GetSymbolGeometry();
                    Transform combinedTransform = transform.Multiply(nestedInstance.Transform);
                    if (nestedGeometry != null)
                    {
                        ExtractSolidsFromGeometry(nestedGeometry, combinedTransform, faces);
                    }
                }
                else if (obj is Solid solid && solid.Faces.Size > 0)
                {
                    for (int i = 0; i < solid.Faces.Size; i++)
                    {
                        Face face = solid.Faces.get_Item(i);
                        if (face != null && face.Reference != null)
                        {
                            faces.Add(face);
                        }
                    }
                }
            }
        }

        private XYZ CalculatePointOnFace(Element elem, Face face, XYZ pickedPoint)
        {
            if (face == null || pickedPoint == null)
                return pickedPoint;

            BoundingBoxUV faceBB = face.GetBoundingBox();
            IntersectionResult projResult = face.Project(pickedPoint);
            if (projResult == null)
                return pickedPoint;

            UV pickedUV = projResult.UVPoint;
            FamilyInstance fi = elem as FamilyInstance;
            if (fi != null)
            {
                Transform transform = fi.GetTransform();
                Transform inverseTransform = transform.Inverse;
                XYZ localPoint = inverseTransform.OfPoint(pickedPoint);
                XYZ faceNormal = face.ComputeNormal(pickedUV).Normalize();
                XYZ localNormal = inverseTransform.OfVector(faceNormal).Normalize();
                if (Math.Abs(localNormal.Z) < 0.3)
                {
                    BoundingBoxXYZ bbox = fi.get_BoundingBox(null);
                    if (bbox != null)
                    {
                        double zPos = (bbox.Min.Z + bbox.Max.Z) * 0.5;
                        XYZ localResult = new XYZ(localPoint.X, localPoint.Y, zPos);
                        XYZ globalResult = transform.OfPoint(localResult);
                        projResult = face.Project(globalResult);
                        if (projResult != null)
                        {
                            return face.Evaluate(projResult.UVPoint);
                        }
                    }
                }
            }

            UV adjustedUV = new UV(pickedUV.U, (faceBB.Min.V + faceBB.Max.V) * 0.5);
            return face.Evaluate(adjustedUV);
        }

        private XYZ CalculateCurveLoopCentroid(CurveLoop curveLoop)
        {
            if (curveLoop == null || curveLoop.Count() == 0)
                return XYZ.Zero;

            XYZ sum = XYZ.Zero;
            int pointCount = 0;
            HashSet<XYZ> uniquePoints = new HashSet<XYZ>(new XYZEqualityComparer());
            foreach (Curve curve in curveLoop)
            {
                uniquePoints.Add(curve.GetEndPoint(0));
                uniquePoints.Add(curve.GetEndPoint(1));
            }
            foreach (XYZ point in uniquePoints)
            {
                sum += point;
                pointCount++;
            }
            return pointCount > 0 ? sum.Divide(pointCount) : XYZ.Zero;
        }

        private class XYZEqualityComparer : IEqualityComparer<XYZ>
        {
            private const double Tolerance = 0.0001;
            public bool Equals(XYZ x, XYZ y)
            {
                if (x == null && y == null)
                    return true;
                if (x == null || y == null)
                    return false;
                return Math.Abs(x.X - y.X) < Tolerance &&
                       Math.Abs(x.Y - y.Y) < Tolerance &&
                       Math.Abs(x.Z - y.Z) < Tolerance;
            }
            public int GetHashCode(XYZ obj)
            {
                if (obj == null)
                    return 0;
                double x = Math.Round(obj.X / Tolerance) * Tolerance;
                double y = Math.Round(obj.Y / Tolerance) * Tolerance;
                double z = Math.Round(obj.Z / Tolerance) * Tolerance;
                return x.GetHashCode() ^ y.GetHashCode() ^ z.GetHashCode();
            }
        }
    }
}
```




---



### `ViewsOnSheets.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using ViewOnSheetsR2025.Services;
using ViewOnSheetsR2025.UI;

namespace ViewOnSheetsR2025
{
    [Transaction(TransactionMode.Manual)]
    public class ViewsOnSheets : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            UIDocument uidoc = commandData.Application.ActiveUIDocument;
            Document doc = uidoc.Document;

            // 1. Collect unplaced views
            var unplacedViews = ViewsOnSheetsR2025Service.GetUnplacedViews(doc);
            if (unplacedViews.Count == 0)
            {
                TaskDialog.Show(
                    "Разместить виды на листах",
                    "Не найдено непомещённых, не-шаблонных видов."
                );
                return Result.Cancelled;
            }

            // 2. Collect all sheets
            var allSheets = ViewsOnSheetsR2025Service.GetAllSheets(doc);

            // 3. Collect title blocks
            var titleBlocks = new FilteredElementCollector(doc)
                .OfClass(typeof(FamilySymbol))
                .OfCategory(BuiltInCategory.OST_TitleBlocks)
                .Cast<FamilySymbol>()
                .ToList();

            if (titleBlocks.Count == 0)
            {
                TaskDialog.Show(
                    "Разместить виды на листах",
                    "В проекте не найдено штампов."
                );
                return Result.Cancelled;
            }

            // 4. Show selection window
            var window = new ViewsOnSheetsWindow(unplacedViews, allSheets, titleBlocks);
            bool? result = window.ShowDialog();
            if (result != true)
                return Result.Cancelled;

            // 5. Get selected views
            var selectedViews = window.SelectedViews;
            if (selectedViews == null || selectedViews.Count == 0)
            {
                TaskDialog.Show(
                    "Разместить виды на листах",
                    "Не выбраны виды."
                );
                return Result.Cancelled;
            }

            bool createNewSheets = window.CreateNewSheets;
            var selectedSheets = window.SelectedSheets;

            if (!createNewSheets)
            {
                if (selectedSheets == null || selectedSheets.Count != selectedViews.Count)
                {
                    TaskDialog.Show(
                        "Разместить виды на листах",
                        "Количество выбранных листов должно совпадать с количеством выбранных видов."
                    );
                    return Result.Cancelled;
                }
            }

            // 6. Ask for point
            XYZ placementPoint;
            try
            {
                placementPoint = uidoc.Selection.PickPoint(
                    "Укажите точку размещения на текущем листе. " +
                    "Эта точка будет использована как центр для всех видов."
                );
            }
            catch (Exception ex)
            {
                TaskDialog.Show(
                    "Разместить виды на листах",
                    "Выбор точки отменён или завершился неудачно:\n" + ex.Message
                );
                return Result.Cancelled;
            }

            // 7. Build the dictionary of parameter values from the window
            var paramValues = new Dictionary<string, string>()
            {
                { "Формат А",           window.SelectedFormatA     ?? "" },
                { "Кратность",          window.SelectedMultiplicity ?? "" },
                { "Книжная ориентация", window.SelectedOrientation  ?? "" }
            };

            // 8. Retrieve the user-chosen scale from the window
            int scale = window.SelectedViewScale;

            // 9. Place views on sheets
            try
            {
                ViewsOnSheetsR2025Service.PlaceViewsOnSheets(
                    doc,
                    createNewSheets,
                    selectedViews,
                    selectedSheets,
                    placementPoint,
                    window.SelectedTitleBlockId,
                    paramValues,
                    scale
                );
                return Result.Succeeded;
            }
            catch (Exception ex)
            {
                TaskDialog.Show(
                    "Разместить виды на листах",
                    "Ошибка при размещении видов:\n" + ex.Message
                );
                return Result.Failed;
            }
        }
    }
}

```




---




### `AutoLevelMarker.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;

namespace CreateLevelMarkers
{
    [Transaction(TransactionMode.Manual)]
    public class Command : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            UIApplication uiapp = commandData.Application;
            UIDocument uidoc = uiapp.ActiveUIDocument;
            Document doc = uidoc.Document;

            try
            {
                // Create and show the main form.
                AutoLevelMarker form = new AutoLevelMarker(doc);
                bool? dialogResult = form.ShowDialog();

                if (dialogResult != true)
                    return Result.Cancelled;

                // Retrieve user selections.
                var selectedSections = form.SelectedSections;
                var selectedFamilies = form.SelectedFamilies;
                var markerType = form.SelectedMarkerType;
                var offsetMeters = form.OffsetValue * 3.28084; // Convert meters to feet

                // Retrieve optional parameter names.
                var selectedSourceParam = form.SelectedSourceParam;
                var selectedTargetParam = form.SelectedTargetParam;

                // Process each section and create markers.
                using (Transaction t = new Transaction(doc, "Create Level Markers"))
                {
                    t.Start();

                    if (!markerType.IsActive)
                        markerType.Activate();

                    foreach (ViewSection section in selectedSections)
                    {
                        var instances = new FilteredElementCollector(doc, section.Id)
                            .OfClass(typeof(FamilyInstance))
                            .Cast<FamilyInstance>()
                            .Where(i =>
                            {
                                try
                                {
                                    return i.Symbol != null &&
                                           i.Symbol.Family != null &&
                                           selectedFamilies.Contains(i.Symbol.Family.Name);
                                }
                                catch { return false; }
                            })
                            .ToList();

                        TaskDialog.Show("Найдено", "Найдено " + instances.Count + " экземпляров");

                        foreach (FamilyInstance inst in instances)
                        {
                            try
                            {
                                BoundingBoxXYZ bb = inst.get_BoundingBox(null);
                                if (bb != null)
                                {
                                    XYZ center = (bb.Min + bb.Max) * 0.5;
                                    XYZ placementPoint = new XYZ(center.X + offsetMeters, center.Y, center.Z);

                                    FamilyInstance marker = doc.Create.NewFamilyInstance(
                                        placementPoint,
                                        markerType,
                                        section
                                    );

                                    // Optional: copy parameter value if both parameter names are provided.
                                    if (!string.IsNullOrEmpty(selectedSourceParam) && !string.IsNullOrEmpty(selectedTargetParam))
                                    {
                                        var allParams = ParameterUtilities.GetAllParameters(inst);
                                        Parameter? sourceParam = allParams.ContainsKey(selectedSourceParam) ?
                                            allParams[selectedSourceParam] : null;
                                        if (sourceParam == null)
                                        {
                                            TaskDialog.Show("Ошибка", "Параметр не найден: " + selectedSourceParam);
                                            continue;
                                        }

                                        double paramValue = 0;
                                        switch (sourceParam.StorageType)
                                        {
                                            case StorageType.Double:
                                                paramValue = sourceParam.AsDouble() * 1000;
                                                break;
                                            case StorageType.Integer:
                                                paramValue = sourceParam.AsInteger() * 1000;
                                                break;
                                            case StorageType.String:
                                                string stringValue = sourceParam.AsString();
                                                double tempValue;
                                                if (!string.IsNullOrEmpty(stringValue) && double.TryParse(stringValue, out tempValue))
                                                    paramValue = tempValue * 1000;
                                                else
                                                {
                                                    TaskDialog.Show("Ошибка", "Параметр имеет нечисловое значение: " + stringValue);
                                                    continue;
                                                }
                                                break;
                                            default:
                                                TaskDialog.Show("Ошибка", "Параметр имеет неподдерживаемый тип хранения");
                                                continue;
                                        }

                                        var markerParams = ParameterUtilities.GetAllParameters(marker);
                                        Parameter? targetParam = markerParams.ContainsKey(selectedTargetParam) ?
                                            markerParams[selectedTargetParam] : null;
                                        if (targetParam != null)
                                        {
                                            if (targetParam.IsReadOnly)
                                            {
                                                TaskDialog.Show("Ошибка", "Невозможно изменить параметр только для чтения: " + selectedTargetParam);
                                            }
                                            else
                                            {
                                                switch (targetParam.StorageType)
                                                {
                                                    case StorageType.Double:
                                                        targetParam.Set((double)paramValue);
                                                        break;
                                                    case StorageType.Integer:
                                                        targetParam.Set((int)paramValue);
                                                        break;
                                                    case StorageType.String:
                                                        targetParam.Set(paramValue.ToString());
                                                        break;
                                                    default:
                                                        TaskDialog.Show("Ошибка", "Целевой параметр имеет неподдерживаемый тип хранения");
                                                        break;
                                                }
                                            }
                                        }
                                        else
                                        {
                                            TaskDialog.Show("Ошибка", "Параметр не найден в маркере: " + selectedTargetParam);
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                TaskDialog.Show("Ошибка", "Ошибка при обработке экземпляра: " + ex.Message);
                            }
                        }
                    }

                    t.Commit();
                }

                //MessageBox.Show("Логика создания маркеров будет запущена.", "Информация", MessageBoxButton.OK, MessageBoxImage.Information);
                return Result.Succeeded;
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