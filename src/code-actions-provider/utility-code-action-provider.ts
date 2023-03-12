import * as vscode from 'vscode';
import { ConfigurationUtils } from '../utils/configuration.utils';
import { getDocumentSymbols } from '../utils/document-utils';
import { generateConstructor } from './actions/generate-constrcutor';
import { generateCopyWith } from './actions/generate-copy-with';
import { generateEquatable } from './actions/generate-equatable';
import { generateToString } from './actions/generate-to-string';
import { implementJsonSerializable } from './actions/implement-json-serializable';
import { UtilityActionType } from './utility-action-type';
import { UtilityCodeAction } from './utility-code-action';

export class UtilityActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    return new Promise(async (resolve) => {
      if (!ConfigurationUtils.isQuickFixesEnabled()) {
        return;
      }

      const documentSymbols = await getDocumentSymbols(document.uri);
      const classSymbols = documentSymbols.filter(
        (symbol) => symbol.kind === vscode.SymbolKind.Class,
      );

      if (classSymbols.length === 0) {
        return resolve([]);
      }

      const selectedSymbol = classSymbols.find((symbol) =>
        symbol.range.contains(range),
      );

      if (!selectedSymbol) {
        return resolve([]);
      }

      const actionToString = new UtilityCodeAction(
        'Generate toString',
        vscode.CodeActionKind.QuickFix,
        UtilityActionType.generateToString,
        selectedSymbol,
        document,
      );

      const actionNamedConstructor = new UtilityCodeAction(
        'Generate constructor',
        vscode.CodeActionKind.QuickFix,
        UtilityActionType.generateConstructor,
        selectedSymbol,
        document,
      );

      const actionCopyWith = new UtilityCodeAction(
        'Generate copyWith',
        vscode.CodeActionKind.QuickFix,
        UtilityActionType.generateCopyWith,
        selectedSymbol,
        document,
      );

      const actionJsonSerializable = new UtilityCodeAction(
        'Implement @JsonSerializable',
        vscode.CodeActionKind.QuickFix,
        UtilityActionType.implementJsonSerializable,
        selectedSymbol,
        document,
      );

      const actionEquatable = new UtilityCodeAction(
        'Generate Equatable',
        vscode.CodeActionKind.QuickFix,
        UtilityActionType.generateEquatable,
        selectedSymbol,
        document,
      );
      return resolve([
        actionNamedConstructor,
        actionCopyWith,
        actionEquatable,
        actionToString,
        actionJsonSerializable,
      ]);
    });
  }
  resolveCodeAction?(
    codeAction: vscode.CodeAction,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeAction> {
    if (!(codeAction instanceof UtilityCodeAction)) {
      return codeAction;
    }

    return new Promise(async (resolve) => {
      switch (codeAction.type) {
        case UtilityActionType.generateCopyWith:
          await generateCopyWith(codeAction);
          break;

        case UtilityActionType.generateEquatable:
          await generateEquatable(codeAction);
          break;

        case UtilityActionType.implementJsonSerializable:
          await implementJsonSerializable(codeAction);
          break;

        case UtilityActionType.generateToString:
          await generateToString(codeAction);
          break;

        case UtilityActionType.generateToString:
          await generateToString(codeAction);
          break;

        case UtilityActionType.generateConstructor:
          await generateConstructor(codeAction);
          break;

        default:
          break;
      }
      resolve(codeAction);
    });
  }
}
