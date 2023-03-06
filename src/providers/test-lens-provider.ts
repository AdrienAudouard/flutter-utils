import * as vscode from 'vscode';
import { ClassDataCodeLens } from '../models/class-data-code-lens';
import { analyticsService } from '../services/analytics.service';
import { CodeLensUtils } from '../utils/code-lens-utils';
const fs = require('fs');

export class TestLensProvider implements vscode.CodeLensProvider {
  onDidChangeCodeLenses?: vscode.Event<void> | undefined;

  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    /// https://code.visualstudio.com/api/references/commands
    if (document.uri.path.endsWith('_test.dart')) {
      return [];
    }

    return vscode.commands
      .executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        document.uri,
      )
      .then((symbols) => {
        const lens: ClassDataCodeLens[] = [];
        const flatSymbols = symbols
          .map((symbol) => [symbol, ...symbol.children])
          .flat();

        for (const symbol of flatSymbols) {
          if (
            [
              vscode.SymbolKind.Class,
              vscode.SymbolKind.Method,
              vscode.SymbolKind.Namespace,
              vscode.SymbolKind.Function,
            ].includes(symbol.kind)
          ) {
            lens.push(
              new ClassDataCodeLens(symbol.range, document.uri, {
                className: symbol.name,
                symbol: symbol,
              }),
            );
          }
        }

        return lens;
      }, analyticsService.trackError);
  }

  resolveCodeLens?(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeLens> {
    if (!(codeLens instanceof ClassDataCodeLens)) {
      return codeLens;
    }

    try {
      return CodeLensUtils.updateCodeLens(codeLens);
    } catch (err) {
      analyticsService.trackError(err);
    }

    return codeLens;
  }
}
