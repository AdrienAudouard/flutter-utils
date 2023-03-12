import { Position, SymbolKind, workspace, WorkspaceEdit } from 'vscode';
import { ConfigurationUtils } from '../../utils/configuration.utils';
import { getSymbolType } from '../../utils/symbols.utils';
import { isTypeNullable } from '../../utils/type.utils';
import { UtilityCodeAction } from '../utility-code-action';
import { updateEditWithConstructor } from './generate-constrcutor';

const FLUTTER_MATERIAL_IMPORT = "import 'package:flutter/material.dart';";

export async function generateCopyWith(action: UtilityCodeAction) {
  const propertySymbols = action.symbol.children.filter(
    (symbol) => symbol.kind === SymbolKind.Field,
  );

  const types = await Promise.all(
    propertySymbols.map(async (symbol) => {
      return getSymbolType(action.document.uri, symbol);
    }),
  );

  const copyWithContent = await getCopyWithMethodContent(action, types);

  const edit = new WorkspaceEdit();

  const previousCopyWith = action.symbol.children.find(
    (symbol) => symbol.name === 'copyWith',
  );

  if (previousCopyWith) {
    edit.replace(action.document.uri, previousCopyWith.range, copyWithContent);
  } else {
    const insertPosition = new Position(action.symbol.range.end.line, 0);
    edit.insert(action.document.uri, insertPosition, copyWithContent);
  }

  if (containsNullable(types)) {
    edit.insert(
      action.document.uri,
      new Position(0, 0),
      FLUTTER_MATERIAL_IMPORT + '\n',
    );
  }

  if (ConfigurationUtils.generateConstructorWithCopyWith()) {
    await updateEditWithConstructor(action, edit);
  }

  await workspace.applyEdit(edit);
}

async function getCopyWithMethodContent(
  action: UtilityCodeAction,
  types: (string | undefined)[],
) {
  const propertySymbols = action.symbol.children.filter(
    (symbol) => symbol.kind === SymbolKind.Field,
  );

  const functionParams = propertySymbols
    .map((symbol, index) => {
      const type = types[index]!;
      if (isTypeNullable(type)) {
        return `    ValueGetter<${type}>? ${symbol.name}`;
      }
      return `    ${type}? ${symbol.name}`;
    })
    .join(',\n');

  const constructorParams = propertySymbols
    .map((symbol, index) => {
      const type = types[index]!;
      if (isTypeNullable(type)) {
        return `      ${symbol.name}: ${symbol.name} != null ? ${symbol.name}() : this.${symbol.name}`;
      }

      return `      ${symbol.name}: ${symbol.name} ?? this.${symbol.name}`;
    })
    .join(',\n');

  return `  ${action.symbol.name} copyWith({
${functionParams}    
  }) {
    return ${action.symbol.name}(
    ${constructorParams}
    );
  }\n`;
}

function containsNullable(types: (string | undefined)[]): boolean {
  return types.find((type) => isTypeNullable(type ?? '')) !== undefined;
}
