import * as vscode from 'vscode';
import { ConfigurationUtils } from '../utils/configuration.utils';
import { onEditorChangedWrapper } from './on-active-editor-change.handler';
import { onRenameFiles } from './on-rename-file.handler';

export function activateEventHandlers(context: vscode.ExtensionContext) {
  if (ConfigurationUtils.isRenameSuggestionEnabled()) {
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(onEditorChangedWrapper),
    );
  }

  if (ConfigurationUtils.isTestFileSyncEnabled()) {
    context.subscriptions.push(
      vscode.workspace.onDidRenameFiles(onRenameFiles),
    );
  }
}
