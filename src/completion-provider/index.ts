import * as vscode from 'vscode';
import { DART_SELECTOR } from '../utils/document.selector';
import DartCompletionProvider from './dart-completion-provider';

export function activateCompletionProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      DART_SELECTOR,
      new DartCompletionProvider(),
      ' ',
    ),
  );
}
