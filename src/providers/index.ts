import * as vscode from 'vscode';
import { ConfigurationUtils } from '../utils/configuration-utils';
import { TestLensProvider } from './test-lens-provider';

export function activateProviders(context: vscode.ExtensionContext) {
  if (ConfigurationUtils.isCodeLensEnabled()) {
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(
        { scheme: 'file', language: 'dart' },
        new TestLensProvider(),
      ),
    );
  }
}
