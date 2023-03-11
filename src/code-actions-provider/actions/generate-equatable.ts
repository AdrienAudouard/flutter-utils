import { Position, SymbolKind, workspace, WorkspaceEdit } from 'vscode';
import { UtilityCodeAction } from '../utility-code-action';

export function generateEquatable(action: UtilityCodeAction) {
  const propertySymbols = action.symbol.children.filter(
    (symbol) => symbol.kind === SymbolKind.Field,
  );

  const propertySymbolsStr = propertySymbols
    .map((symbol) => symbol.name)
    .join(', ');

  const content = getEquatableMethod(propertySymbolsStr);

  const edit = new WorkspaceEdit();

  const previousProps = action.symbol.children.find(
    (symbol) => symbol.name === 'props',
  );

  if (previousProps) {
    edit.replace(action.document.uri, previousProps.range, content);
  } else {
    const insertPosition = new Position(action.symbol.range.end.line, 0);
    edit.insert(action.document.uri, insertPosition, '\n@override\n' + content);
  }

  workspace.applyEdit(edit);
}

function getEquatableMethod(content: string) {
  return `List<Object?> get props => [${content}];\n`;
}
