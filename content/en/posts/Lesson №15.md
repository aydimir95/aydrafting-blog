+++
title = "C# + Revit API: Lesson 15 - ListView Window Forms"
date = 2025-09-14T12:41:56+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++

# `ListView` Form Anatomy
![Pasted image 20250914124431.png](</images/Pasted image 20250914124431.png>)

 > In the previous lesson, we built a **dropdown form** to pass values between the UI and our code. This time, we’ll take things a step further by building a **ListView-based form**. ListViews are perfect when you need to display and select multiple items, while keeping the logic behind the scenes clean and flexible.

## Why a ListView?

The `dropdown` form worked well for simple key-value choices. However, as projects grow, you’ll often need:
- A larger, scrollable UI element to display more items.
- Index-based access to objects for quick data manipulation.
- Room for expansion—like adding text filters and advanced interactions.

The `ListView` control in `WinForms` gives us this flexibility.

### Key Concepts for This Lesson
1.	Two Parallel Lists:
	- We’ll separate what the user sees (keys) from what the code needs (values).
	- `Keys`: Display names or identifiers for users.
	- `Values`: Actual objects, IDs, or data tied to those keys.
	- This way, you can keep your data model clean while still offering a simple interface.

2.	Indexing:
	- Because the `ListView` and backend lists share the same order, it’s easy to grab the correct object using the selected `index`.

3.	Future Enhancements:
	- Later, we’ll wrap these `keys` and `values` into a single object pair for cleaner code.
	- We’ll add a `search box` so users can quickly filter the list by typing in a `string`.

For now, we’ll focus on building the foundation.

## Example: Building the `ListView` Form

Here’s a simple `ListView` form that displays a list of sheet names:
### `PseudoCode`
```C#
// Conceptual Example: Using a ListView to select a Revit sheet

// Imagine we have a set of sheets in Revit:
List<ViewSheet> sheets = GetAllSheetsFromRevit();

// We create two lists:
// - One for the names we display (keys)
// - One for the actual objects we use in code (values)
List<string> sheetNames  = sheets.Select(s => $"{s.SheetNumber} - {s.Name}").ToList();
List<ViewSheet> sheetObjects = sheets;

// Create the ListView (scrollable list in a form)
ListView listView = new ListView();
listView.View = View.List;
listView.FullRowSelect = true;
listView.MultiSelect = false;

// Add display names to the ListView
foreach (string name in sheetNames)
    listView.Items.Add(name);

// User selects "Sheet B" and Clicks OK
int index = listView.SelectedIndices[0];

// We use the index to get the real sheet object
ViewSheet selectedSheet = sheetObjects[index];
```

### How It Works
- Two Lists:
	- `sheetNames`: A list of user-friendly names shown in the ListView.
	- `sheetIds`: A list of the actual ViewSheet objects stored behind the scenes.
- **Index Matching:**
	- When the user selects an item in the `ListView`, the control gives you its `index`.
    - That `index` corresponds directly to the same position in `sheetObjects`, letting you access the correct Revit element.
- **Selection Handling (OK Button):**
    - Clicking OK - retrieves the selected `index`, uses it to find the correct `ViewSheet` object, and makes it available for your add-in logic.

### ASCII Graph for a Visual Explanation
```text
+----------------------------+
|   Revit Add-In Code Logic  |
+----------------------------+
             |
             v
+------------------------------------+
| 1. Gather Data                     |
|    - Collect ViewSheets from doc   |
|    - Create two lists:             |
|       keys (sheetNames)            |
|       values (sheetObjects)        |
+------------------------------------+
             |
             v
+----------------------------+
| 2. Create ListView Control |
|    - List mode: View.List  |
|    - FullRowSelect = true  |
|    - Add each key as row   |
+----------------------------+
             |
             v
+--------------------------------+
| 3. User Interaction            |
|    - Scroll through items      |
|    - Click a row               |
|    - ListView stores index     |
+--------------------------------+
             |
             v
+-------------------------------------+
| 4. Retrieve Selection Index         |
|    - int i = listView.SelectedIndex |
|    - Example: user picks row #1     |
+-------------------------------------+
             |
             v
+---------------------------------------+
| 5. Map Index Back to Real Object      |
|    - ViewSheet selected =             |
|        sheetObjects[i];               |
|    - Keys are UI only, values = data  |
+---------------------------------------+
             |
             v
+-------------------------------+
| 6. OK Button or Double-Click  |
|    - Confirm selection        |
|    - Close ListView Form      |
+-------------------------------+
             |
             v
+--------------------------------------+
| 7. Code Logic Continues              |
|    - Work with selected ViewSheet    |
|    - Modify, open, or analyze sheet  |
+--------------------------------------+
```

# Homework 
- Create the `Windows Form`
- Create the `Base Form` Method to call on the `Windows Form`
- Extend the `Sheet Class` to create a `key` to show the `Sheet Number - Sheets Name`
- Customize the `Form` to select `Sheets` from the `List` 
	- Extend the `Document Class` 
	- Make sure to let the user have an option to pick Single- or Multi-Select `Form`


# Solution

## `Project Solution`
```bash
Solution
|-> guRoo.csproj  
	|-> Dependencies
	|-> Properties
	|-> Commands
	|-> Forms
		|-> Custom.cs  # Update the Custom Class
		|-> Bases  
			|-> Winforms 
				|-> BaseListView.cs  # Add a New `Form (Windows Forms)`
					|-> BaseListView.Designer.cs  # Automatically Added with the Form

	|-> Extensions
		|-> Document_Ext.cs  
		|-> Revision_Ext.cs 
	|-> General 
	|-> Models
	|-> Resources
		|-> Icons16
			|-> IconList16.ico 
	|-> Services
	|-> Utilities
		|-> File_Utils.cs 
	|-> Views
	|-> Application.cs  
	|-> Host.cs         
	|-> guRoo.addin
```


## Create the `Window Form`

{{< collapse title="Show/Hide Code" >}}

![Pasted image 20250914201110.png](</images/Pasted image 20250914201110.png>)

### `BaseListView.cs`
```C#
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Form = System.Windows.Forms.Form;
using gFil = guRoo.Utilities.File_Utils;

namespace guRoo.Forms.Base
{
    public partial class BaseListView : Form
    {
        private bool MultiSelect;
        private List<string> Keys;
        private List<object> Values;
        
        public BaseListView(List<string> keys, List<object> values, string title, bool multiselect = true)
        {
            InitializeComponent();
            gFil.SetFormIcon(this);
            
            this.Text = title;
            this.Keys = keys;
            this.Values = values;
            
            this.MultiSelect = multiselect;
            this.listView.MultiSelect = multiselect;
            this.listView.CheckBoxes = multiselect;
            this.buttonCheckAll.Enabled = multiselect;
            this.buttonUncheckAll.Enabled = multiselect;
            
            this.DialogResult = DialogResult.Cancel;
            this.Tag = null;
            
            PopulateListView();
        }
        
        private void PopulateListView()
        {
            this.listView.Clear();
            this.listView.Columns.Add("Key", 380);

            foreach (var key in this.Keys)
            {
                var listViewItem = new ListViewItem(key);
                listViewItem.Checked = false;
                this.listView.Items.Add(listViewItem);
            }
        }
        
		private void listView_SelectedIndexChanged(object sender, EventArgs e)
        {
	        
        }
        
        private void buttonOk_Click(object sender, EventArgs e)
        {
            if (this.MultiSelect && this.listView.CheckedItems.Count > 0)
            {
                this.Tag = this.listView.CheckedItems
                    .Cast<ListViewItem>()
                    .Select(i => this.Values[i.Index])
                    .ToList();

                this.DialogResult = DialogResult.OK;
            }
            if (!this.MultiSelect && this.listView.SelectedItems.Count > 0)
            {
                int ind = this.listView.SelectedItems[0].Index;
                this.Tag = this.Values[ind];
                this.DialogResult = DialogResult.OK;
            }
            
                this.Close();
        }
        
        private void buttonCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }
        
        private void buttonCheckAll_Click(object sender, EventArgs e)
        {
            if (this.MultiSelect) { return; }
            
            foreach (ListViewItem item in this.listView.Items)
            {
                item.Checked = true;
                item.Selected = true;
            }
        }
        
        private void buttonUncheckAll_Click(object sender, EventArgs e)
        {
            if (this.MultiSelect) { return; }
            foreach (ListViewItem item in this.listView.Items)
            {
                item.Checked = false;
                item.Selected = false;
            }
        }
    }
}
```

### `BaseListView.Designer.cs`
```C#
namespace UKON.Forms.Base
{
    partial class BaseListView
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            tableLayoutPanel2 = new System.Windows.Forms.TableLayoutPanel();
            textBoxFilter = new System.Windows.Forms.TextBox();
            listView = new System.Windows.Forms.ListView();
            buttonCancel = new System.Windows.Forms.Button();
            buttonCheckAll = new System.Windows.Forms.Button();
            buttonUncheckAll = new System.Windows.Forms.Button();
            buttonOk = new System.Windows.Forms.Button();
            tableLayoutPanel1.SuspendLayout();
            tableLayoutPanel2.SuspendLayout();
            SuspendLayout();
            // 
            // tableLayoutPanel1
            // 
            tableLayoutPanel1.ColumnCount = 1;
            tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            tableLayoutPanel1.Controls.Add(tableLayoutPanel2, 0, 2);
            tableLayoutPanel1.Controls.Add(textBoxFilter, 0, 0);
            tableLayoutPanel1.Controls.Add(listView, 0, 1);
            tableLayoutPanel1.Controls.Add(buttonOk, 0, 3);
            tableLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
            tableLayoutPanel1.Location = new System.Drawing.Point(0, 0);
            tableLayoutPanel1.Margin = new System.Windows.Forms.Padding(0);
            tableLayoutPanel1.Name = "tableLayoutPanel1";
            tableLayoutPanel1.RowCount = 4;
            tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 45F));
            tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 48F));
            tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 60F));
            tableLayoutPanel1.Size = new System.Drawing.Size(484, 561);
            tableLayoutPanel1.TabIndex = 0;
            // 
            // tableLayoutPanel2
            // 
            tableLayoutPanel2.AutoSize = true;
            tableLayoutPanel2.ColumnCount = 3;
            tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 33.3333321F));
            tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 33.3333321F));
            tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 33.3333321F));
            tableLayoutPanel2.Controls.Add(buttonCancel, 0, 0);
            tableLayoutPanel2.Controls.Add(buttonCheckAll, 1, 0);
            tableLayoutPanel2.Controls.Add(buttonUncheckAll, 2, 0);
            tableLayoutPanel2.Dock = System.Windows.Forms.DockStyle.Fill;
            tableLayoutPanel2.Location = new System.Drawing.Point(16, 457);
            tableLayoutPanel2.Margin = new System.Windows.Forms.Padding(16, 4, 16, 4);
            tableLayoutPanel2.Name = "tableLayoutPanel2";
            tableLayoutPanel2.RowCount = 1;
            tableLayoutPanel2.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            tableLayoutPanel2.Size = new System.Drawing.Size(452, 40);
            tableLayoutPanel2.TabIndex = 0;
            // 
            // textBoxFilter
            // 
            textBoxFilter.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            textBoxFilter.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, 0);
            textBoxFilter.Location = new System.Drawing.Point(16, 16);
            textBoxFilter.Margin = new System.Windows.Forms.Padding(16, 16, 16, 4);
            textBoxFilter.Name = "textBoxFilter";
            textBoxFilter.Size = new System.Drawing.Size(452, 25);
            textBoxFilter.TabIndex = 1;
            // 
            // listView
            // 
            listView.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            listView.CheckBoxes = true;
            listView.Font = new System.Drawing.Font("Segoe UI", 10F);
            listView.Location = new System.Drawing.Point(16, 49);
            listView.Margin = new System.Windows.Forms.Padding(16, 4, 16, 4);
            listView.Name = "listView";
            listView.Size = new System.Drawing.Size(452, 400);
            listView.TabIndex = 2;
            listView.UseCompatibleStateImageBehavior = false;
            listView.SelectedIndexChanged += listView_SelectedIndexChanged;
            // 
            // buttonCancel
            // 
            buttonCancel.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            buttonCancel.Font = new System.Drawing.Font("Segoe UI", 10F);
            buttonCancel.Location = new System.Drawing.Point(0, 0);
            buttonCancel.Margin = new System.Windows.Forms.Padding(0, 0, 4, 0);
            buttonCancel.Name = "buttonCancel";
            buttonCancel.Size = new System.Drawing.Size(146, 40);
            buttonCancel.TabIndex = 0;
            buttonCancel.Text = "Cancel";
            buttonCancel.UseVisualStyleBackColor = true;
            buttonCancel.Click += buttonCancel_Click;
            // 
            // buttonCheckAll
            // 
            buttonCheckAll.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            buttonCheckAll.Font = new System.Drawing.Font("Segoe UI", 10F);
            buttonCheckAll.Location = new System.Drawing.Point(154, 0);
            buttonCheckAll.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            buttonCheckAll.Name = "buttonCheckAll";
            buttonCheckAll.Size = new System.Drawing.Size(142, 40);
            buttonCheckAll.TabIndex = 1;
            buttonCheckAll.Text = "Check All";
            buttonCheckAll.UseVisualStyleBackColor = true;
            buttonCheckAll.Click += buttonCheckAll_Click;
            // 
            // buttonUncheckAll
            // 
            buttonUncheckAll.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            buttonUncheckAll.Font = new System.Drawing.Font("Segoe UI", 10F);
            buttonUncheckAll.Location = new System.Drawing.Point(304, 0);
            buttonUncheckAll.Margin = new System.Windows.Forms.Padding(4, 0, 0, 0);
            buttonUncheckAll.Name = "buttonUncheckAll";
            buttonUncheckAll.Size = new System.Drawing.Size(148, 40);
            buttonUncheckAll.TabIndex = 2;
            buttonUncheckAll.Text = " Uncheck All";
            buttonUncheckAll.UseVisualStyleBackColor = true;
            buttonUncheckAll.Click += buttonUncheckAll_Click;
            // 
            // buttonOk
            // 
            buttonOk.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            buttonOk.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, 0);
            buttonOk.Location = new System.Drawing.Point(16, 505);
            buttonOk.Margin = new System.Windows.Forms.Padding(16, 4, 16, 4);
            buttonOk.Name = "buttonOk";
            buttonOk.Size = new System.Drawing.Size(452, 52);
            buttonOk.TabIndex = 3;
            buttonOk.Text = "OK";
            buttonOk.UseVisualStyleBackColor = true;
            buttonOk.Click += buttonOk_Click;
            // 
            // BaseListView
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(484, 561);
            Controls.Add(tableLayoutPanel1);
            MaximizeBox = false;
            MinimizeBox = false;
            MinimumSize = new System.Drawing.Size(500, 600);
            Name = "BaseListView";
            Text = "Select object from object list";
            tableLayoutPanel1.ResumeLayout(false);
            tableLayoutPanel1.PerformLayout();
            tableLayoutPanel2.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel2;
        private System.Windows.Forms.TextBox textBoxFilter;
        private System.Windows.Forms.Button buttonCancel;
        private System.Windows.Forms.Button buttonCheckAll;
        private System.Windows.Forms.Button buttonUncheckAll;
        private System.Windows.Forms.ListView listView;
        private System.Windows.Forms.Button buttonOk;
    }
}
```


### `Custom.cs`
```C#
// System
using System.Collections.Generic;
using System.Windows.Controls.Primitives;
using System.Windows.Forms;
// Autodesk
using Autodesk.Revit.UI;

namespace UKON.Forms
{
    public static class Custom
    {
	    #region Message and Variants
	    
	    #region Select From Dropdown
	    

// Updated part

        #region Create a New form result with single or multi Select options
        
        public static FormResult SelectFromList(List<string> keys, List<object> values, string title = null, bool multiSelect = true)
        {
            // Create a new form result
            var formResult = new FormResult(isValid: false);
			
            // Default Title
            title ??= multiSelect ? "Select Object(s) from list:" : "Select an object from the list";
			
            // Process the Form
            using (var form = new Base.BaseListView(keys, values, title, multiSelect))
            {
                if (form.ShowDialog()== DialogResult.OK)
                {
                    // Catch multi or single select
                    if (multiSelect)
                    {
                        formResult.Validate(form.Tag as List<object>);
                    }
                    else
                    {
                        formResult.Validate(form.Tag as object);
                    }
                }
            }
			
            return formResult;
        }
        #endregion
	}



	#region FormResult Class
}

```




{{< /collapse >}}