import * as vscode from 'vscode';

export async function getDocumentSymbols(
  uri: vscode.Uri,
): Promise<vscode.DocumentSymbol[]> {
  return await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
    'vscode.executeDocumentSymbolProvider',
    uri,
  );
}
