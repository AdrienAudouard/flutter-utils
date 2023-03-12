import * as path from 'path';
import { Position, workspace, WorkspaceEdit } from 'vscode';
import { UtilityCodeAction } from '../utility-code-action';

const JSON_ANNOTATION_IMPORT =
  "import 'package:json_annotation/json_annotation.dart';";
const JSON_ANNOTATION = '@JsonSerializable()';

export async function implementJsonSerializable(action: UtilityCodeAction) {
  const edit = new WorkspaceEdit();

  const importContent = getImportContent(action);

  edit.insert(
    action.document.uri,
    new Position(0, 0),
    JSON_ANNOTATION_IMPORT + '\n',
  );
  edit.insert(action.document.uri, action.symbol.range.start, importContent);

  const methodsContent = getJsonSerializableMethods(action);

  const methodsPosition = new Position(action.symbol.range.end.line, 0);
  edit.insert(action.document.uri, methodsPosition, methodsContent);

  await workspace.applyEdit(edit);
}

function getImportContent(action: UtilityCodeAction) {
  const partFilename = path
    .basename(action.document.fileName)
    .replace('.dart', '.g.dart');
  const partLine = `part '${partFilename}'`;

  return `${partLine};

${JSON_ANNOTATION}\n`;
}

function getJsonSerializableMethods(action: UtilityCodeAction) {
  return `  Map<String, dynamic> toJson() => _\$${action.symbol.name}ToJson(this);

  factory ${action.symbol.name}.fromJson(Map<String, dynamic> json) => _\$${action.symbol.name}FromJson(json);\n`;
}
