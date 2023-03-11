import * as vscode from 'vscode';
import { ConfigurationUtils } from '../utils/configuration-utils';
import { getDocumentSymbols } from '../utils/symbols.utils';
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

      // const actionCopyWith = new UtilityCodeAction(
      //   'Generate copyWith',
      //   vscode.CodeActionKind.QuickFix,
      //   UtilityActionType.generateCopyWith,
      //   selectedSymbol,
      //   document,
      // );

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
      return resolve([actionToString, actionEquatable, actionJsonSerializable]);
    });
  }
  resolveCodeAction?(
    codeAction: vscode.CodeAction,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeAction> {
    if (!(codeAction instanceof UtilityCodeAction)) {
      return codeAction;
    }

    switch (codeAction.type) {
      case UtilityActionType.generateCopyWith:
      case UtilityActionType.generateEquatable:
        generateEquatable(codeAction);
        break;

      case UtilityActionType.implementJsonSerializable:
        implementJsonSerializable(codeAction);
        break;

      case UtilityActionType.generateToString:
        generateToString(codeAction);
        break;

      default:
        break;
    }

    return codeAction;
  }
}
