// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { goSourceFile } from './commands/go-source-file';
import { goTestFile } from './commands/go-test-file';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let testFileCommand = vscode.commands.registerCommand('flutter-utils.goTestFile', goTestFile);
	let sourceFileCommand = vscode.commands.registerCommand('flutter-utils.goSourceFile', goSourceFile);

	context.subscriptions.push(testFileCommand);
	context.subscriptions.push(sourceFileCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
