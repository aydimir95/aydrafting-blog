+++
title = "C# + Revit API: Урок 0"
date = 2025-09-01T00:00:00+03:00
draft = false
tags = ["C#", "Revit", "Tutorial"]
cover.image = "/images/Pasted image 20250903011611.png"
cover.alt = "Урок 0"
translationKey = "lesson-0"
type = "posts"
+++

# Почему C#?
`Масштабируемость`

# С чего начать
1. [Установите Visual Studio 2022 Community](https://visualstudio.microsoft.com/downloads/)
2. [Установите .NET SDK ( .NET 4.8 и .NET 8)](https://dotnet.microsoft.com/en-us/download/visual-studio-sdks)
3. [Установите шаблоны Nice3Point](https://github.com/Nice3point/RevitTemplates)

# Структура проекта (Project Solution)
1. Создайте `new project`
![Pasted image 20250906182035.png](</images/Pasted image 20250906182035.png>)
2. Выберите шаблон Revit Addin (`Nice3Point`)
![Pasted image 20250906182237.png](</images/Pasted image 20250906182237.png>)
3. Настройте новый проект:
	1. `Name` проекта
	2. `Location`
	3. `Solution Name` — как имя проекта (это папка, которая хранит несколько проектов)
![Pasted image 20250906182441.png](</images/Pasted image 20250906182441.png>)
4. Дополнительная информация:
	1. Add-in type -> `Application`
	2. User Interface -> `None`
	3. IoC -> `Disabled`
	4. Serilog support -> `unchecked`
![Pasted image 20250906182636.png](</images/Pasted image 20250906182636.png>)

> Пока что держим всё просто — позже эти настройки можно будет изменить.
## **Знакомство с проектом в `Visual Studio 2022`**

1. **`Solution Explorer` (как Project Browser в Revit)**
	- Здесь видны все файлы, папки и ссылки проекта. Представьте это как Project Browser, но для кода.
2. **Окна Error List и Output**
    - **Error List** показывает ошибки и предупреждения в коде.
    - **Output** выводит сообщения Visual Studio, например, о сборке.
3. **Файл .csproj**
	- Хранит настройки проекта. В шаблоне Nice3Point он уже готов для Revit 2025, менять пока ничего не нужно.
4. **Файл .addin**
	- Сообщает Revit о вашем плагине — где он лежит и как его загрузить.
	    - Сейчас просто измените GUID (уникальный идентификатор плагина).
	    - Остальное изменим позже.
![Pasted image 20250906184004.png](</images/Pasted image 20250906184004.png>)
## **Class Application**
> Это «точка входа» плагина. Revit смотрит сюда первым делом при запуске или закрытии:

![Pasted image 20250906184151.png](</images/Pasted image 20250906184151.png>)
1. **Тип класса**: `ExternalApplication`
	- Сообщает Revit, что ваш add-in — это полноценное приложение (а не отдельная команда).
2. **Метод `OnStartup()`**
	- Выполняется автоматически при запуске Revit:
	    - Вызывает функцию `CreateRibbon()`.
	    - `CreateRibbon()` создаёт **панель** на ленте Revit.
	    - Добавляет на эту панель **кнопку**.
	    - Кнопка получает две **иконки** (для разных размеров).
3. **Как работает `CreateRibbon()`**
    - `CreatePanel()` — встроенный метод Revit API для создания панели.
    - `AddPushButton()` — метод API для добавления кнопки.
    - Оба метода уже настроены в шаблоне.
4. **Папка `Commands`**
	1. `StartupCommand.cs` - Основной код команды.
	```C#
	using Autodesk.Revit.Attributes;
	using Autodesk.Revit.UI;
	using Nice3point.Revit.Toolkit.External;
	
	namespace Test.Commands
	{
		/// <summary>
		///     External command entry point
		/// </summary>
		[UsedImplicitly]
		[Transaction(TransactionMode.Manual)]
		public class StartupCommand : ExternalCommand
		{
			public override void Execute()
			{
				TaskDialog.Show(Document.Title, "Test");
			}
		}
	}
	```

	2. Сейчас: Task Dialog — показывает имя плагина `Test`, можно поменять по желанию.
		1. Используется `ExternalCommand`, но лучше применять `IExternalCommand`.
	3. Здесь пишется логика для кнопки (Оставляем все как есть для первого запуска).
	4. При нажатии кнопки выполняется код из папки Commands.
	5. Если изменить `TaskDialog.Show(Document.Title, "Hello World");`:
		1. То в Revit при нажатии появится сообщение «Hello World».
6. **Resources:**
	1. Иконки
7. Всё хранится в Проводнике Windows (`Windows Explorer`)
8. **Конфигурации:**
	1. Debug и Release
	2. По версиям Revit от R20 до R25
9. **References:**
	1. Путь: This PC > Windows (C:) > Program Files > Autodesk > Revit [2025].
	2. DLL-библиотеки, которые можно подключать к проекту.
	3. Позже добавим пакет для работы с Excel.
10. Сборка и тест первого плагина:
	1. Выберите `Debug R25` для Revit 2025:
![Pasted image 20250906185207.png](</images/Pasted image 20250906185207.png>)
11. Соберите solution, нажав `Run` (Play Button `TEST`) рядом с `Any CPU`.
12. Запустится Revit (та версия, которую вы указали).
13. В окне доверия выберите `Always Load` для `.addin`.
14. Что произошло за кулисами:
	1. Visual Studio 2022 скопировала DLL и `.addin` в нужную папку и запустила Revit с вашим плагином.
	2. Это возможно благодаря шаблону `Nice3Point`.
	3. Всё уже настроено для быстрого старта.
15. Откройте `New Project` в Revit:
	1. Найдите новую панель на ленте.
	2. Найдите свой плагин.
![Pasted image 20250906185557.png](</images/Pasted image 20250906185557.png>)
	3. Нажмите на него.
	4. Появится сообщение с `именем` инструмента.
![Pasted image 20250906185624.png](</images/Pasted image 20250906185624.png>)
16. Готово! Теперь можно остановить `Debug` в Visual Studio:
	1. Это закроет Revit и завершит отладку.
![Pasted image 20250906190059.png](</images/Pasted image 20250906190059.png>)

> На этом вы создали своё первое приложение или кнопку в Revit!  
> Поздравляю! Теперь вы готовы писать реальную функциональность.  
> **В [Уроке 1](https://blog.aydrafting.com/ru/) мы пошагово разберём пример `IExternalCommand`.**