# Flutter tests utils

Provide some utils functions when you write tests with Flutter.

The features are :

- 🚀 Generate `toString`, `copyWith`, `constructor` and Equatable (`props`) methods
- 🚀 Implement JsonSerializable methods
- 🚀 Open the test file related to the source code opened
- 🚀 Create a test file directly with a button
- 🚀 Support mono repo and multi packages repo
- 🚀 If you made a typo when creating a test file, the plugin will made some suggestions, it will find the closests test file related to your source file
- 🚀 View the number of tests for your classes and functions directly in the editor
- 🚀 Synchronise test files with source files. Automatically rename and move test files when the source changes

## Demo

### Create a test file

![rename](https://raw.githubusercontent.com/AdrienAudouard/flutter-utils/main/readme-images/create_test_file.gif)

### Open test file

![go](https://raw.githubusercontent.com/AdrienAudouard/flutter-utils/main/readme-images/go.gif)

## Features

| Command          | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Open test file   | Open the test file related to the source file opened. Ask to create one if it do not exists |
| Open source file | Open the source file related to the test file opened                                        |

## How it works

To be detected, your test files must be placed inside the `test` folder with the same folder structure as the source files.
For example, the test file of `lib/folder_a/todo.dart` must be `test/folder_a/todo_test.dart`.

## Settings

| Settings                                     | Description                                                                                                                                                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flutter-toolkit.testFileFolder`             | Folder under `/test` where your tests are located                                                                                                                                                                |
| `flutter-toolkit.closestFileMinPercentage`   | When the test file is not found, the extension will made some suggestions by searching the closest search test files with a score above this settings (0.8 by default)                                           |
| `flutter-toolkit.suggestions.renameTestFile` | Enable test file rename suggestion. When no test file are found for the file opened, the extension will try to find test files that might match and will ask you if you want to rename it with the correct name. |
| `flutter-toolkit.codeLens.enabled`           | Enable or not the code lens feature                                                                                                                                                                              |
| `flutter-toolkit.codeLens.testFunctions`     | Functions that should be considered as test functions (test, blocTest, testWidgets, patrolTest by default)                                                                                                       |
| `flutter-toolkit.synchronisation.onRename`   | Synchronise the test files with the source files. When a source file is moved or renamed the test file will be renamed and moved to follow the same folder structure and name.                                   |

## Next features

- [x] Rename test file when source is renamed
- [x] Move test file when the source file is moved
- [ ] Handle class & method renaming
- [x] Propose a test file rename if a source file is close
- [ ] View source from test editor
- [ ] Create function test group if it do not exists
- [x] Open test files on the correct line
