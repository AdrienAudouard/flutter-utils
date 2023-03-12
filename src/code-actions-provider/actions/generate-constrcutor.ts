import { Position, SymbolKind, workspace, WorkspaceEdit } from 'vscode';
import { getSymbolType } from '../../utils/symbols.utils';
import { isTypeNullable } from '../../utils/type.utils';
import { UtilityCodeAction } from '../utility-code-action';

export async function generateConstructor(action: UtilityCodeAction) {
  const edit = new WorkspaceEdit();

  await updateEditWithConstructor(action, edit);

  await workspace.applyEdit(edit);
}

export async function updateEditWithConstructor(
  action: UtilityCodeAction,
  edit: WorkspaceEdit,
): Promise<void> {
  const previousConstructor = action.symbol.children.find(
    (symbol) => symbol.name === action.symbol.name,
  );

  if (previousConstructor) {
    edit.replace(
      action.document.uri,
      previousConstructor.range,
      await getConstructorContent(action),
    );
  } else {
    const insertPosition = new Position(action.symbol.range.start.line + 1, 0);

    edit.insert(
      action.document.uri,
      insertPosition,
      await getConstructorContent(action),
    );
  }
}

async function getConstructorContent(
  action: UtilityCodeAction,
): Promise<string> {
  const propertySymbols = action.symbol.children.filter(
    (symbol) => symbol.kind === SymbolKind.Field,
  );

  const types = await Promise.all(
    propertySymbols.map(async (symbol) => {
      return getSymbolType(action.document.uri, symbol);
    }),
  );

  const propertiesStr = propertySymbols.map((symbol, index) => {
    const type = types[index]!;
    const requiredText = !isTypeNullable(type) ? 'required ' : '';

    if (isTypeNullable(type)) {
    }

    return `    ${requiredText}this.${symbol.name}`;
  });

  /// Sort so the required properties are in first
  propertiesStr.sort((a, b) => {
    if (a.trim().startsWith('required') && b.trim().startsWith('required')) {
      return 0;
    }

    if (a.trim().startsWith('required')) {
      return -1;
    }

    return 1;
  });

  return `  ${action.symbol.name}({
${propertiesStr.join(',\n')}
  });\n`;
}
