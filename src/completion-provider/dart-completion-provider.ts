import * as path from 'path';
import * as vscode from 'vscode';
import { TRIGGER_SYMBOLS } from './trigger-symbols';

export default class DartCompletionProvider
  implements vscode.CompletionItemProvider
{
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    const start = new vscode.Position(position.line, 0);
    const range = new vscode.Range(start, position);

    const text = document.getText(range);

    if (this.matchTriggerSymbol(text)) {
      return [
        new vscode.CompletionItem(
          this.getSymbolNameFromFileName(document.fileName),
          vscode.CompletionItemKind.Text,
        ),
      ];
    }

    return [];
  }
  resolveCompletionItem?(
    item: vscode.CompletionItem,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CompletionItem> {
    return item;
  }

  matchTriggerSymbol(text: string): boolean {
    for (const symbol of TRIGGER_SYMBOLS) {
      if (text.endsWith(symbol + ' ')) {
        return true;
      }
    }
    return false;
  }

  getSymbolNameFromFileName(fileName: string) {
    const withoutExtension = path.basename(fileName).replace('.dart', '');
    const splitted = withoutExtension.split(/[._-]+/);
    const symbolName = splitted
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join('');
    return symbolName;
  }
}
