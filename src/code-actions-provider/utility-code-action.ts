import * as vscode from 'vscode';
import { UtilityActionType } from './utility-action-type';

export class UtilityCodeAction extends vscode.CodeAction {
  type: UtilityActionType;
  symbol: vscode.DocumentSymbol;
  document: vscode.TextDocument;

  constructor(
    title: string,
    kind: vscode.CodeActionKind,
    type: UtilityActionType,
    symbol: vscode.DocumentSymbol,
    document: vscode.TextDocument,
  ) {
    super(title, kind);

    this.symbol = symbol;
    this.type = type;
    this.document = document;
  }
}
