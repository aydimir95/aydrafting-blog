+++
title = "3D Geometry Learning Resources for Revit API Development"
date = 2025-10-27T00:00:00+03:00
draft = true
tags = ["C#", "Revit", "3D Geometry", "Resources"]
+++

# 3D Geometry Learning Resources for Revit API Development

## Revit API Specific Resources

### The Building Coder Blog (Jeremy Tammik)
**URL:** https://tbc.aecwithcode.com/blog/

**Focus:** Revit API geometry, transforms, coordinate systems
**Why it's great:** Jeremy Tammik is THE authority on Revit API. His blog has hundreds of posts explaining geometry concepts with real code examples.

**Key Posts:**
- **Coordinate Transformations:** https://thebuildingcoder.typepad.com/blog/2010/01/transformations.html
  - Explains Transform class, BasisX/Y/Z, coordinate system transformations
  - Shows how family instances handle local coordinate systems

### Easy Revit API
**URL:** https://easyrevitapi.com/
**Focus:** Practical Revit API tutorials with clear explanations

**Key Articles:**
- **Revit Transformations Made Easy:** https://easyrevitapi.com/index.php/2023/08/15/revit-transformations-made-easy/
  - Translation and rotation operations
  - Transform.CreateTranslation(), Transform.CreateRotation()
  - Combining multiple transformations

- **Element-Specific Coordinate Systems:** https://easyrevitapi.com/index.php/2023/09/26/towards-object-specific-coordinate-systems/
  - Converting between global and local coordinate systems
  - Practical wall example with code

### Learn Revit API
**URL:** https://learnrevitapi.com/
**Focus:** Modern Revit API tutorials

**Key Article:**
- **Convert Coordinates in Revit API:** https://learnrevitapi.com/blog/convert-coordinate-systems-in-revit-api-draft
  - Internal vs Project vs Survey coordinate systems
  - Transform application and inverse transforms
  - Working with True North rotation

### Autodesk Forums & Community
- **Revit API Forum:** Great for specific questions about coordinate transformations
- Search for "Transform", "XYZ", "coordinate system" to find real-world problems and solutions

---

## General 3D Math Resources (Not Revit-Specific)

### Books

#### "3D Math Primer for Graphics and Game Development" 
**Authors:** Fletcher Dunn, Ian Parberry
**Why it's great:** THE classic book for programmers learning 3D math. Explains concepts clearly without drowning you in theory.
**Free online version:** https://gamemath.com/book/intro.html

https://gamemath.com/book/cartesianspace.html

**Topics covered:**
- Vectors, coordinate systems, matrices
- Rotations, transformations
- Quaternions
- Right-hand rule and coordinate system handedness

#### "Mathematics for 3D Game Programming and Computer Graphics"
**Author:** Eric Lengyel
**Why it's great:** More advanced but extremely thorough
**Good for:** Deep dives into transformation matrices, projections

### Online Tutorials & Courses

#### 3Blue1Brown - Linear Algebra Series
**URL:** https://www.3blue1brown.com/topics/linear-algebra
**Why it's great:** Best visual explanations of linear algebra concepts on the internet
**Key Videos:**
- Cross Products: https://www.3blue1brown.com/lessons/cross-products
- Dot Products
- Linear transformations
- Determinants (handedness!)

**Seriously, watch these.** Grant Sanderson makes abstract math click visually.

#### Practical 3D Math for Programmers (Jesse Janzer)
**URL:** https://stunlock.gg/posts/linear_algebra/
**Why it's great:** Written specifically for programmers, not mathematicians
**Focus:** 
- Translation, rotation, scale matrices
- Combining transformations
- Minimum necessary math without academic fluff

#### 3D Game Engine Programming
**URL:** https://www.3dgep.com/3d-math-primer-for-game-programmers-matrices/
**Why it's great:** Great explanations of matrices, determinants, orthogonal systems
**Topics:**
- Matrix mathematics
- Coordinate transformations
- Right-handed coordinate systems
- Determinants and what they mean

#### Vector Math Tutorial for 3D Computer Graphics
**Author:** Interactive tutorial
**Why it's great:** Interactive exercises after each section
**Best for:** Hands-on learning of vectors and matrices

#### Computer Graphics from Scratch (Gabriel Gambetta)
**URL:** https://www.gabrielgambetta.com/computer-graphics-from-scratch/
**Why it's great:** Builds 3D graphics from absolute fundamentals
**Linear Algebra Appendix:** https://www.gabrielgambetta.com/computer-graphics-from-scratch/A0-linear-algebra.html
- Vectors, dot product, cross product
- Clear formulas and geometric intuition

---

## Key Concepts to Focus On

Based on your Revit API work, prioritize these topics:

### 1. **Coordinate Systems & Handedness** ⭐ (Most Critical)
- Right-handed vs left-handed systems
- Why it matters in Revit
- The right-hand rule (thumb=X, index=Y, middle=Z)
- Determinant calculation to check handedness

**Resources:**
- 3Blue1Brown determinant video
- "3D Math Primer" Chapter 3

### 2. **Cross Products** ⭐ (Very Important)
- Why order matters: A×B ≠ B×A
- Geometric interpretation (perpendicular vector)
- Creating coordinate systems from two vectors

**Resources:**
- 3Blue1Brown cross product video
- Gabriel Gambetta's appendix

### 3. **Transforms & Matrices**
- Translation, rotation, scale
- BasisX, BasisY, BasisZ in Revit
- Transform.Multiply() for combining transformations
- Inverse transforms

**Resources:**
- The Building Coder transformation posts
- Easy Revit API tutorials
- "3D Math Primer" Chapters 4-6

### 4. **Dot Products**
- Testing perpendicularity
- Angle calculations
- Projections

**Resources:**
- 3Blue1Brown dot product video
- Any linear algebra tutorial

### 5. **Vectors**
- Normalization (unit vectors)
- Vector arithmetic
- Length/magnitude

**Resources:**
- All the above resources cover this

---

## Practical Learning Path for Revit API

**Phase 1: Fundamentals (1-2 weeks)**
1. Watch 3Blue1Brown linear algebra series (especially cross products)
2. Read "3D Math Primer" Chapters 1-3 (vectors, coordinate systems)
3. Practice: Write simple C# programs calculating cross products, checking handedness

**Phase 2: Revit-Specific (1-2 weeks)**
1. Read all The Building Coder posts on transforms
2. Work through Easy Revit API transformation tutorials
3. Practice: Create a simple Revit plugin that gets Face transforms and checks their handedness

**Phase 3: Advanced (Ongoing)**
1. Deep dive into "3D Math Primer" Chapters 4-6 (matrices, transformations)
2. Experiment with complex transformations in Revit
3. Build more section creator tools, understand every Transform operation

---

## Quick Reference Cheat Sheet

### Right-Hand Rule
```
Right hand:
- Thumb = X-axis
- Index = Y-axis  
- Middle = Z-axis
```

### Cross Product Order
```csharp
// RIGHT-handed (Revit requires this):
XYZ basisY = basisZ.CrossProduct(basisX);  ✅

// LEFT-handed (Revit rejects this):
XYZ basisY = basisX.CrossProduct(basisZ);  ❌
```

### Check Handedness
```csharp
// Determinant = BasisX · (BasisY × BasisZ)
XYZ crossResult = BasisY.CrossProduct(BasisZ);
double determinant = BasisX.DotProduct(crossResult);

// determinant = +1  → Right-handed ✅
// determinant = -1  → Left-handed ❌
```

### Common Revit Transform Operations
```csharp
// Get face coordinate system
Face face = /* ... */;
Transform faceTransform = face.ComputeDerivatives(UV.Zero);
XYZ basisX = faceTransform.BasisX;
XYZ basisY = faceTransform.BasisY;
XYZ basisZ = faceTransform.BasisZ; // Normal to face

// Create transform for section view
XYZ sectionUp = XYZ.BasisZ;
XYZ viewDirection = /* face normal */;
XYZ sectionRight = sectionUp.CrossProduct(viewDirection); ✅

// Always check your transforms in R2024!
```

---

## Pro Tips

1. **Always test in Revit 2024** - It's stricter about coordinate systems than 2025+
2. **Use TaskDialog for debugging** - Way better than Debug.WriteLine for geometry issues
3. **Visualize everything** - Draw temporary lines/planes to see what your transforms are doing
4. **Cross products are order-sensitive** - This will bite you repeatedly until you internalize it
5. **Start simple** - Master 2D transformations before jumping to 3D

---

## Community Resources

- **Revit API Forum:** https://forums.autodesk.com/t5/revit-api-forum/bd-p/160
- **RevitAPIExamples on GitHub:** Search for transform examples
- **The Building Coder GitHub:** Jeremy's sample code
- **Stack Overflow:** Tag `revit-api` for specific questions

---

**Bottom Line:** Start with 3Blue1Brown videos for intuition, then read "3D Math Primer" for depth, then apply it all to The Building Coder's Revit-specific examples. You'll understand coordinate systems way better than you did in Statics 101.
