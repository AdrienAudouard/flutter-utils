import * as vscode from 'vscode';
import { goSourceFile } from './commands/go-source-file';
import { goTestFile } from './commands/go-test-file';
import { functiononEditorChanged } from './event_handler/on-active-editor-change.handler';
import { TestLensProvider } from './providers/test-lens-provider';
import { analyticsService } from './services/analytics.service';
import { UserService } from './services/user.service';
import { ConfigurationUtils } from './utils/configuration-utils';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    analyticsService.init(UserService.getUserId(context)),
  );

  let testFileCommand = vscode.commands.registerCommand(
    'flutter-utils.goTestFile',
    goTestFile,
  );
  let sourceFileCommand = vscode.commands.registerCommand(
    'flutter-utils.goSourceFile',
    goSourceFile,
  );

  if (ConfigurationUtils.isCodeLensEnabled()) {
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(
        { scheme: 'file', language: 'dart' },
        new TestLensProvider(),
      ),
    );
  }

  if (ConfigurationUtils.isRenameSuggestionEnabled()) {
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(functiononEditorChanged),
    );
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      analyticsService.updateUserProperties();
      analyticsService.trackUpdatedProperties(event);
    }),
  );

  context.subscriptions.push(testFileCommand);
  context.subscriptions.push(sourceFileCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {
  analyticsService.endSession();
}
