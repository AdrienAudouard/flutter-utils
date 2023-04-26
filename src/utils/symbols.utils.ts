import * as vscode from "vscode";

export async function getSymbolType(
  uri: vscode.Uri,
  symbol: vscode.DocumentSymbol
): Promise<string | undefined> {
  const typeDefinition = await vscode.commands.executeCommand<
    vscode.LocationLink[]
  >("vscode.executeTypeDefinitionProvider", uri, symbol.range.start);

  const decleration = await vscode.commands.executeCommand<
    vscode.LocationLink[]
  >("vscode.executeDefinitionProvider", uri, symbol.range.start);

  if (decleration.length === 0 || typeDefinition.length === 0) {
    return undefined;
  }

  const typeDocument = await vscode.workspace.openTextDocument(
    typeDefinition[0].targetUri.path
  );
  const type = typeDocument.getText(typeDefinition[0].targetSelectionRange);

  const sourceDocument = await vscode.workspace.openTextDocument(uri);
  const declarationRange = decleration[0].targetRange;
  const declerationLineText = sourceDocument.getText(declarationRange);

  /// Checking if the type contains a dynamic type, for example: List<String>
  const typeRegexp = new RegExp(`${type}<[a-zA-Z0-9].*>`);
  const finalFileType = typeRegexp.exec(declerationLineText)
    ? typeRegexp.exec(declerationLineText)![0]
    : type;

  const isNullable = declerationLineText.includes(finalFileType + "?");

  return isNullable ? finalFileType + "?" : finalFileType;
}
