import * as vscode from 'vscode';
import { ConfigurationUtils } from '../utils/configuration-utils';
import { DART_SELECTOR } from '../utils/document-selector';
import { TestLensProvider } from './test-lens-provider';

export function activateProviders(context: vscode.ExtensionContext) {
  if (ConfigurationUtils.isCodeLensEnabled()) {
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(
        DART_SELECTOR,
        new TestLensProvider(),
      ),
    );
  }
}
