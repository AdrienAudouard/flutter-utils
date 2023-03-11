import * as vscode from 'vscode';
import { DART_SELECTOR } from '../utils/document-selector';
import { UtilityActionProvider } from './utility-code-action-provider';

export function activateCodeActionProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      DART_SELECTOR,
      new UtilityActionProvider(),
    ),
  );
}
