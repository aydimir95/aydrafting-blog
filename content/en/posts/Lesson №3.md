+++
title = "C# + Revit API: Lesson 3 - Right-Handed vs Left-Handed Coordinate Systems in Revit API"
date = 2025-10-21T03:27:10+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++

# What the Hell is Coordinate System Handedness?

When I was developing my section creator plugin, Revit 2024 kept rejecting transforms that looked perfectly valid. The vectors were perpendicular, unit length, everything checked out. But the API just said "nope."

Turns out there's this thing called **coordinate system handedness** that I last heard about in Statics 101—about 10 years ago...

## The Right-Hand Rule

Take your right hand and do this:

- **Thumb** points right → X-axis
- **Index finger** points forward → Y-axis
- **Middle finger** points up → Z-axis

![Pasted image 20251027011213.png](</images/Pasted image 20251027011213.png>)

That's a **right-handed coordinate system**.

Now try the same with your left hand. Your middle finger points DOWN instead of up. That's a **left-handed system**.

Both are mathematically valid. Both have perpendicular axes. But they're mirror images of each other.

## Why It Matters in Revit

**Revit API only accepts right-handed coordinate systems.** Period.

You can't just have three perpendicular vectors and call it a day. The orientation matters. If you accidentally create a left-handed system, Revit will reject your Transform.

As [Building Coder post 0290 (Transformations)](https://tbc.aecwithcode.com/blog/0290) explains, Revit even tracks this explicitly with `FlippedHand` and `FlippedFacing` properties on family instances. When these properties are inconsistently set, you get left-handed systems that Revit rejects.

## How to Check: The Determinant

The determinant tells you the handedness:

```text
Determinant = BasisX · (BasisY × BasisZ)

If result = +1 → Right-handed ✅
If result = -1 → Left-handed ❌
```

This is called the **scalar triple product** and it's the mathematical test for handedness.

### Concrete Example

Let's say you have:

```csharp
BasisX = (1, 0, 0)
BasisY = (0, 1, 0)  
BasisZ = (0, 0, 1)
```

Calculate the determinant:

```
BasisY × BasisZ = (0,1,0) × (0,0,1)
                = (1·1 - 0·0, 0·0 - 0·1, 0·0 - 1·0)
                = (1, 0, 0)

BasisX · (1, 0, 0) = 1 × 1 = +1 ✅ RIGHT-HANDED
```

## The Cross Product Trap

Here's where most developers (including me) mess up. **The order of cross products matters:**

```csharp
A × B  // Points one direction
B × A  // Points OPPOSITE direction (they're negatives of each other)
```

### Real Example: Building a Transform from a Face

Let's say you have a wall face with:

- `BasisX = (1, 0, 0)` - pointing right along the wall
- `BasisZ = (0, 0, 1)` - pointing forward (out of the wall)
- We need to find `BasisY` to point up

**Wrong way (creates left-handed system):**

```csharp
XYZ basisY = basisX.CrossProduct(basisZ);
// (1,0,0) × (0,0,1) = (0, -1, 0)  ← Points DOWN!
```

This gives:

- BasisX = (1, 0, 0) - right
- BasisY = (0, -1, 0) - DOWN (wrong!)
- BasisZ = (0, 0, 1) - forward

Determinant check:

```
BasisY × BasisZ = (0,-1,0) × (0,0,1) = (-1, 0, 0)
BasisX · (-1, 0, 0) = -1 ❌ LEFT-HANDED!
```

**Correct way (right-handed system):**

```csharp
XYZ basisY = basisZ.CrossProduct(basisX);
// (0,0,1) × (1,0,0) = (0, 1, 0)  ← Points UP!
```

Now we have:

- BasisX = (1, 0, 0) - right
- BasisY = (0, 1, 0) - UP (correct!)
- BasisZ = (0, 0, 1) - forward

Determinant check:

```
BasisY × BasisZ = (0,1,0) × (0,0,1) = (1, 0, 0)
BasisX · (1, 0, 0) = +1 ✅ RIGHT-HANDED!
```

**The difference? Just swapping the order of the cross product.**

## Practical Code: Verify Your Transforms

Before you use a transform in Revit, always check it:

```csharp
public static bool IsRightHanded(XYZ basisX, XYZ basisY, XYZ basisZ)
{
    // Calculate determinant: BasisX · (BasisY × BasisZ)
    XYZ crossYZ = basisY.CrossProduct(basisZ);
    double determinant = basisX.DotProduct(crossYZ);
    
    // Allow small floating-point error (should be ≈1.0)
    return determinant > 0.99;
}
```

Use it like this:

```csharp
Transform myTransform = Transform.Identity;
myTransform.BasisX = basisX;
myTransform.BasisY = basisY;
myTransform.BasisZ = basisZ;
myTransform.Origin = origin;

if (!IsRightHanded(basisX, basisY, basisZ))
{
    Debug.Print("ERROR: Transform is left-handed! Revit will reject it.");
    // Fix by negating one axis
    myTransform.BasisY = myTransform.BasisY.Negate();
    Debug.Print($"Handedness after fix: {IsRightHanded(...)}");
}
```

## Real Example: Building a Section from a Face

Here's how I fixed my section creator (inspired by [Building Coder post 0671 - Planar Face Transform](https://tbc.aecwithcode.com/blog/0671)):

```csharp
// Get the face you want to create a section through
Face selectedFace = ...;
UV center = new UV(0.5, 0.5);  // Center of face

// Get face geometry at that point
XYZ facePoint = selectedFace.Evaluate(center);
Transform faceTransform = selectedFace.ComputeDerivatives(center);

// Extract normalized basis vectors
XYZ viewDirection = faceTransform.BasisZ.Normalize();  // Normal (INTO face)
XYZ faceRight = faceTransform.BasisX.Normalize();       // Right direction

// BUILD THE COORDINATE SYSTEM - order is critical!
// Don't do this: XYZ sectionUp = viewDirection.CrossProduct(faceRight);
// Do this instead:
XYZ sectionUp = faceRight.CrossProduct(viewDirection).Normalize();

// Verify it's right-handed BEFORE using
if (!IsRightHanded(faceRight, sectionUp, viewDirection))
{
    Debug.Print("Left-handed! Fixing...");
    sectionUp = sectionUp.Negate();
}

// Now create the section transform
Transform sectionTransform = Transform.Identity;
sectionTransform.Origin = facePoint;
sectionTransform.BasisX = faceRight;
sectionTransform.BasisY = sectionUp;
sectionTransform.BasisZ = viewDirection;

// Safe to use in Revit now
Section newSection = ViewSection.CreateSection(doc, viewFamilyType, sectionTransform);
```

## The Version Compatibility Issue

**Note:** Different Revit versions have varying strictness about handedness:

- **Revit 2024** is very strict about rejecting left-handed transforms
- **Revit 2025+** appears more forgiving in some cases
- This may vary by specific update/hotfix version

If your plugin works in R2025 but fails in R2024, handedness is often the culprit. Always test on the oldest Revit version you plan to support.

## Quick Reference: Building Right-Handed Systems

To consistently build right-handed coordinate systems:

```csharp
// These all create right-handed systems (any order works):
BasisX = BasisY.CrossProduct(BasisZ);  ✅
BasisY = BasisZ.CrossProduct(BasisX);  ✅
BasisZ = BasisX.CrossProduct(BasisY);  ✅

// These create left-handed systems (reversed order):
BasisX = BasisZ.CrossProduct(BasisY);  ❌
BasisY = BasisX.CrossProduct(BasisZ);  ❌
BasisZ = BasisY.CrossProduct(BasisX);  ❌
```

**Pro tip:** If you get it backwards, just negate one axis to flip handedness.

## Key Takeaways

1. Coordinate systems have "handedness" - they can be right or left-handed
2. Revit API requires right-handed systems (determinant = +1)
3. Cross product order determines handedness - swapping the order flips it
4. Always verify with the determinant formula before using transforms
5. Left-handed systems cause mysterious "Transform rejected" errors
6. Test on multiple Revit versions if possible - R2024 is stricter than newer versions

## Why This Matters

This concept isn't new—it's standard 3D graphics math. [Building Coder post 0290](https://tbc.aecwithcode.com/blog/0290) and [post 0671](https://tbc.aecwithcode.com/blog/0671) touch on it, but they don't explicitly explain the determinant check or why your transforms get rejected.

Understanding handedness saved my section creator from being completely broken in Revit 2024. One wrong cross product order was all it took.

If your Revit plugins are mysteriously rejecting transforms or sections, check your handedness. Odds are, one axis is backwards.

---

## Further Reading

- [Building Coder Post 0290: Transformations](https://tbc.aecwithcode.com/blog/0290)
- [Building Coder Post 0671: Planar Face Transform](https://tbc.aecwithcode.com/blog/0671)
- [Building Coder Post 0549: Converting Between 2D UV and 3D XYZ Coordinates](https://tbc.aecwithcode.com/blog/0549)