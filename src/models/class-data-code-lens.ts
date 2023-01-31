import * as vscode from 'vscode';

export class ClassDataCodeLens extends vscode.CodeLens {
    className?: string;
    documentPath: vscode.Uri;
    symbol?: vscode.DocumentSymbol;

    constructor(range: vscode.Range, documentPath: vscode.Uri, options: { className?: string, symbol: vscode.DocumentSymbol }) {
        super(range);

        this.className = options.className;
        this.documentPath = documentPath;
        this.symbol = options.symbol;
    }
}