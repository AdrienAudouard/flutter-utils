import * as vscode from 'vscode';
import { goSourceFileWrapper } from './go-source-file';
import { goTestFileWrapper } from './go-test-file';

export function activateCommands(context: vscode.ExtensionContext) {
  let testFileCommand = vscode.commands.registerCommand(
    'flutter-toolkit.goTestFile',
    goTestFileWrapper,
  );
  let sourceFileCommand = vscode.commands.registerCommand(
    'flutter-toolkit.goSourceFile',
    goSourceFileWrapper,
  );

  context.subscriptions.push(testFileCommand);
  context.subscriptions.push(sourceFileCommand);
}
