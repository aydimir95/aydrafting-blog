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

# Структура проекта (Solution)
1. Создайте solution / проект

	1. Создайте `new project`
	2. Выберите шаблон Revit Addin (`Nice3Point`)
	3. Настройте новый проект:
		1. `Name` проекта
		2. `Location` 
		3. `Solution Name` — как и имя проекта (папка, где могут храниться несколько проектов)
	4. Доп. параметры:
		1. Тип add-in → `Application`
		2. User Interface → `None`
		3. IoC → `Disabled`
		4. Serilog support → `unchecked`

2. Разберитесь с `Visual Studio`

	1. Окна Properties и Solution Explorer (аналог Project Browser в Revit)
	2. Окна Error и Output
	3. `CSProj` → заранее настроен до Revit v.2025
	4. `.addin` → замените GUID (остальное настроим позже)
	5. Класс Application:
		1. Сообщает `.addin`, как запускаться при старте и завершении Revit
		2. `Class`: External Application
		3. Метод: `OnStartup()`
			1. Вызывает `CreateRibbon()`
			2. Создает **`Panel`** 
			3. Добавляет **`PushButton`** на этот **Panel**
			4. С двумя **`Icons`**
	4. Наша Application
		1. `OnStartup`
		2. При запуске вызывает функцию "`CreateRibbon()`"
		3. Ниже определена `CreateRibbon`, которая:
			1. Создает панель (`CreatePanel` из Revit API)
			2. Создает кнопку (`AddPushButton` в Revit API)

6. Папка Commands

	1. Основная логика
	2. Сейчас: Task Dialog — показывает имя `.addin`
		1. Класс `ExternalCommand`, но корректнее использовать `IExternalCommand`
	3. Здесь пишется логика для вашей кнопки
	4. При нажатии кнопки выполняется код из папки Commands, связанный с кнопкой
	5. Если изменить `TaskDialog.Show(Document.Title, "Hello World");`
		1. После нажатия в Revit появится окно с текстом "Hello World"

7. Resources:

	1. Иконки

8. Все хранится в проводнике Windows (структура файлов)

9. Конфигурации:

	1. Debug и Release
	2. По версиям Revit — от R20 до R25

10. References:

	1. Путь: This PC > Windows (C:) > Program Files > Autodesk > Revit [2025]
	2. DLL‑библиотеки, которые подключаются к проекту
	3. Можно добавить и пакеты для работы с Excel — сделаем это позже

3. Сборка и проверка первого плагина

	1. Соберите solution кнопкой `Run` (кнопка Play рядом с `Any CPU`)
	2. Запустится Revit (версия, указанная в настройках)
	3. Нажмите `Always Load` для вашего `.addin`
	4. Что произошло под капотом:
		1. VS2022 скопировала DLL и файл `.addin` в нужные папки и запустила выбранную версию Revit с подключенным плагином
		2. Это стало возможным благодаря преднастроенному шаблону `Nice3Point`
		3. Пути и конфигурации уже готовы — можно сразу запускаться
	5. Создайте `New Project` в Revit
		1. Найдите вашу панель на верхней ленте интерфейса
		2. Найдите ваш плагин / add‑in 
		3. Нажмите
		4. Должно появиться сообщение с `name` вашего инструмента
	6. Остановите `Debug`
		1. Закроется Revit и отладка
