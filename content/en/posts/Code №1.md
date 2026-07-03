+++
title = "Code №1: Calculates the center point for viewport placement on the sheet"
date = 2025-10-21T03:27:10+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++

# 2025-10-21

```C#
        /// <summary>
        /// Calculates the center point for viewport placement on the size of the sheet
        /// </summary>
        /// <param name="sheet">Name - ViewSheet</param>
        /// <returns>Point - viewport</returns>
        private static XYZ CalculateCenterFromSheet(ViewSheet sheet)
        {
            BoundingBoxUV outline = sheet.Outline;

            if (outline == null)
                throw new InvalidOperationException("Не удалось получить границы листа");
                
            double width = outline.Max.U - outline.Min.U;
            double height = outline.Max.V - outline.Min.V;
            
            return new XYZ(width / 2, height / 2, 0);
        }

```



