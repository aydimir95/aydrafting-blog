+++
title = "C# + Revit API: Урок 1 - Создание команды для автоматизации создания листов"
date = 2025-09-15T00:00:00+03:00
draft = false
tags = ["C#", "RevitAPI", "Tutorial"]
cover.image = "/images/Pasted image 20250915030857.png"
cover.alt = "Что делает каждая команда (для начинающих)"
+++

В этом уроке мы реализуем обещание из [Урока 0](http://blog.aydrafting.com/ru/posts/lesson-0/) — создадим **рабочую команду**, которая:

- создаёт лист (с правильной обработкой ошибок)
- подсчитывает существующие листы в документе
- выводит пользователю понятную сводку

> ✅ **Требования:** Завершите настройку `Application` из Урока 0. Если в проекте нет основных надписей, команда уведомит об этом и корректно завершится.

---

# Application vs. Command

- **Application** (запускается с Revit): настраивает ваш аддин — создаёт панели и кнопки на ленте. Это «**инфраструктура и интерфейс**».
- **Command** (выполняется по нажатию кнопки): выполняет основную работу — читает/изменяет модель. Это «**логика инструмента**».

В коде эти роли представлены разными интерфейсами:

| Интерфейс | Когда запускается | Для чего | Примеры |
|---|---|---|---|
| `IExternalApplication` | При старте/выключении Revit | Добавить ленту, зарегистрировать события | Добавить панель и кнопку |
| `IExternalCommand` | Когда пользователь нажимает кнопку | Выполнить работу (read/modify model) | Создать листы, разместить виды |
| `IExternalDBApplication` | При старте/выключении (без UI) | Слушать DB-события | Batch/monitoring, analytics |
| `IExternalCommandAvailability` | Перед активацией команды | Включать/отключать кнопку по состоянию | Отключать без открытого doc |
| `IExternalEventHandler` | По запросу из modeless UI | Безопасно трогать модель из UI/фоновых потоков | Progress windows, async tasks |

> 🧰 `Nice3point.Revit.Toolkit` предоставляет удобные базовые классы `ExternalApplication` и `ExternalCommand`, которые упрощают эти паттерны. В этом уроке мы **работаем с «чистым» `IExternalCommand`** для понимания основ, но также покажем интеграцию с лентой через Nice3point.

## Почему Revit требует `IExternal*` vs `External*` классы?

**Кратко:** Revit — хост-приложение. Он вызывает только классы, реализующие **официальные интерфейсы**. Основные точки входа: `IExternalApplication` (запуск/завершение) и `IExternalCommand` (пользовательские инструменты).

**Откуда `ExternalApplication` / `ExternalCommand` (без `I`)?**  
Это **вспомогательные базовые классы** из библиотек (например, Nice3point). Они реализуют необходимые интерфейсы и предоставляют удобные свойства (`Document`, `UiDocument`), делая код лаконичнее. Revit по-прежнему работает с интерфейсами.

### Можно ли держать оба в одном классе?

Обычно **нет**. Лучше разделять из-за разных жизненных циклов:
- `IExternalApplication`/`ExternalApplication` — **однократно за сессию** Revit (создание UI, регистрация событий)
- `IExternalCommand`/`ExternalCommand` — **при каждом нажатии** кнопки (выполнение работы: транзакции, правки)

Стандартный паттерн — **два отдельных класса** в одной сборке:
```text
Test.Application                 → IExternalApplication / ExternalApplication
Test.Commands.CreateSheetCommand → IExternalCommand     / ExternalCommand
```

### Как Revit находит ваш код (`.addin` mapping)

Revit читает файл **.addin**, который указывает на вашу сборку и entry-class. Два типовых варианта:

**A) Рекомендуется: Application-loader + лента (одна запись `.addin`)**

- Одна запись `<AddIn Type="Application">` на ваш Application-класс.
- В OnStartup создаёте панель ленты и добавляете **push button**, привязанный к вашему классу команды.

```xml
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<RevitAddIns>
  <AddIn Type="Application">
    <Name>MyAddin</Name>
    <Assembly>C:\Path\To\MyAddin.dll</Assembly>
    <FullClassName>Test.Application</FullClassName>
    <VendorId>AYD</VendorId>
    <VendorDescription>AYDrafting</VendorDescription>
  </AddIn>
</RevitAddIns>
```

> В Application.OnStartup() регистрируете кнопку примерно так:
> `new PushButtonData("CreateSheet", "Create Sheet", assemblyPath, "Test.Commands.CreateSheetCommand");`

**B) Только команда (видна в Add-Ins → External Tools)**

— Запись `<AddIn Type="Command">`, указывающая **напрямую** на класс команды. Ленту настраивать не требуется.

```xml
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<RevitAddIns>
  <AddIn Type="Command">
    <Name>CreateSheet</Name>
    <Assembly>C:\Path\To\MyAddin.dll</Assembly>
    <FullClassName>Test.Commands.CreateSheetCommand</FullClassName>
    <VendorId>AYD</VendorId>
    <VendorDescription>AYDrafting</VendorDescription>
  </AddIn>
</RevitAddIns>
```

### Когда и что использовать?

| Нужно…                                      | Используйте                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| Кнопка на ленте + логика старта             | `IExternalApplication`/`ExternalApplication` (создать UI и привязать кнопки) |
| Действие по клику, читающее/меняющее модель | `IExternalCommand`/`ExternalCommand` с transactions                          |
| Слушатели DB-событий без UI                 | `IExternalDBApplication`                                                     |
| Динамически включать/выключать кнопку       | `IExternalCommandAvailability`                                               |
| Безопасно менять модель из modeless/async   | `IExternalEventHandler`                                                      |

**Коротко:** Интерфейсы `IExternal*` — **контракт**, который вызывает Revit. Классы `External*` упрощают работу, но соблюдают тот же контракт. **Application** (запуск и UI) и **Command** (логика) лучше **разделять** и связывать через ленту.

---

# Домашнее задание

Напишите команду **`CreateSheetCommand`**, которая:

1. Получает активный `Document` из контекста Revit
2. Запускает `Transaction` с именем "Create Sheet"
3. Находит тип основной надписи (не экземпляр!) и создаёт новый `ViewSheet`
4. Фиксирует транзакцию (`Commit`) при успехе
5. Собирает все листы и формирует краткий отчёт:
   - общее количество листов
   - первые 5 листов в формате `Номер` - `Название`
6. Показывает результат через `TaskDialog`
7. Возвращает `Result.Succeeded`; при ошибке — откат с понятным сообщением

---

# Решение

{{< collapse title="Показать/Скрыть Код" >}}

## `Project Solution`
```bash
Solution
|-> Test.csproj  
	|-> Commands
		|-> StartupCommand.cs  # Изменить
	|-> Resources
	|-> Application.cs  # Изменить
	|-> Test.addin
```



## `StartupCommand.cs` (команда)
```C#
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Test.Commands
{
    [Transaction(TransactionMode.Manual)]
    public class CreateSheetCommand : IExternalCommand
    {
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            // 1) Получить текущий документ
            Document doc = commandData.Application.ActiveUIDocument.Document;

            string resultMessage = string.Empty;

            // 2) Попытаться создать лист внутри транзакции
            using (Transaction transaction = new Transaction(doc, "Create Sheet"))
            {
                transaction.Start();

                try
                {
                    // Найти тип основной надписи (не экземпляр)
                    ElementId titleBlockId = new FilteredElementCollector(doc)
                        .OfCategory(BuiltInCategory.OST_TitleBlocks)
                        .WhereElementIsElementType()
                        .FirstElementId();

                    // Создать лист
                    ViewSheet newSheet = ViewSheet.Create(doc, titleBlockId);
                    transaction.Commit();

                    resultMessage = $"✅ Лист успешно создан!\nНомер листа: {newSheet.SheetNumber}";
                }
                catch (InvalidOperationException)
                {
                    // Нет основных надписей в проекте
                    transaction.RollBack();
                    resultMessage = "❌ Основные надписи не найдены в проекте.\nВставка → Загрузить семейство → сначала добавьте основную надпись.";
                }
                catch (Exception ex)
                {
                    // Любая другая ошибка
                    transaction.RollBack();
                    resultMessage = $"❌ Ошибка создания листа: {ex.Message}";
                }
            }

            // 3) Подсчитать существующие листы
            var allSheets = new FilteredElementCollector(doc)
                .OfClass(typeof(ViewSheet))
                .Cast<ViewSheet>()
                .ToList();

            resultMessage += $"\n\n📊 Всего листов в документе: {allSheets.Count}";

            if (allSheets.Count > 0)
            {
                resultMessage += "\n\nПервые 5 листов:";
                foreach (var sheet in allSheets.Take(5))
                {
                    resultMessage += $"\n• {sheet.SheetNumber} - {sheet.Name}";
                }
            }

            // 4) Показать диалог с результатом
            TaskDialog.Show("Результат создания листа", resultMessage);
            return Result.Succeeded;
        }
    }
}
```

## `Application.cs` 
```csharp
using Nice3point.Revit.Toolkit.External;
using Test.Commands;

namespace Test
{
    /// <summary>
    ///     Точка входа приложения
    /// </summary>
    [UsedImplicitly]
    public class Application : ExternalApplication
    {
        public override void OnStartup()
        {
            CreateRibbon();
        }

        private void CreateRibbon()
        {
            var panel = Application.CreatePanel("Commands", "Test");

            panel.AddPushButton<CreateSheetCommand>("Execute")
                .SetImage("/Test;component/Resources/Icons/RibbonIcon16.png")
                .SetLargeImage("/Test;component/Resources/Icons/RibbonIcon32.png");
        }
    }
}
```

> Если вы не используете Nice3point, добавьте кнопку через чистый Revit API в `IExternalApplication.OnStartup` и свяжите её с `CreateSheetCommand` в .addin. Чистую ленту разберём в одном из следующих уроков.

## Результат

![Pasted image 20250915031037.png](</images/Pasted image 20250915031037.png>)

---
{{< /collapse >}}

# Пошаговое руководство 

## 1) Обязательный атрибут

```csharp
[Transaction(TransactionMode.Manual)]
```

**Почему Manual?**
- Вы полностью контролируете транзакции: 
	- `Start()` - Начать транзакцию, 
	- `Commit()` - Завершить транзакцию, 
	- `RollBack()` - Отменить транзакцию. 
- Это стандарт для команд, **изменяющих** модель, 

Альтернативы TransactionMode.Manual:
- `TransactionMode.ReadOnly` — только для чтения/анализа (без изменений в модели)

## 2) Контракт команды

```C#
public class CreateSheetCommand : IExternalCommand
{
    public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
    {
        // ...
    }
}
```

- Revit **вызывает** `Execute` при нажатии кнопки
- Метод **возвращает** `Result`: `Succeeded`, `Cancelled`, `Failed`
- Ключевой параметр: `commandData.Application.ActiveUIDocument.Document` → активный документ

## 3) Транзакции (сеть безопасности)

Все изменения модели выполняются внутри `Transaction`:

```C#
using (var t = new Transaction(doc, "Something"))
{
    t.Start();
    try
    {
        // изменить модель
        t.Commit();
    }
    catch
    {
        t.RollBack(); // отмена всех изменений при ошибке
        throw;        // или показать понятное сообщение
    }
}
```

## 4) Эффективный поиск элементов

`FilteredElementCollector` — основной инструмент поиска элементов в модели:

```csharp
var titleBlockTypeId = new FilteredElementCollector(doc)
    .OfCategory(BuiltInCategory.OST_TitleBlocks)
    .WhereElementIsElementType() // типы, не размещённые экземпляры
    .FirstElementId();           // выбросит исключение, если ничего не найдено
```

## 5) Создание листа [ViewSheet.Create](https://www.revitapidocs.com/2026/bc9e8be3-f3fd-97c2-2709-1d6eea3db775.htm)
 
```csharp
ViewSheet newSheet = ViewSheet.Create(doc, titleBlockTypeId);
```

Без типа основной надписи Revit не сможет создать лист — поэтому обрабатываем `InvalidOperationException`.

## 6) Общение с пользователем

`TaskDialog` обеспечивает нативное отображение сообщений в Revit.

---

# Интерфейсы — наглядные различия


`IExternalApplication` → запуск/завершение, настройка интерфейса и событий
`IExternalCommand` → выполнение по клику, основная логика (с транзакциями)
`IExternalDBApplication` → фоновые процессы (без UI), события базы данных
`IExternalEventHandler` → асинхронные операции с моделью
`IExternalCommandAvailability` → управление доступностью команд по контексту


### `IExternalCommand` vs. `ExternalCommand`
- Существует два способа создания команд:

**Обычный интерфейс (этот урок)**
```C#
public class MyCommand : IExternalCommand
{
    public Result Execute(ExternalCommandData c, ref string m, ElementSet e) 
    { 
	    /* ... */ 
    }
}
```

**Удобный базовый класс Nice3point**
```C#
public class MyCommand : ExternalCommand
{
    public override void Execute() 
    { 
	    /* Document, UiDocument доступны как свойства */ 
	}
}
```

- `IExternalCommand` — это «чистый» интерфейс Revit API. Ты полностью контролируешь - описание метода `Execute()`, сам достаёшь UIApplication, UIDocument, Document из аргументов и работаешь напрямую с API. Такой подход даёт максимальную прозрачность и полезен для понимания, как Revit вызывает твой код.
- `ExternalCommand` от Nice3point — это удобная обёртка. Она уже реализует `IExternalCommand` за тебя и предоставляет готовые свойства (Document, UiDocument, Application), убирает шаблонный код и упрощает старт проекта. Под капотом > используется тот же самый Revit API.

 > 📌 **Вывод:** Разница только в уровне абстракции: `ExternalCommand` — это «синтаксический сахар», а `IExternalCommand` — чистый API. На продакшн можно писать на базовом классе для скорости, но для обучения и отладки полезно начать с интерфейса.

---

# Устранение неполадок

**"Основные надписи не найдены"**
- Вставка → Загрузить семейство → добавьте основную надпись (.rfa)
---
**Кнопка не отображается**
- Проверьте настройки .addin и полное имя класса. При использовании Nice3point убедитесь, что `ExternalApplication` запускается
---
**Ошибки транзакций**
- Вызывайте `Start()` **перед** изменениями модели, завершайте каждую транзакцию `Commit()` или `RollBack()`
---
**`ActiveUIDocument` равно null**
- Нет открытого проекта. Откройте модель в Revit


# Что дальше

**Урок 2**: Основы программирования (биты, байты, системы счисления в C#)

**Далее**: размещение видов на листах, продвинутые фильтры элементов, API выбора и немодальные инструменты с `IExternalEventHandler`

> Особая благодарность [Aussie BIM Guru](https://www.youtube.com/@AussieBIMGuru) за вдохновляющие материалы по Revit API.