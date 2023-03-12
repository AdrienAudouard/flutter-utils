import { Position, SymbolKind, workspace, WorkspaceEdit } from 'vscode';
import { UtilityCodeAction } from '../utility-code-action';

export async function generateToString(action: UtilityCodeAction) {
  const edit = new WorkspaceEdit();

  const previousToString = action.symbol.children.find(
    (symbol) => symbol.name === 'toString',
  );

  const toStringContent = getToStringMethodContent(action);
  if (previousToString) {
    edit.replace(action.document.uri, previousToString.range, toStringContent);
  } else {
    const insertPosition = new Position(action.symbol.range.end.line, 0);
    edit.insert(
      action.document.uri,
      insertPosition,
      '\n@override\n' + toStringContent,
    );
  }

  await workspace.applyEdit(edit);
}

function getToStringMethodContent(action: UtilityCodeAction) {
  return `String toString() {
    return '${getToStringContent(action)}';
  }\n`;
}

function getToStringContent(action: UtilityCodeAction) {
  const propertySymbols = action.symbol.children.filter(
    (symbol) => symbol.kind === SymbolKind.Field,
  );

  const propertiesStr = propertySymbols
    .map((symbol) => `${symbol.name}=\$${symbol.name}`)
    .join(', ');

  return `${action.symbol.name}{${propertiesStr}}`;
}
