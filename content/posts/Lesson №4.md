+++
title = "C# + Revit API: Lesson 4 - Logical Operators"
date = 2025-08-06T15:50:00+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250902204927.png"
cover.alt = "Operators"
+++

 > They control logic and flow in our tools.
 > We will have a good understanding of core statements we can use to build Revit Add-ins.

---
# Logical Operators

`x == y` => *true  if x is equal to y*

`x != y` => *true if x is not equal to y*

`x > y` => *true if x is greater than y*

`x < y` => *true if x is less than y*

`x >= y` => *true if x greater than or equals to y*

`x <= y` => *true if x less than or equals to y*

---

`x || y` => *true if x OR y are true*

`x && y `=> *true if x AND y are true*

`!(x)` => *true if not x (can also use 'not' x)*

`x ^ y` => *true if x OR y are true, but not both*  

---
## `Null` Operations / Operands


`x?.Method()` => *If x is null, Method() will NOT run*

`x ??= value` => *If x is null, set it to value specified*

`x is null` => *True if x is Null, False if it's not Null*

`if (x)` => *if x is Null, it yields Null or false*

---

> These tutorials were inspired by the work of [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru). If you’re looking for a deeper dive into the topics, check out his channel for detailed explanations.