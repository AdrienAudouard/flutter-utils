import * as vscode from 'vscode';

export async function getSymbolType(
  uri: vscode.Uri,
  symbol: vscode.DocumentSymbol,
): Promise<string | undefined> {
  const typeDefinition = await vscode.commands.executeCommand<
    vscode.LocationLink[]
  >('vscode.executeTypeDefinitionProvider', uri, symbol.range.start);

  const decleration = await vscode.commands.executeCommand<
    vscode.LocationLink[]
  >('vscode.executeDefinitionProvider', uri, symbol.range.start);

  if (decleration.length === 0 || typeDefinition.length === 0) {
    return undefined;
  }

  const typeDocument = await vscode.workspace.openTextDocument(
    typeDefinition[0].targetUri.path,
  );
  const type = typeDocument.getText(typeDefinition[0].targetSelectionRange);

  const sourceDocument = await vscode.workspace.openTextDocument(uri);
  const declarationRange = decleration[0].targetRange;
  const isNullable = sourceDocument
    .getText(declarationRange)
    .includes(type + '?');

  return isNullable ? type + '?' : type;
}
