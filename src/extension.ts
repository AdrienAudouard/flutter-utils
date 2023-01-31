// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { goSourceFile } from './commands/go-source-file';
import { goTestFile } from './commands/go-test-file';
import { TestLensProvider } from './providers/test-lens-provider';
import { ConfigurationUtils } from './utils/configuration-utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let testFileCommand = vscode.commands.registerCommand('flutter-utils.goTestFile', goTestFile);
	let sourceFileCommand = vscode.commands.registerCommand('flutter-utils.goSourceFile', goSourceFile);

	if (ConfigurationUtils.isCodeLensEnabled()) {
		context.subscriptions.push(vscode.languages.registerCodeLensProvider({ scheme: 'file', language: 'dart' }, new TestLensProvider(),));
	}

	vscode.workspace.onWillSaveTextDocument(() => {
		const range = new vscode.Range(
			new vscode.Position(0, 0),
			new vscode.Position(0, 80)
		);

		const decorationType = vscode.window.createTextEditorDecorationType({
		});

		let hoverMessage = new vscode.MarkdownString();
		hoverMessage.appendMarkdown('[link](command:flutter-utils.goTestFile)');
		hoverMessage.isTrusted = true;

		const hover = {
			range,
			hoverMessage: hoverMessage,
			renderOptions: {
				after: {},
			}
		} as vscode.DecorationOptions;

		vscode.window.activeTextEditor?.setDecorations(decorationType, [hover]);
	});

	context.subscriptions.push(testFileCommand);
	context.subscriptions.push(sourceFileCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
