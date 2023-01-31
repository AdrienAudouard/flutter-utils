import * as vscode from 'vscode';
import { ClassDataCodeLens } from "../models/class-data-code-lens";
import { SymbolUtils } from './symbol-utils';
import { getAbsolutePath, getRelativePath, getRelativeTestPath } from "./utils";

const fs = require('fs');

export class CodeLensUtils {
    public static async updateCodeLens(lens: ClassDataCodeLens) {
        const fileRelativePath = getRelativePath(lens.documentPath.path);
        const testPath = getRelativeTestPath(fileRelativePath);
        const testPathAbsolute = getAbsolutePath(testPath);

        const exist = fs.existsSync(testPathAbsolute);

        let matches = 0;
        if (exist) {
            try {
                const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>("vscode.executeDocumentSymbolProvider", vscode.Uri.parse(testPathAbsolute));
                const parentSymbol = SymbolUtils.getTestParentSymbol(symbols, lens.className!);
                if (parentSymbol) {
                    matches = SymbolUtils.getNumberOfTests(parentSymbol);
                }
            } catch (e) {
                console.log(e);
            }
        }

        const label = exist ? matches + ' tests' : 'Create a test file';
        return { ...lens, command: { title: label, command: 'flutter-utils.goTestFile' } };
    }
}