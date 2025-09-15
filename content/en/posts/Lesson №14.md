+++
title = "C# + Revit API: Lesson 14 - Dropdown Window Forms"
date = 2025-09-08T00:00:00+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250911143814.png"
cover.alt = "Dropdown (Win)Forms in C# + Revit API"
+++
### YouTube: [Aussie BIM Guru](https://www.youtube.com/watch?v=H-j3wX2o7Jk)

# `Dropdown` Form Anatomy

![Pasted image 20250911143814.png](</images/Pasted image 20250911143814.png>)

> The form will center around interacting with a `ComboBox` component, which is the proper name for what are abstracting as a `Dropdown`

# Keys & Values
- **WinForms rely on “code-behind” logic** — we write code to define how the form behaves and responds to user actions.
- **WPF leans on data bindings** for this, but for now, we’ll focus on working directly with objects behind the form and passing their results forward.
- **Keys vs. Values**: We’ll maintain a parallel list of keys and values. The user sees the “key” in the dropdown, while the actual “value” (in this case, an object) is passed and handled in the background.
  
## Examples

### 🔑 Example 1: Keys & Values in Dynamo Terms

Imagine you have a list of element names `keys` and a list of Revit elements `values`:
- In Dynamo you’d use nodes like:
	- `List.Create` → Create a list of names ["Door A", "Door B", "Door C"].
	- `AllElementsOfCategory` → Get actual Revit door elements (values).
	- `List.Transpose` → Align these lists side by side.
	- `List.GetItemAtIndex` → When a user picks “Door B” (`key`), you retrieve its corresponding element (`value`).

In C#/WinForms, the dropdown would display the names, but behind the scenes, your selected `ComboBox.SelectedItem` maps back to the door element object.

---

### 🔑 Example 2: Simple Real-World Analogy
- Think of a dropdown of countries:
	- User sees: [“Canada,” “USA,” “Japan”] (`keys`).
	- Behind the scenes: `CA`, `US`, `JP` (`values`) are passed to your system.
	- When the user selects [“Japan”], the program actually gets `JP`.

> This pattern is everywhere: display something readable, pass something actionable.


# Homework
- Create a method to dynamically set `icons` to the form
	- Reason: if you connect an `icon` from `resource` folder, it's not going to be connected to all your `forms`.
	- So the plan is to set up an `icon` outside of the form, so that you could assign one icon to multiple forms.
	- You need 16x16 `ico` file (icon file)
- Create the `Windows Form` using the Visual Editor.
- Create the base form `method` to call it and process the outcomes.
- `Extend` the revision class - to name our revisions.
- Customize the base `form` into a customized form to select our revisions.

# Solution
## `Project Solution`
```bash
Solution
|-> guRoo.csproj  # Update
	|-> Dependencies
	|-> Properties
	|-> Commands
		|-> Cmds_PushButton.cs  # Update the Class to use the New Form
	|-> Forms
		|-> Custom.cs  # Update with a new "private method" 
		|-> Bases  # Create a New Folder
			|-> Winforms # Create a New Folder
				|-> BaseDropdown.cs  # Add a Form (Windows Form) & Update the code 
					|-> BaseDropdown.Designer.cs

	|-> Extensions
		|-> Document_Ext.cs  # Update the Extension Class
		|-> Revision_Ext.cs  # Add a New Extension Class
	|-> General 
	|-> Models
	|-> Resources
		|-> Icons16
			|-> IconList16.ico  # Add the icon (Download below)
	|-> Services
	|-> Utilities
		|-> File_Utils.cs  # Add a New Class
	|-> Views
	|-> Application.cs  
	|-> Host.cs         
	|-> guRoo.addin
``` 

  >  [Download IconList16.ico](/images/IconList16.ico)
### Here is a quick overview to set an `icon` on the `form`
```bash
|-> Resources
	|-> Icons16
		|-> IconList16.ico  # Place this icon file in the Resources/Icons16 folder

|-> File_Utils.cs # Add a utility method to set the form icon
	|-> public static void setFormIcon(Form form, string iconPath = null)

|-> BaseDropdown.cs # Call the utility method to apply the icon to this form
	|-> gFil.SetFormIcon(this);
```

## Create a Dropdown Window Form

{{< collapse title="Show/Hide Code" >}}

### `guRoo.csproj`
```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <UseWPF>true</UseWPF>
		<UseWindowsForms>true</UseWindowsForms>  <!-- Add this -->
        <LangVersion>latest</LangVersion>
        <PlatformTarget>x64</PlatformTarget>
        <ImplicitUsings>false</ImplicitUsings>  <!-- Change this -->
        <DeployRevitAddin>true</DeployRevitAddin>
        <EnableDynamicLoading>true</EnableDynamicLoading>
        <Configurations>Debug R21;Debug R22;Debug R23;Debug R24;Debug R25;Debug R26</Configurations>
        <Configurations>$(Configurations);Release R21;Release R22;Release R23;Release R24;Release R25;Release R26</Configurations>
    </PropertyGroup>



    <!-- Build configuration -->
    <!-- https://github.com/Nice3point/Revit.Build.Tasks -->
    <PropertyGroup>
        <IsRepackable>true</IsRepackable>
        <DeployRevitAddin>true</DeployRevitAddin>
    </PropertyGroup>
    <ItemGroup>
      <None Remove="Resources\Icons16\*.png" />
		<None Remove="Resources\Icons16\*.ico" />  <!-- Add this -->
      <None Remove="Resources\Icons32\*.png" />
    </ItemGroup>
    <ItemGroup>
      <EmbeddedResource Include="Resources\Icons16\*.png" />
		<EmbeddedResource Include="Resources\Icons16\*.ico" />  <!-- Add this -->
      <EmbeddedResource Include="Resources\Icons32\*.png" />
    </ItemGroup>

```

### What is `guRoo.csproj`:
- `guRoo.csproj` is your **project file** for a C# project (in this case, your Revit add-in). It tells MSBuild how to compile your code, what frameworks and SDKs you’re using, and what files or resources to include.

### What did we change in our `.csproj`:
1. **Enabled `WPF` and `Windows Forms` support** – so you can use WinForms and WPF UI in the same project.
    
2. **Set `ImplicitUsings` to `false`** – meaning you’ll write all using statements explicitly, avoiding hidden imports.
    
3. **Configured multiple build targets** (`Debug R21`, `Release R26`, etc.) – lets you build for multiple Revit versions.
    
4. **Marked `.ico` icons as embedded resources** – ensures icons are compiled into your assembly for use in the UI.
    
5. **Enabled Revit add-in deployment and packaging** – via the `Revit.Build.Tasks` settings.

So basically, this `.csproj` is now configured to:
- Build a `multi-version` Revit add-in,
- Use both `WPF` and `WinForms`,
- Include your `icons` as embedded `resources`,
- Give you more control over namespaces (`ImplicitUsings=false`).



### `File_Utils.cs`
```C#
using System.Drawing;
using System.IO;
using Form = System.Windows.Forms.Form;

// Associated to the utility namespace
namespace guRoo.Utilities
{
	public static class File_Utils
	{
		public static void setFormIcon(Form form, string iconPath = null)
		{
			iconPath ??= "guRoo.Resources.Icon16.IconList16.ico";
			
			using (Stream stream = Globals.Assembly.GetManifestResourceStream(iconPath))
			{
				if (stream is not null)
				{
					form.Icon = new Icon(stream);
				}
			}
		}
	}
}
```

---
### `BaseDropdown.cs`
```C#
// System
using System;
using System.Collections.Generic;
using System.Windows.Forms;
using Form = System.Windows.Forms.Form;

// guRoo
using gFil = guRoo.Utilities.File_Utils;

namespace guRoo.Forms.Base
{
    public partial class BaseDropdown : Form
    {
        // Form properties
        private List<string> Keys;
        private List<object> Values;
        private int DefaultIndex;
		
        public BaseDropdown(List<string> keys, List<object> values, string title, string message, int defaultIndex = -1)
        {
            InitializeComponent();
            gFil.SetFormIcon(this);
			
            this.Keys = keys;
            this.Values = values;
            this.DefaultIndex = defaultIndex;
            this.Text = title;
            this.labelMessage.Text = message;
			
            this.DialogResult = DialogResult.Cancel;
            this.Tag = null;
			
            PopulateComboBox();
        }
		
        private void PopulateComboBox()
        {
            this.comboBox.Items.Clear();
			
            foreach (var key in this.Keys)
            {
                this.comboBox.Items.Add(key);
            }
			
            if (this.DefaultIndex >= 0 && this.DefaultIndex < this.comboBox.Items.Count)
            {
                this.comboBox.SelectedIndex = this.DefaultIndex;
            }
            else
            {
                try
                {
                    this.comboBox.SelectedIndex = 0;
                }
                catch
                {
                    this.comboBox.SelectedIndex = -1;
                }
            }
        }
        
        
        private void buttonOk_Click(object sender, EventArgs e)
        {
            if (this.comboBox.SelectedIndex >= 0)
            {
                var selectedValue = this.Values[this.comboBox.SelectedIndex];
				
                this.Tag = selectedValue;
                this.DialogResult = DialogResult.OK;
            }
        }
        
        
        private void buttonCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }
		
        private void labelMessage_Click(object sender, EventArgs e)
        {
			
        }
    }
}
```

### `BaseDropdown.Designer.cs`

![Pasted image 20250912174447.png](</images/Pasted image 20250912174447.png>)

> You can construct it visually as shown in the screenshot above. Or just paste this code into the Code Editor - right click the `BaseDropdown.cs` and click on `View Code` (or just press `F7`). 
  
```C#
namespace guRoo.Forms.Base
{
    partial class BaseDropdown
    {
        /// <summary>
        /// Required designer v ariable.
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
            buttonOk = new System.Windows.Forms.Button();
            buttonCancel = new System.Windows.Forms.Button();
            comboBox = new System.Windows.Forms.ComboBox();
            labelMessage = new System.Windows.Forms.Label();
            tableLayoutPanel1.SuspendLayout();
            tableLayoutPanel2.SuspendLayout();
            SuspendLayout();
            // 
            // tableLayoutPanel1
            // 
            tableLayoutPanel1.ColumnCount = 1;
            tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            tableLayoutPanel1.Controls.Add(tableLayoutPanel2, 0, 2);
            tableLayoutPanel1.Controls.Add(comboBox, 0, 1);
            tableLayoutPanel1.Controls.Add(labelMessage, 0, 0);
            tableLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
            tableLayoutPanel1.Location = new System.Drawing.Point(0, 0);
            tableLayoutPanel1.Margin = new System.Windows.Forms.Padding(0);
            tableLayoutPanel1.Name = "tableLayoutPanel1";
            tableLayoutPanel1.RowCount = 3;
            tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 60F));
            tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 60F));
            tableLayoutPanel1.Size = new System.Drawing.Size(434, 186);
            tableLayoutPanel1.TabIndex = 0;
            tableLayoutPanel1.Paint += tableLayoutPanel1_Paint;
            // 
            // tableLayoutPanel2
            // 
            tableLayoutPanel2.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            tableLayoutPanel2.ColumnCount = 2;
            tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            tableLayoutPanel2.Controls.Add(buttonOk, 0, 0);
            tableLayoutPanel2.Controls.Add(buttonCancel, 1, 0);
            tableLayoutPanel2.Location = new System.Drawing.Point(0, 126);
            tableLayoutPanel2.Margin = new System.Windows.Forms.Padding(0);
            tableLayoutPanel2.Name = "tableLayoutPanel2";
            tableLayoutPanel2.RowCount = 1;
            tableLayoutPanel2.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            tableLayoutPanel2.Size = new System.Drawing.Size(434, 60);
            tableLayoutPanel2.TabIndex = 0;
            // 
            // buttonOk
            // 
            buttonOk.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            buttonOk.Font = new System.Drawing.Font("Segoe UI", 12F);
            buttonOk.Location = new System.Drawing.Point(8, 0);
            buttonOk.Margin = new System.Windows.Forms.Padding(8, 0, 4, 0);
            buttonOk.Name = "buttonOk";
            buttonOk.Size = new System.Drawing.Size(205, 60);
            buttonOk.TabIndex = 1;
            buttonOk.Text = "OK";
            buttonOk.UseVisualStyleBackColor = true;
            buttonOk.Click += buttonOk_Click;
            // 
            // buttonCancel
            // 
            buttonCancel.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            buttonCancel.Font = new System.Drawing.Font("Segoe UI", 12F);
            buttonCancel.Location = new System.Drawing.Point(225, 0);
            buttonCancel.Margin = new System.Windows.Forms.Padding(8, 0, 4, 0);
            buttonCancel.Name = "buttonCancel";
            buttonCancel.Size = new System.Drawing.Size(205, 60);
            buttonCancel.TabIndex = 0;
            buttonCancel.Text = "CANCEL";
            buttonCancel.UseVisualStyleBackColor = true;
            buttonCancel.Click += buttonCancel_Click;
            // 
            // comboBox
            // 
            comboBox.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            comboBox.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, 0);
            comboBox.FormattingEnabled = true;
            comboBox.Location = new System.Drawing.Point(16, 64);
            comboBox.Margin = new System.Windows.Forms.Padding(16, 4, 16, 4);
            comboBox.Name = "comboBox";
            comboBox.Size = new System.Drawing.Size(402, 29);
            comboBox.TabIndex = 2;
            // 
            // labelMessage
            // 
            labelMessage.Anchor = System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right;
            labelMessage.AutoSize = true;
            labelMessage.Font = new System.Drawing.Font("Segoe UI", 16F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, 0);
            labelMessage.Location = new System.Drawing.Point(4, 4);
            labelMessage.Margin = new System.Windows.Forms.Padding(4);
            labelMessage.Name = "labelMessage";
            labelMessage.Size = new System.Drawing.Size(426, 52);
            labelMessage.TabIndex = 1;
            labelMessage.Text = "Select an object";
            labelMessage.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            labelMessage.Click += labelMessage_Click;
            // 
            // BaseDropdown
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(434, 186);
            Controls.Add(tableLayoutPanel1);
            Margin = new System.Windows.Forms.Padding(2);
            MaximizeBox = false;
            MinimizeBox = false;
            MinimumSize = new System.Drawing.Size(450, 225);
            Name = "BaseDropdown";
            StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            Text = "Select an object";
            tableLayoutPanel1.ResumeLayout(false);
            tableLayoutPanel1.PerformLayout();
            tableLayoutPanel2.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel2;
        private System.Windows.Forms.Button buttonCancel;
        private System.Windows.Forms.Button buttonOk;
        private System.Windows.Forms.ComboBox comboBox;
        private System.Windows.Forms.Label labelMessage;
    }
}
```

---
### `Custom.cs`
```C#
// System
using System.Collections.Generic;
using System.Windows.Forms;
// Autodesk
using Autodesk.Revit.UI;

namespace guRoo.Forms
{
    public static class Custom
    {
		#region Message and variants // From earlier lessons
	    
	    #region Select From Dropdown // New Method
	    
        public static FormResult SelectFromDropdown(List<string> keys, List<object> values, string title = null, string message = null, int defaultIndex = -1)
        {
            // Make a new formResult
            var formResult = new FormResult(isValid: false);
            
            // Set default values
            title ??= "Select from dropdown";
            message ??= "Select an object from the dropdown";
            
            // Process the from
            using (var form = new Base.BaseDropdown(keys, values, title, message, defaultIndex))
            {
                if (form.ShowDialog() == DialogResult.OK)
                {
                    formResult.Validate(form.Tag as object);
                }
            }
            
            return formResult;
        }
    }
    
	#endregion
    
    
    #region FormResult class // From earlier lessons
}
```
{{< /collapse >}}

---

## Extend Revision Class to Name Revisions
{{< collapse title="Show/Hide Code" >}}
### `Revision_Ext.cs`
```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guRoo.Extensions
{
    public static class Revision_Ext
    {
        public static string Ext_ToRevisionKey(this Revision  revision, bool includeId = false)
        {
            if (revision == null) { return "Invalid Revision "; }

            if (includeId)
            {
                return $"{revision.SequenceNumber}: {revision.RevisionDate} - {revision.Description} [{revision.Id.ToString()}]";
            }
            else
            {
                return $"{revision.SequenceNumber}: {revision.RevisionDate} - {revision.Description}";
            }
        }
    }
}

```


### `Document_Ext.cs`
```C#
// Autodesk
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using View = Autodesk.Revit.DB.View; // to remove ambiguity 

// System
using System;
using System.Collections.Generic;
using System.Linq;

// Custom
using guRoo.Models.AutoSection.BodySection;
using gFrm = guRoo.Forms;

namespace guRoo.Extensions
{
    public static class Document_Ext
    {
        #region Collector constructors // From earlier lessons

        #region Specific collectors // From earlier lessons

        #region Collector based forms
		
        /// <summary>
        /// Select a revision from the document.
        /// </summary>
        /// <param name="doc">A Revit document (extended).</param>
        /// <param name="title">The form title (optional).</param>
        /// <param name="message">The form message (optional).</param>
        /// <param name="sorted">Sort the Revisions by sequence.</param>
        /// <returns>A FormResult object.</returns>
        public static gFrm.FormResult Ext_SelectRevision(this Document doc, string title = null, string message = null, bool sorted = true)
        {
            // Default values
            title ??= "Select a revision";
            message ??= "Select a revision from below:";
			
            // Get revisions
            var revisions = doc.Ext_GetRevisions(sorted);
			
            // Process into keys and values
            var keys = revisions.Select(r => r.Ext_ToRevisionKey()).ToList();
            var values = revisions.Cast<object>().ToList();
			
            // Return the form outcome
            return gFrm.Custom.SelectFromDropdown(keys, values, title, message);
        }
		
        #endregion
        
    }
}

```
{{< /collapse >}}

---

## Customize the base `form` into a customized form to select our revisions
{{< collapse title="Show/Hide Code" >}}
### `Cmds_PushButton.cs`
```C#
 // Autodesk
using Autodesk.Revit.Attributes;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;

//guRoo
using guRoo.Extensions;
using gFrm = guRoo.Forms;


// Associate with PushButton Commands
namespace guRoo.Commands.General
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
            var (uiApp, uiDoc, doc) = CommandData.Ext_GetRevitContext();
			
            // Select a revision
            var revisionResult = doc.Ext_SelectRevision();
            if (revisionResult.Cancelled) { return Result.Cancelled; }
            var selectedRevision = revisionResult.Object as Revision;
			
            gFrm.Custom.Message(message: selectedRevision.Ext_ToRevisionKey());
			
            return Result.Succeeded;
        }
    }
}

```
{{< /collapse >}}