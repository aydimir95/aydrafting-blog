+++
title = "C# + Revit API: Case Study №2 [Dimension Automation]"
date = 2025-01-04T11:43:01+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
cover.image = ""
cover.alt = ""
+++

# Dimension Automation

Here is a plan from the client:

![Pasted image 20250829161635.png](</images/Pasted image 20250829161635.png>)

What have we done about the script already?
## We have 2 options
1. Option 1 - Marker Based: Creates marker lines and dimensions between them.
2. Option 2 - Aligned Chained: Supposed to create proper dimensions using Chain B logic (A to B and A to C) with geometric references.
3. UI Controls: Direction and BoundingBoxEdge toggles work in real-time

But, it's not doing what it supposed to do, that's why I need to dissect it here.

# `Project Solution`
```bash
Solution
|-> ViewOnSheets2025
	|-> Dependencies
	|-> Properties
	|-> Commands
		|-> Cmd_AutoDim.cs  # New AutoDim Button
		|-> Cmd_AutoSect.cs
		|-> AutoSection
		|-> General
	|-> Extensions
		|-> AutoSection
		|-> Document_Ext.cs
		|-> Element_Ext.cs
		|-> PulldownButton_Ext.cs
		|-> RibbonPanel_Ext.cs
		|-> UIControlledApplication_Ext.cs
		|-> ViewSection_Ext.cs
	|-> General 
		|-> Globals.cs
	|-> Models
		|-> AutoSection
	|-> Resources
		|-> Icons
	|-> Services
		|-> AutoSection
		|-> SectionCreationService.cs
	|-> Utilities
		|-> Geometry_Utils.cs
		|-> Ribbon_Utils.cs  # Updated to add AutoDim Icons
	|-> Views
		|-> AutoSectScenarioWindow.xaml
		|-> ReferencePlaneSelectionWindow.xaml
		|-> RevitSectionCreatorWindow.xaml
	|-> Application.cs  
	|-> Host.cs         
	|-> UKON.addin
```

## `Cmd_AutoDim.cs` Architecture
```text
🖱️  User Clicks Button
        │
        ▼
🎛️  Cmd_AutoDim.cs
    └─ [Entry point / shows UI]
        │
        ▼
🖼️  AutoDimensionWindow.xaml + AutoDimensionViewModel.cs
    └─ [User configuration UI]
        │
        ▼
🧩  AutoDimensionSettings.cs
    └─ B[ridge between UI & backend]
        │
        ▼
⚙️  AutoDimensionService.cs
    └─ [Coordinates workflow]
        │
        ▼
📐  MarkerBasedDimensionService.cs
    OR
📐  AlignedChainedDimensionService.cs
    └─ [Performs dimension creation]
        │
        ▼
🗄️  Document_Ext.cs
    └─ [Data helpers (FilteredElementCollectors, etc.)]
        │
        ▼
🔢  DimensionGeometryService.cs
    └─ [Math/geometry logic]
        │
        ▼
🏗️  Revit Creates Dimensions!
```

## `Cmd_AutoDim.cs`
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System;
using UKON.Extensions;
using UKON.Forms;
using UKON.Services.AutoDimension;
using UKON.Views;

namespace UKON.Commands
{
    /// <summary>
    /// Команда автоматического создания размеров
    /// </summary>
    [Transaction(TransactionMode.Manual)]
    public class Cmd_AutoDim : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            try
            {
                // Получаем основные объекты приложения используя расширение
                var (uiApp, uiDoc, doc) = commandData.Ext_GetRevitContext();

                // Проверяем наличие активного документа
                if (doc == null)
                {
                    Custom.Error("Нет активного документа");
                    return Result.Cancelled;
                }

                // Показываем окно настроек
                var window = new AutoDimensionWindow(doc);
                var dialogResult = window.ShowDialog();

                if (dialogResult != true || window.Settings == null)
                {
                    return Result.Cancelled;
                }

                // Создаем сервис для обработки размеров
                var autoDimensionService = new AutoDimensionService(doc);

                // Выполняем автоматическое создание размеров
                var success = autoDimensionService.ProcessAutoDimension(window.Settings);

                if (success)
                {
                    Custom.Completed("Автоматические размеры успешно созданы");
                    return Result.Succeeded;
                }
                else
                {
                    Custom.Error("Не удалось создать размеры. Проверьте настройки и выбранные элементы.");
                    return Result.Failed;
                }
            }
            catch (OperationCanceledException)
            {
                // Пользователь отменил операцию
                return Result.Cancelled;
            }
            catch (Exception ex)
            {
                // Логируем ошибку и показываем пользователю
                message = $"Произошла ошибка при создании размеров: {ex.Message}";
                Custom.Error(message);
                return Result.Failed;
            }
        }
    }
}
```

## `AutoDimensionWindow.xaml`
```xml
<Window x:Class="UKON.Views.AutoDimensionWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Автоматические размеры" Height="550" Width="600"
        ResizeMode="CanResizeWithGrip"
        MinWidth="600" MinHeight="550"
        WindowStartupLocation="CenterScreen">

    <Grid Margin="10">
        <Grid.RowDefinitions>
            <!-- Dimension Strategy Selection -->
            <RowDefinition Height="Auto"/>
            <!-- Direction and Bounding Box Edge Selection -->
            <RowDefinition Height="Auto"/>
            <!-- Section Views: Search and List -->
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <!-- Family Types: Search and List -->
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <!-- Dimension Type and Offset -->
            <RowDefinition Height="Auto"/>
            <!-- OK/Cancel Buttons -->
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <!-- Dimension Strategy Selection -->
        <StackPanel Grid.Row="0" Orientation="Horizontal" Margin="0,0,0,10">
            <TextBlock Text="Стратегия размеров:" VerticalAlignment="Center" Width="120"/>
            <ComboBox x:Name="comboBoxStrategy" Width="200" DisplayMemberPath="DisplayName" SelectedValuePath="Strategy" SelectedValue="{Binding SelectedStrategy, Mode=TwoWay}"/>
        </StackPanel>
        
        <!-- Direction and Bounding Box Edge Selection -->
        <StackPanel Grid.Row="1" Orientation="Horizontal" Margin="0,0,0,10">
            <TextBlock Text="Направление:" VerticalAlignment="Center" Width="120"/>
            <ComboBox x:Name="comboBoxDirection" Width="120" DisplayMemberPath="DisplayName" SelectedValuePath="Direction" SelectedValue="{Binding SelectedDirection, Mode=TwoWay}" SelectionChanged="comboBoxDirection_SelectionChanged"/>
            <TextBlock Text="Край элемента:" VerticalAlignment="Center" Width="100" Margin="20,0,0,0"/>
            <ComboBox x:Name="comboBoxBoundingBoxEdge" Width="120" DisplayMemberPath="DisplayName" SelectedValuePath="Edge" SelectedValue="{Binding SelectedBoundingBoxEdge, Mode=TwoWay}" ItemsSource="{Binding AvailableBoundingBoxEdges}"/>
        </StackPanel>

        <!-- Section Views Search -->
        <StackPanel Grid.Row="2" Orientation="Horizontal" Margin="0,0,0,5">
            <TextBlock Text="Поиск вида разреза:" VerticalAlignment="Center" Width="150"/>
            <TextBox x:Name="searchSectionViewsTextBox" Width="250" TextChanged="searchSectionViewsTextBox_TextChanged"/>
        </StackPanel>
        <!-- Section Views ListBox -->
        <ListBox x:Name="listBoxSectionViews" Grid.Row="3" SelectionMode="Extended" />

        <!-- Family Types Search -->
        <StackPanel Grid.Row="4" Orientation="Horizontal" Margin="0,10,0,5">
            <TextBlock Text="Выберите типы семейств:" VerticalAlignment="Center" Width="150"/>
            <TextBox x:Name="searchFamiliesTextBox" Width="250" TextChanged="searchFamiliesTextBox_TextChanged"/>
        </StackPanel>
        <!-- Family Types ListBox -->
        <ListBox x:Name="listBoxFamilies" Grid.Row="5" SelectionMode="Extended" />

        <!-- Dimension Type and Offset -->
        <StackPanel Grid.Row="6" Orientation="Horizontal" Margin="0,10,0,10">
            <TextBlock Text="Тип размерения:" VerticalAlignment="Center" Margin="0,0,10,0"/>
            <ComboBox x:Name="comboBoxDimTypes" Width="150" Margin="0,0,20,0"/>
            <TextBlock Text="Смещение (м):" VerticalAlignment="Center" Margin="0,0,10,0"/>
            <TextBox x:Name="textBoxOffset" Width="100"/>
        </StackPanel>

        <!-- OK/Cancel Buttons -->
        <StackPanel Grid.Row="7" Orientation="Horizontal" HorizontalAlignment="Right">
            <Button x:Name="buttonOK" Content="ОК" Width="80" Margin="0,10,10,0" IsDefault="True" Click="buttonOK_Click"/>
            <Button x:Name="buttonCancel" Content="Отмена" Width="80" Margin="0,10,0,0" IsCancel="True" Click="buttonCancel_Click"/>
        </StackPanel>
    </Grid>
</Window>

```

## `AutoDimensionWindow.xaml.cs`
```C#
using Autodesk.Revit.DB;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using UKON.Forms;
using UKON.Models.AutoDimension;

namespace UKON.Views
{
    public partial class AutoDimensionWindow : Window
    {
        /// <summary>
        /// Настройки автоматических размеров
        /// </summary>
        public AutoDimensionSettings Settings { get; private set; }

        private readonly AutoDimensionViewModel _viewModel;

        public AutoDimensionWindow(Document document)
        {
            InitializeComponent();
            _viewModel = new AutoDimensionViewModel(document);
            DataContext = _viewModel;
            
            УстановитьПривязкуКоллекций();
        }

        /// <summary>
        /// Устанавливает привязку коллекций к UI элементам
        /// </summary>
        private void УстановитьПривязкуКоллекций()
        {
            // Привязка стратегий размеров (теперь через XAML binding, но устанавливаем ItemsSource)
            comboBoxStrategy.ItemsSource = _viewModel.AvailableStrategies;
            
            // Привязка направлений (теперь через XAML binding, но устанавливаем ItemsSource)
            comboBoxDirection.ItemsSource = _viewModel.AvailableDirections;
            
            // Привязка существующих элементов (ItemsSource для этих остается в коде)
            listBoxSectionViews.ItemsSource = _viewModel.FilteredSectionViews;
            listBoxSectionViews.DisplayMemberPath = "Name";
            
            listBoxFamilies.ItemsSource = _viewModel.FilteredFamilySymbols;
            listBoxFamilies.DisplayMemberPath = "Name";
            
            comboBoxDimTypes.ItemsSource = _viewModel.DimensionTypes;
            comboBoxDimTypes.DisplayMemberPath = "Name";
            
            textBoxOffset.Text = _viewModel.OffsetValue.ToString("F2");
        }

        /// <summary>
        /// Фильтрация видов разрезов при вводе пользователя
        /// </summary>
        private void searchSectionViewsTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            _viewModel.SectionViewSearchText = (sender as TextBox)?.Text ?? string.Empty;
        }

        /// <summary>
        /// Фильтрация типов семейств при вводе пользователя
        /// </summary>
        private void searchFamiliesTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            _viewModel.FamilySymbolSearchText = (sender as TextBox)?.Text ?? string.Empty;
        }

        /// <summary>
        /// Обработчик изменения направления размеров
        /// </summary>
        private void comboBoxDirection_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Поскольку теперь у нас есть две-сторонняя привязка, ViewModel.SelectedDirection уже обновлен
            // Нам нужно только обновить привязку краев, что произойдет автоматически через ObservableCollection
            // Но ItemsSource остается через биндинг в XAML, поэтому ничего дополнительно делать не нужно
        }

        /// <summary>
        /// Обработчик нажатия кнопки ОК
        /// </summary>
        private void buttonOK_Click(object sender, RoutedEventArgs e)
        {
            // Обновляем выбор из UI (не привязанные к ViewModel элементы)
            _viewModel.SelectedSectionViews = listBoxSectionViews.SelectedItems.Cast<ViewSection>().ToList();
            _viewModel.SelectedFamilySymbols = listBoxFamilies.SelectedItems.Cast<FamilySymbol>().ToList();
            _viewModel.SelectedDimensionType = comboBoxDimTypes.SelectedItem as DimensionType;

            // Strategy, Direction, BoundingBoxEdge уже обновлены через two-way binding

            // Проверяем смещение
            if (!double.TryParse(textBoxOffset.Text, out double offset))
            {
                Custom.Error("Введите корректное числовое значение для смещения.");
                return;
            }
            _viewModel.OffsetValue = offset;

            // Проверяем настройки
            var (isValid, errorMessage) = _viewModel.ValidateSettings();
            if (!isValid)
            {
                Custom.Error(errorMessage);
                return;
            }

            Settings = _viewModel.CreateSettings();
            DialogResult = true;
            Close();
        }

        /// <summary>
        /// Обработчик нажатия кнопки Отмена
        /// </summary>
        private void buttonCancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}
```

## `AutoDimensionViewModel.cs`
```C#
using Autodesk.Revit.DB;
using CommunityToolkit.Mvvm.ComponentModel;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using UKON.Extensions;
using UKON.Models.AutoDimension;

namespace UKON.Views
{
    /// <summary>
    /// ViewModel для окна автоматических размеров
    /// </summary>
    public partial class AutoDimensionViewModel : ObservableObject
    {
        private readonly Document _document;

        [ObservableProperty]
        private ObservableCollection<ViewSection> _allSectionViews = new();

        [ObservableProperty]
        private ObservableCollection<ViewSection> _filteredSectionViews = new();

        [ObservableProperty]
        private ObservableCollection<FamilySymbol> _allFamilySymbols = new();

        [ObservableProperty]
        private ObservableCollection<FamilySymbol> _filteredFamilySymbols = new();

        [ObservableProperty]
        private ObservableCollection<DimensionType> _dimensionTypes = new();

        [ObservableProperty]
        private string _sectionViewSearchText = string.Empty;

        [ObservableProperty]
        private string _familySymbolSearchText = string.Empty;

        [ObservableProperty]
        private double _offsetValue = 1.0;

        [ObservableProperty]
        private DimensionType? _selectedDimensionType;

        [ObservableProperty]
        private DimensionStrategy _selectedStrategy = DimensionStrategy.MarkerBased;

        [ObservableProperty]
        private DimensionDirection _selectedDirection = DimensionDirection.Horizontal;

        [ObservableProperty]
        private BoundingBoxEdge _selectedBoundingBoxEdge = BoundingBoxEdge.Center;

        /// <summary>
        /// Доступные стратегии размеров
        /// </summary>
        public List<DimensionStrategyItem> AvailableStrategies { get; } = new()
        {
            new DimensionStrategyItem { Strategy = DimensionStrategy.MarkerBased, DisplayName = "Размеры через маркерные линии" },
            new DimensionStrategyItem { Strategy = DimensionStrategy.AlignedChained, DisplayName = "Выровненные цепочечные размеры" }
        };

        /// <summary>
        /// Доступные направления размеров
        /// </summary>
        public List<DimensionDirectionItem> AvailableDirections { get; } = new()
        {
            new DimensionDirectionItem { Direction = DimensionDirection.Horizontal, DisplayName = "Горизонтальное" },
            new DimensionDirectionItem { Direction = DimensionDirection.Vertical, DisplayName = "Вертикальное" }
        };

        /// <summary>
        /// Доступные края ограничивающего параллелепипеда (зависит от направления)
        /// </summary>
        [ObservableProperty]
        private ObservableCollection<BoundingBoxEdgeItem> _availableBoundingBoxEdges = new();

        /// <summary>
        /// Выбранные виды разрезов
        /// </summary>
        public List<ViewSection> SelectedSectionViews { get; set; } = new();

        /// <summary>
        /// Выбранные типы семейств
        /// </summary>
        public List<FamilySymbol> SelectedFamilySymbols { get; set; } = new();

        public AutoDimensionViewModel(Document document)
        {
            _document = document;
            LoadData();
        }

        private void LoadData()
        {
            // Загружаем виды разрезов используя расширение Document
            var sections = _document.Ext_GetSectionViewsForDimensioning();
            AllSectionViews = new ObservableCollection<ViewSection>(sections);
            FilteredSectionViews = new ObservableCollection<ViewSection>(sections);

            // Загружаем типы семейств используя расширение Document
            var familySymbols = _document.Ext_GetFamilySymbolsForDimensioning();
            AllFamilySymbols = new ObservableCollection<FamilySymbol>(familySymbols);
            FilteredFamilySymbols = new ObservableCollection<FamilySymbol>(familySymbols);

            // Загружаем типы размеров используя расширение Document
            var dimensionTypes = _document.Ext_GetDimensionTypes();
            DimensionTypes = new ObservableCollection<DimensionType>(dimensionTypes);
            SelectedDimensionType = dimensionTypes.FirstOrDefault();

            // Загружаем края ограничивающего параллелепипеда для текущего направления
            UpdateAvailableBoundingBoxEdges();
        }

        partial void OnSectionViewSearchTextChanged(string value)
        {
            FilterSectionViews(value);
        }

        partial void OnFamilySymbolSearchTextChanged(string value)
        {
            FilterFamilySymbols(value);
        }

        partial void OnSelectedDirectionChanged(DimensionDirection value)
        {
            UpdateAvailableBoundingBoxEdges();
        }

        private void FilterSectionViews(string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText))
            {
                FilteredSectionViews = new ObservableCollection<ViewSection>(AllSectionViews);
            }
            else
            {
                var filtered = AllSectionViews
                    .Where(s => s.Name.ToLower().Contains(searchText.ToLower()))
                    .ToList();
                FilteredSectionViews = new ObservableCollection<ViewSection>(filtered);
            }
        }

        private void FilterFamilySymbols(string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText))
            {
                FilteredFamilySymbols = new ObservableCollection<FamilySymbol>(AllFamilySymbols);
            }
            else
            {
                var filtered = AllFamilySymbols
                    .Where(fs => fs.Name.ToLower().Contains(searchText.ToLower()) ||
                               (fs.Family?.Name?.ToLower().Contains(searchText.ToLower()) ?? false))
                    .ToList();
                FilteredFamilySymbols = new ObservableCollection<FamilySymbol>(filtered);
            }
        }

        /// <summary>
        /// Обновляет доступные края ограничивающего параллелепипеда согласно выбранному направлению
        /// </summary>
        private void UpdateAvailableBoundingBoxEdges()
        {
            var edges = new List<BoundingBoxEdgeItem>();

            if (SelectedDirection == DimensionDirection.Horizontal)
            {
                edges.Add(new BoundingBoxEdgeItem { Edge = BoundingBoxEdge.Left, DisplayName = "Левый край" });
                edges.Add(new BoundingBoxEdgeItem { Edge = BoundingBoxEdge.Right, DisplayName = "Правый край" });
                edges.Add(new BoundingBoxEdgeItem { Edge = BoundingBoxEdge.Center, DisplayName = "Центр" });
            }
            else // Vertical
            {
                edges.Add(new BoundingBoxEdgeItem { Edge = BoundingBoxEdge.Top, DisplayName = "Верхний край" });
                edges.Add(new BoundingBoxEdgeItem { Edge = BoundingBoxEdge.Bottom, DisplayName = "Нижний край" });
                edges.Add(new BoundingBoxEdgeItem { Edge = BoundingBoxEdge.Center, DisplayName = "Центр" });
            }

            AvailableBoundingBoxEdges = new ObservableCollection<BoundingBoxEdgeItem>(edges);

            // Устанавливаем центр по умолчанию если текущий выбор недоступен
            if (!AvailableBoundingBoxEdges.Any(e => e.Edge == SelectedBoundingBoxEdge))
            {
                SelectedBoundingBoxEdge = BoundingBoxEdge.Center;
            }
        }

        /// <summary>
        /// Создает настройки на основе текущего состояния ViewModel
        /// </summary>
        public AutoDimensionSettings CreateSettings()
        {
            return new AutoDimensionSettings
            {
                SelectedSectionViews = SelectedSectionViews.ToList(),
                SelectedFamilyTypes = SelectedFamilySymbols.ToList(),
                SelectedDimensionType = SelectedDimensionType,
                OffsetMeters = OffsetValue,
                Strategy = SelectedStrategy,
                Direction = SelectedDirection,
                BoundingBoxEdge = SelectedBoundingBoxEdge
            };
        }

        /// <summary>
        /// Проверяет корректность текущих настроек
        /// </summary>
        public (bool IsValid, string ErrorMessage) ValidateSettings()
        {
            var settings = CreateSettings();
            if (settings.IsValid())
                return (true, string.Empty);

            return (false, settings.GetValidationError());
        }
    }

    /// <summary>
    /// Элемент для отображения стратегии размеров
    /// </summary>
    public class DimensionStrategyItem
    {
        public DimensionStrategy Strategy { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Элемент для отображения направления размеров
    /// </summary>
    public class DimensionDirectionItem
    {
        public DimensionDirection Direction { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Элемент для отображения края ограничивающего параллелепипеда
    /// </summary>
    public class BoundingBoxEdgeItem
    {
        public BoundingBoxEdge Edge { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }
}
```

## `AutoDimensionSettings.cs`
```C#
using Autodesk.Revit.DB;
using System.Collections.Generic;

namespace UKON.Models.AutoDimension
{
    /// <summary>
    /// Настройки для автоматического создания размеров
    /// </summary>
    public class AutoDimensionSettings
    {
        /// <summary>
        /// Выбранные виды разрезов для обработки
        /// </summary>
        public List<ViewSection> SelectedSectionViews { get; set; } = new List<ViewSection>();

        /// <summary>
        /// Выбранные типы семейств для размерения
        /// </summary>
        public List<FamilySymbol> SelectedFamilyTypes { get; set; } = new List<FamilySymbol>();

        /// <summary>
        /// Тип размера для создаваемых размеров
        /// </summary>
        public DimensionType? SelectedDimensionType { get; set; }

        /// <summary>
        /// Смещение размерной линии в метрах
        /// </summary>
        public double OffsetMeters { get; set; } = 1.0;

        /// <summary>
        /// Смещение размерной линии в футах (для API Revit)
        /// </summary>
        public double OffsetFeet => OffsetMeters * 3.28084;

        /// <summary>
        /// Минимальная длина кривой для обработки
        /// </summary>
        public double MinimumCurveLength { get; set; } = 0.001;

        /// <summary>
        /// Длина маркерных линий
        /// </summary>
        public double MarkerLength { get; set; } = 0.01;

        /// <summary>
        /// Стратегия создания размеров
        /// </summary>
        public DimensionStrategy Strategy { get; set; } = DimensionStrategy.MarkerBased;

        /// <summary>
        /// Направление размеров
        /// </summary>
        public DimensionDirection Direction { get; set; } = DimensionDirection.Horizontal;

        /// <summary>
        /// Край ограничивающего параллелепипеда для размеров
        /// </summary>
        public BoundingBoxEdge BoundingBoxEdge { get; set; } = BoundingBoxEdge.Center;

        /// <summary>
        /// Проверяет корректность настроек
        /// </summary>
        public bool IsValid()
        {
            return SelectedSectionViews?.Count > 0 &&
                   SelectedFamilyTypes?.Count > 0 &&
                   SelectedDimensionType != null &&
                   OffsetMeters > 0;
        }

        /// <summary>
        /// Получает сообщение об ошибке валидации
        /// </summary>
        public string GetValidationError()
        {
            if (SelectedSectionViews?.Count == 0)
                return "Не выбраны виды разрезов";
            
            if (SelectedFamilyTypes?.Count == 0)
                return "Не выбраны типы семейств";
                
            if (SelectedDimensionType == null)
                return "Не выбран тип размера";
                
            if (OffsetMeters <= 0)
                return "Смещение должно быть положительным числом";
                
            return string.Empty;
        }
    }
}
```

## `AutoDimensionService.cs`
```C#
using Autodesk.Revit.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using UKON.Models.AutoDimension;
using UKON.Extensions;

namespace UKON.Services.AutoDimension
{
    /// <summary>
    /// Основной сервис для автоматического создания размеров
    /// </summary>
    public class AutoDimensionService
    {
        private readonly Document _document;
        private readonly DimensionGeometryService _geometryService;

        public AutoDimensionService(Document document)
        {
            _document = document ?? throw new ArgumentNullException(nameof(document));
            _geometryService = new DimensionGeometryService();
        }

        /// <summary>
        /// Выполняет автоматическое создание размеров согласно настройкам
        /// </summary>
        public bool ProcessAutoDimension(AutoDimensionSettings settings)
        {
            if (!settings.IsValid())
                return false;

            var processedCount = 0;

            // Выбираем стратегию создания размеров
            var strategyService = CreateStrategyService(settings.Strategy);

            foreach (var section in settings.SelectedSectionViews)
            {
                if (strategyService.CreateDimensionsForView(section, settings))
                    processedCount++;
            }

            return processedCount > 0;
        }

        /// <summary>
        /// Создает сервис стратегии согласно выбранному типу
        /// </summary>
        private IDimensionStrategyService CreateStrategyService(DimensionStrategy strategy)
        {
            return strategy switch
            {
                DimensionStrategy.MarkerBased => new MarkerBasedDimensionService(_document),
                DimensionStrategy.AlignedChained => new AlignedChainedDimensionService(_document),
                _ => new MarkerBasedDimensionService(_document)
            };
        }

    }
}
```

## `MarkerBasedDimensionService.cs`
```C#
using Autodesk.Revit.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using UKON.Extensions;
using UKON.Models.AutoDimension;

namespace UKON.Services.AutoDimension
{
    /// <summary>
    /// Сервис создания размеров через маркерные линии (Option 1)
    /// </summary>
    public class MarkerBasedDimensionService : IDimensionStrategyService
    {
        private readonly Document _document;
        private readonly DimensionGeometryService _geometryService;

        public MarkerBasedDimensionService(Document document)
        {
            _document = document ?? throw new ArgumentNullException(nameof(document));
            _geometryService = new DimensionGeometryService();
        }

        /// <summary>
        /// Создает размеры для одного вида разреза используя маркерные линии
        /// </summary>
        public bool CreateDimensionsForView(ViewSection sectionView, AutoDimensionSettings settings)
        {
            try
            {
                var target = PrepareTarget(sectionView, settings);
                if (!target.HasSufficientElements)
                    return false;

                return ProcessSectionView(target, settings);
            }
            catch (Exception)
            {
                return false;
            }
        }

        private DimensionTarget PrepareTarget(ViewSection section, AutoDimensionSettings settings)
        {
            var target = new DimensionTarget(section);

            // Получаем семейные экземпляры в виде
            target.Instances = _document.Ext_GetVisibleFamilyInstancesInView(section, settings.SelectedFamilyTypes);

            // Вычисляем вертикальное направление
            target.VerticalDirection = _geometryService.GetVerticalInView(target.ViewDirection);

            // Собираем центральные точки согласно направлению и краю ограничивающего параллелепипеда
            target.CenterPoints = GetSortedPoints(target.Instances, section, settings);

            return target;
        }

        private List<XYZ> GetSortedPoints(List<FamilyInstance> instances, ViewSection section, AutoDimensionSettings settings)
        {
            var points = instances
                .Select(fi => GetBoundingBoxPoint(fi, section, settings.BoundingBoxEdge))
                .Where(p => p != null)
                .Cast<XYZ>()
                .ToList();

            // Сортируем согласно направлению
            return settings.Direction == DimensionDirection.Horizontal
                ? points.OrderBy(p => p.X).ToList()
                : points.OrderBy(p => p.Z).ToList(); // Z для вертикального в разрезе
        }

        private XYZ? GetBoundingBoxPoint(FamilyInstance instance, ViewSection section, BoundingBoxEdge edge)
        {
            var bb = instance.get_BoundingBox(section);
            if (bb == null) return null;

            return edge switch
            {
                BoundingBoxEdge.Left => new XYZ(bb.Min.X, (bb.Min.Y + bb.Max.Y) * 0.5, (bb.Min.Z + bb.Max.Z) * 0.5),
                BoundingBoxEdge.Right => new XYZ(bb.Max.X, (bb.Min.Y + bb.Max.Y) * 0.5, (bb.Min.Z + bb.Max.Z) * 0.5),
                BoundingBoxEdge.Top => new XYZ((bb.Min.X + bb.Max.X) * 0.5, (bb.Min.Y + bb.Max.Y) * 0.5, bb.Max.Z),
                BoundingBoxEdge.Bottom => new XYZ((bb.Min.X + bb.Max.X) * 0.5, (bb.Min.Y + bb.Max.Y) * 0.5, bb.Min.Z),
                BoundingBoxEdge.Center => (bb.Min + bb.Max) * 0.5,
                _ => (bb.Min + bb.Max) * 0.5
            };
        }

        private bool ProcessSectionView(DimensionTarget target, AutoDimensionSettings settings)
        {
            if (target.VerticalDirection == null)
                return false;

            var dimension3D = target.CenterPoints.Last() - target.CenterPoints.First();
            if (dimension3D.GetLength() < settings.MinimumCurveLength)
                return false;

            var dimensionPlane = _geometryService.ProjectToViewPlane(dimension3D, target.ViewDirection);
            if (dimensionPlane == null)
                return false;

            var referenceDirection = _geometryService.GetReferenceDirection(target.ViewDirection, dimensionPlane);

            using (var transaction = new Transaction(_document, "Создание размеров через маркерные линии"))
            {
                transaction.Start();
                
                var detailLines = CreateMarkerLines(target, referenceDirection, settings);
                _document.Regenerate();
                
                CreateDimensions(target, detailLines, referenceDirection, settings);
                
                transaction.Commit();
                return true;
            }
        }

        private List<DetailCurve> CreateMarkerLines(DimensionTarget target, XYZ direction, AutoDimensionSettings settings)
        {
            var lines = new List<DetailCurve>();
            var halfLength = settings.MarkerLength * 0.5;

            foreach (var centerPoint in target.CenterPoints)
            {
                var point1 = centerPoint - direction.Multiply(halfLength);
                var point2 = centerPoint + direction.Multiply(halfLength);
                
                var plane = Plane.CreateByNormalAndOrigin(target.ViewDirection, centerPoint);
                SketchPlane.Create(_document, plane);
                
                var line = Line.CreateBound(point1, point2);
                lines.Add(_document.Create.NewDetailCurve(target.SectionView, line));
            }

            return lines;
        }

        private void CreateDimensions(DimensionTarget target, List<DetailCurve> lines, XYZ direction, AutoDimensionSettings settings)
        {
            for (int i = 0; i < lines.Count - 1; i++)
            {
                try
                {
                    var referenceA = lines[i].GeometryCurve.Reference;
                    var referenceB = lines[i + 1].GeometryCurve.Reference;
                    
                    var references = new ReferenceArray();
                    references.Append(referenceA);
                    references.Append(referenceB);

                    var midPointA = lines[i].GeometryCurve.Evaluate(0.5, true);
                    var midPointB = lines[i + 1].GeometryCurve.Evaluate(0.5, true);

                    var offsetA = midPointA + direction.Multiply(settings.OffsetFeet);
                    var offsetB = midPointB + direction.Multiply(settings.OffsetFeet);

                    var dimensionLine = Line.CreateBound(offsetA, offsetB);

                    var dimension = _document.Create.NewDimension(target.SectionView, dimensionLine, references);
                    dimension.ChangeTypeId(settings.SelectedDimensionType.Id);
                }
                catch (Exception)
                {
                    continue;
                }
            }
        }
    }
}
```

## `AlignedChainedDimensionService.cs`
```C#
using Autodesk.Revit.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using UKON.Extensions;
using UKON.Models.AutoDimension;

namespace UKON.Services.AutoDimension
{
    /// <summary>
    /// Сервис создания выровненных цепочечных размеров (Option 2)
    /// </summary>
    public class AlignedChainedDimensionService : IDimensionStrategyService
    {
        private readonly Document _document;
        private readonly DimensionGeometryService _geometryService;

        public AlignedChainedDimensionService(Document document)
        {
            _document = document ?? throw new ArgumentNullException(nameof(document));
            _geometryService = new DimensionGeometryService();
        }

        /// <summary>
        /// Создает выровненные цепочечные размеры для одного вида разреза
        /// </summary>
        public bool CreateDimensionsForView(ViewSection sectionView, AutoDimensionSettings settings)
        {
            try
            {
                var instances = _document.Ext_GetVisibleFamilyInstancesInView(sectionView, settings.SelectedFamilyTypes);
                if (instances.Count < 2)
                    return false;

                var dimensionPoints = GetDimensionPoints(instances, sectionView, settings);
                if (dimensionPoints.Count < 2)
                    return false;

                return CreateChainedDimensions(sectionView, dimensionPoints, settings);
            }
            catch (Exception)
            {
                return false;
            }
        }

        private List<DimensionPoint> GetDimensionPoints(List<FamilyInstance> instances, ViewSection section, AutoDimensionSettings settings)
        {
            var points = new List<DimensionPoint>();

            foreach (var instance in instances)
            {
                var bb = instance.get_BoundingBox(section);
                if (bb == null) continue;

                var point = GetBoundingBoxPoint(bb, settings.BoundingBoxEdge);
                if (point == null) continue;

                // Получаем ссылку на геометрию элемента для создания размера
                var reference = GetElementReference(instance, section, settings.BoundingBoxEdge);
                if (reference == null) continue;
                
                points.Add(new DimensionPoint
                {
                    Location = point,
                    ElementReference = reference,
                    Element = instance
                });
            }

            // Сортируем согласно направлению
            return settings.Direction == DimensionDirection.Horizontal
                ? points.OrderBy(p => p.Location.X).ToList()
                : points.OrderBy(p => p.Location.Z).ToList();
        }

        private XYZ? GetBoundingBoxPoint(BoundingBoxXYZ bb, BoundingBoxEdge edge)
        {
            return edge switch
            {
                BoundingBoxEdge.Left => new XYZ(bb.Min.X, (bb.Min.Y + bb.Max.Y) * 0.5, (bb.Min.Z + bb.Max.Z) * 0.5),
                BoundingBoxEdge.Right => new XYZ(bb.Max.X, (bb.Min.Y + bb.Max.Y) * 0.5, (bb.Min.Z + bb.Max.Z) * 0.5),
                BoundingBoxEdge.Top => new XYZ((bb.Min.X + bb.Max.X) * 0.5, (bb.Min.Y + bb.Max.Y) * 0.5, bb.Max.Z),
                BoundingBoxEdge.Bottom => new XYZ((bb.Min.X + bb.Max.X) * 0.5, (bb.Min.Y + bb.Max.Y) * 0.5, bb.Min.Z),
                BoundingBoxEdge.Center => (bb.Min + bb.Max) * 0.5,
                _ => (bb.Min + bb.Max) * 0.5
            };
        }

        private bool CreateChainedDimensions(ViewSection sectionView, List<DimensionPoint> points, AutoDimensionSettings settings)
        {
            if (points.Count < 2)
                return false;

            using (var transaction = new Transaction(_document, "Создание выровненных цепочечных размеров"))
            {
                transaction.Start();

                try
                {
                    // Chain B: Создаем размеры от первого элемента к каждому последующему (A→B, A→C)
                    var firstPoint = points[0];
                    
                    for (int i = 1; i < points.Count; i++)
                    {
                        var currentPoint = points[i];
                        
                        // Создаем размер от первого элемента к текущему
                        CreateSingleDimension(sectionView, firstPoint, currentPoint, settings);
                    }

                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    transaction.RollBack();
                    return false;
                }
            }
        }

        private void CreateSingleDimension(ViewSection sectionView, DimensionPoint fromPoint, DimensionPoint toPoint, AutoDimensionSettings settings)
        {
            try
            {
                // Создаем массив ссылок для размера
                var references = new ReferenceArray();
                references.Append(fromPoint.ElementReference);
                references.Append(toPoint.ElementReference);

                // Вычисляем линию размера с смещением
                var direction = GetDimensionDirection(fromPoint.Location, toPoint.Location, settings.Direction);
                var offsetVector = GetOffsetVector(direction, settings.Direction, settings.OffsetFeet);
                
                var startPoint = fromPoint.Location + offsetVector;
                var endPoint = toPoint.Location + offsetVector;
                
                var dimensionLine = Line.CreateBound(startPoint, endPoint);

                // Создаем размер в указанном виде (view-specific!)
                var dimension = _document.Create.NewDimension(sectionView, dimensionLine, references);
                dimension.ChangeTypeId(settings.SelectedDimensionType.Id);
            }
            catch (Exception)
            {
                // Пропускаем проблемные размеры
            }
        }

        private XYZ GetDimensionDirection(XYZ fromPoint, XYZ toPoint, DimensionDirection direction)
        {
            var vector = toPoint - fromPoint;
            
            return direction == DimensionDirection.Horizontal
                ? new XYZ(vector.X, 0, 0).Normalize()
                : new XYZ(0, 0, vector.Z).Normalize();
        }

        private XYZ GetOffsetVector(XYZ dimensionDirection, DimensionDirection direction, double offsetDistance)
        {
            // Создаем вектор смещения перпендикулярно направлению размера
            return direction == DimensionDirection.Horizontal
                ? new XYZ(0, 0, offsetDistance) // Смещение вверх для горизонтальных размеров
                : new XYZ(offsetDistance, 0, 0); // Смещение вправо для вертикальных размеров
        }

        /// <summary>
        /// Получает ссылку на геометрию элемента для создания размеров
        /// </summary>
        private Reference? GetElementReference(FamilyInstance instance, ViewSection section, BoundingBoxEdge edge)
        {
            try
            {
                // Получаем геометрию элемента в контексте вида
                var options = new Options();
                options.View = section;
                options.ComputeReferences = true;

                var geometryElement = instance.get_Geometry(options);
                if (geometryElement == null) return null;

                // Ищем подходящие faces или edges для размерения
                foreach (var geometryObject in geometryElement)
                {
                    if (geometryObject is Solid solid)
                    {
                        // Ищем вертикальные faces для горизонтальных размеров
                        foreach (Face face in solid.Faces)
                        {
                            if (face is PlanarFace planarFace)
                            {
                                var normal = planarFace.FaceNormal;
                                // Проверяем, подходит ли эта face для размерения
                                if (IsFaceUsableForDimensioning(normal, edge))
                                {
                                    return face.Reference;
                                }
                            }
                        }
                    }
                }

                // Если не нашли подходящую геометрию, возвращаем базовую ссылку на элемент
                return new Reference(instance);
            }
            catch
            {
                // В случае ошибки возвращаем базовую ссылку
                return new Reference(instance);
            }
        }

        /// <summary>
        /// Проверяет, подходит ли face для размерения
        /// </summary>
        private bool IsFaceUsableForDimensioning(XYZ normal, BoundingBoxEdge edge)
        {
            // Для простоты считаем вертикальные faces подходящими для горизонтальных размеров
            // и горизонтальные faces для вертикальных размеров
            var tolerance = 0.1;
            
            return edge switch
            {
                BoundingBoxEdge.Left or BoundingBoxEdge.Right or BoundingBoxEdge.Center => 
                    Math.Abs(normal.X) > tolerance, // Vertical face (normal pointing X direction)
                BoundingBoxEdge.Top or BoundingBoxEdge.Bottom => 
                    Math.Abs(normal.Z) > tolerance, // Horizontal face (normal pointing Z direction)
                _ => Math.Abs(normal.X) > tolerance
            };
        }
    }

    /// <summary>
    /// Точка для создания размера с ссылкой на элемент
    /// </summary>
    public class DimensionPoint
    {
        public XYZ Location { get; set; }
        public Reference ElementReference { get; set; }
        public Element Element { get; set; }
    }
}
```

## `Document_Ext.cs`
```C#
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using UKON.Models.AutoSection.BodySection;

namespace UKON.Extensions
{
    public static class Document_Ext
    {
        /// <summary>
        /// Собирает все типы элементов из документа для создания разрезов
        /// </summary>
        /// <param name="doc">Документ Revit</param>
        /// <returns>Список типов элементов</returns>
        public static List<ElementTypeInfo> Ext_CollectElementTypes(this Document doc)
        {
            var elementTypes = new List<ElementTypeInfo>();

            // Собираем семейства
            var familyInstances = new FilteredElementCollector(doc)
                .OfClass(typeof(FamilyInstance))
                .Cast<FamilyInstance>()
                .ToList();

            var familyGroups = familyInstances
                .GroupBy(fi => fi.Symbol.FamilyName)
                .Select(g => new ElementTypeInfo
                {
                    TypeName = g.Key,
                    Category = "Семейство",
                    ElementIds = g.Select(fi => fi.Id).ToList()
                })
                .ToList();
            elementTypes.AddRange(familyGroups);

            // Собираем DirectShape элементы
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

            // Собираем импортированные элементы (исключая связанные)
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

            // Сортируем по категории, затем по имени типа
            return elementTypes
                .OrderBy(et => et.Category)
                .ThenBy(et => et.TypeName)
                .ToList();
        }

        /// <summary>
        /// Получает тип семейства для создания разрезов
        /// </summary>
        /// <param name="doc">Документ Revit</param>
        /// <returns>ViewFamilyType для разрезов или null</returns>
        public static ViewFamilyType Ext_GetSectionViewFamilyType(this Document doc)
        {
            return new FilteredElementCollector(doc)
                .OfClass(typeof(ViewFamilyType))
                .Cast<ViewFamilyType>()
                .FirstOrDefault(vt => vt.ViewFamily == ViewFamily.Section);
        }

        /// <summary>
        /// Генерирует уникальное имя для вида, добавляя символы если необходимо
        /// </summary>
        /// <param name="doc">Документ Revit</param>
        /// <param name="baseName">Базовое имя</param>
        /// <returns>Уникальное имя</returns>
        public static string Ext_GenerateUniqueViewName(this Document doc, string baseName)
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

        /// <summary>
        /// Выполняет операцию в рамках транзакции с автоматическим управлением
        /// </summary>
        /// <param name="doc">Документ Revit</param>
        /// <param name="transactionName">Имя транзакции</param>
        /// <param name="operation">Операция для выполнения</param>
        /// <returns>Результат операции</returns>
        public static Result Ext_ExecuteInTransaction(this Document doc, string transactionName, Func<Result> operation)
        {
            using var transaction = new Transaction(doc, transactionName);
            transaction.Start();
            
            try
            {
                var result = operation();
                if (result == Result.Succeeded)
                {
                    transaction.Commit();
                }
                else
                {
                    transaction.RollBack();
                }
                return result;
            }
            catch
            {
                transaction.RollBack();
                throw;
            }
        }

        /// <summary>
        /// Выполняет операцию в рамках транзакции с обработкой ошибок
        /// </summary>
        /// <param name="doc">Документ Revit</param>
        /// <param name="transactionName">Имя транзакции</param>
        /// <param name="operation">Операция для выполнения</param>
        /// <param name="errorMessage">Сообщение об ошибке (выходной параметр)</param>
        /// <returns>Результат операции</returns>
        public static Result Ext_ExecuteInTransactionWithErrorHandling(this Document doc, string transactionName, 
            Func<Result> operation, out string errorMessage)
        {
            errorMessage = string.Empty;
            
            using var transaction = new Transaction(doc, transactionName);
            transaction.Start();
            
            try
            {
                var result = operation();
                if (result == Result.Succeeded)
                {
                    transaction.Commit();
                }
                else
                {
                    transaction.RollBack();
                }
                return result;
            }
            catch (Exception ex)
            {
                transaction.RollBack();
                errorMessage = ex.Message;
                return Result.Failed;
            }
        }

        /// <summary>
        /// Откатывает транзакцию и отображает сообщение об ошибке
        /// </summary>
        /// <param name="transaction">Транзакция</param>
        /// <param name="errorTitle">Заголовок ошибки</param>
        /// <param name="errorMessage">Сообщение об ошибке</param>
        /// <returns>Result.Failed</returns>
        public static Result Ext_RollbackWithError(this Transaction transaction, string errorTitle, string errorMessage)
        {
            transaction.RollBack();
            TaskDialog.Show(errorTitle, errorMessage);
            return Result.Failed;
        }


        #region AutoDimension Extensions

        /// <summary>
        /// Получает все виды разрезов в документе для автоматического размерения
        /// </summary>
        /// <param name="document">Документ Revit</param>
        /// <returns>Список видов разрезов</returns>
        public static List<ViewSection> Ext_GetSectionViewsForDimensioning(this Document document)
        {
            return new FilteredElementCollector(document)
                .OfClass(typeof(ViewSection))
                .WhereElementIsNotElementType()
                .Cast<ViewSection>()
                .Where(v => !v.IsTemplate)
                .OrderBy(v => v.Name)
                .ToList();
        }

        /// <summary>
        /// Получает все типы семейств в документе для автоматического размерения
        /// </summary>
        /// <param name="document">Документ Revit</param>
        /// <returns>Список типов семейств</returns>
        public static List<FamilySymbol> Ext_GetFamilySymbolsForDimensioning(this Document document)
        {
            return new FilteredElementCollector(document)
                .OfClass(typeof(FamilySymbol))
                .Cast<FamilySymbol>()
                .OrderBy(fs => fs.Family.Name)
                .ThenBy(fs => fs.Name)
                .ToList();
        }

        /// <summary>
        /// Получает все типы размеров в документе
        /// </summary>
        /// <param name="document">Документ Revit</param>
        /// <returns>Список типов размеров</returns>
        public static List<DimensionType> Ext_GetDimensionTypes(this Document document)
        {
            return new FilteredElementCollector(document)
                .OfClass(typeof(DimensionType))
                .Cast<DimensionType>()
                .OrderBy(dt => dt.Name)
                .ToList();
        }

        /// <summary>
        /// Получает видимые семейные экземпляры в виде для указанных типов семейств
        /// </summary>
        /// <param name="document">Документ Revit</param>
        /// <param name="view">Вид для фильтрации</param>
        /// <param name="familyTypes">Типы семейств для поиска</param>
        /// <returns>Список семейных экземпляров</returns>
        public static List<FamilyInstance> Ext_GetVisibleFamilyInstancesInView(this Document document, 
                                                                              ViewSection view, 
                                                                              List<FamilySymbol> familyTypes)
        {
            return new FilteredElementCollector(document, view.Id)
                .WherePasses(new VisibleInViewFilter(document, view.Id))
                .OfClass(typeof(FamilyInstance))
                .Cast<FamilyInstance>()
                .Where(fi => fi.Symbol != null && familyTypes.Any(fs => fs.Id == fi.Symbol.Id))
                .ToList();
        }

        #endregion
    }
}
```

## `DimensionGeometryService.cs`
```C#
using Autodesk.Revit.DB;

namespace UKON.Services.AutoDimension
{
    /// <summary>
    /// Сервис для геометрических вычислений размеров
    /// </summary>
    public class DimensionGeometryService
    {
        private const double MIN_CURVE_LENGTH = 0.001;

        /// <summary>
        /// Получает вертикальное направление в виде
        /// </summary>
        public XYZ? GetVerticalInView(XYZ viewDirection)
        {
            if (viewDirection == null) 
                return null;

            var upDirection = XYZ.BasisZ;
            var verticalInView = upDirection - viewDirection.Multiply(upDirection.DotProduct(viewDirection));
            
            if (verticalInView.GetLength() < MIN_CURVE_LENGTH)
                return null;
                
            return verticalInView.Normalize();
        }

        /// <summary>
        /// Проецирует вектор на плоскость вида
        /// </summary>
        public XYZ? ProjectToViewPlane(XYZ vector, XYZ viewDirection)
        {
            if (vector == null || viewDirection == null)
                return null;

            var dotProduct = vector.DotProduct(viewDirection);
            var projected = vector - viewDirection.Multiply(dotProduct);
            
            if (projected.GetLength() < MIN_CURVE_LENGTH)
                return null;
                
            return projected.Normalize();
        }

        /// <summary>
        /// Получает направление для размещения размерных ссылок
        /// </summary>
        public XYZ GetReferenceDirection(XYZ viewDirection, XYZ dimensionPlane)
        {
            if (viewDirection == null || dimensionPlane == null)
                return null;
                
            return viewDirection.CrossProduct(dimensionPlane).Normalize();
        }

        /// <summary>
        /// Проверяет, достаточна ли длина вектора для обработки
        /// </summary>
        public bool IsSufficientLength(XYZ vector)
        {
            return vector != null && vector.GetLength() >= MIN_CURVE_LENGTH;
        }

        /// <summary>
        /// Вычисляет середину между двумя точками
        /// </summary>
        public XYZ GetMidPoint(XYZ point1, XYZ point2)
        {
            if (point1 == null || point2 == null)
                return null;
                
            return (point1 + point2) * 0.5;
        }
    }
}
```

## To add icons to buttons
1. Add Command Mapping in `Ribbon_Utils.cs`
```C#
if (commandName.Contains("UKON.Commands.Cmd_AutoDim"))
	return "Auto_Dimension";
```
2. Add Tooltip in `Tooltip.resx`:
```xml
<data name="Auto_Dimension" xml:space="preserve">
	<value>Automatic Dimension Creation for Elements in Families in Section Views</value>
</data>
```
3. Verified Icon Files - Confirmed both icons exist and are included as embedded resources:
```C#
	- Resource\Icons16\Auto_Dimesion16.png
	- Resource\Icons16\Auto_Dimesion32.png
```



> I want to use element location lines to determine which of them are parallel to each other. I would suggest working through the getting started material first of all to get more familiar with the

  topics of selecting, filtering, and querying properties like the location line:

  

  https://thebuildingcoder.typepad.com/blog/about-the-author.html#2

  

● Using element location lines to determine parallelism is a much better approach than using bounding boxes. The Building Coder blog by Jeremy Tammik is an excellent resource for this kind of Revit API work.

Let me suggest a learning path and then show you how we could modify the AlignedChainedDimensionService to use location lines:

  

## 📚 Recommended Learning Path

From Jeremy Tammik's Getting Started materials, focus on these key topics:

  

1. Element Location and Geometry
	- Understanding LocationPoint vs LocationCurve
	- Getting element location lines
	- Working with Line and Curve objects
2. Filtering and Selection
	- FilteredElementCollector advanced usage
	- Element property queries
	- Custom filters
3. Geometric Analysis
	- Line direction vectors
	- Parallel line detection
	- Distance calculations between lines

  

## 🔧 How to Modify `AlignedChainedDimensionService`

Here's how you could restructure the service to use location lines instead of bounding boxes:

### New Method Structure:
  
```C#
// Replace GetDimensionPoints method
private List<DimensionLineInfo> GetDimensionLines(List<FamilyInstance>instances, ViewSection section, AutoDimensionSettings settings)
{
  var lines = new List<DimensionLineInfo>();

  foreach (var instance in instances)
  {
	  var locationLine = GetElementLocationLine(instance);
	  if (locationLine == null) continue;

	  lines.Add(new DimensionLineInfo
	  {
		  Element = instance,
		  LocationLine = locationLine,
		  Direction = locationLine.Direction,
		  Length = locationLine.Length
	  });
  }

  // Group by parallel lines
  var parallelGroups = GroupParallelLines(lines);

  // Return lines from the largest group (most parallel elements)
  return parallelGroups.OrderByDescending(g => g.Count()).First().ToList();
}

// New helper methods you'd need to implement
private Line? GetElementLocationLine(FamilyInstance instance)
{
  if (instance.Location is LocationCurve locationCurve)
  {
	  return locationCurve.Curve as Line;
  }
  return null;
}

private IEnumerable<IGrouping<XYZ,DimensionLineInfo>>GroupParallelLines(List<DimensionLineInfo> lines)
{
  // Group lines that are parallel (same direction within tolerance)
  return lines.GroupBy(line => NormalizeDirection(line.Direction));
}
```

### New Data Structure:
```C#
public class DimensionLineInfo
{
  public Element Element { get; set; }
  public Line LocationLine { get; set; }
  public XYZ Direction { get; set; }
  public double Length { get; set; }
  public XYZ StartPoint { get; set; }
  public XYZ EndPoint { get; set; }
}
```

### 🎯 Benefits of This Approach

1. More Accurate: Uses actual element geometry instead of bounding boxes
2. Parallel Detection: Can group elements that are truly parallel
3. Better Dimensioning: Dimensions between actual element lines
4. Flexible: Can handle different element orientations

### 📖 Study These Building Coder Topics First

1. https://thebuildingcoder.typepad.com/blog/2010/01/element-location.html
2. https://thebuildingcoder.typepad.com/blog/2014/04/element-location-and-geometry.html
3. https://thebuildingcoder.typepad.com/blog/2011/03/curve-element-geometry.html
4. https://thebuildingcoder.typepad.com/blog/2013/12/parallel-walls-and-rooms.html





