import * as vscode from 'vscode';
import { ClassDataCodeLens } from '../models/class-data-code-lens';
import { SymbolUtils } from './symbol-utils';
import { getAbsoluteTestFile } from './utils';

const fs = require('fs');

export class CodeLensUtils {
  public static async updateCodeLens(
    lens: ClassDataCodeLens,
  ): Promise<vscode.CodeLens> {
    const testPathAbsolute = getAbsoluteTestFile(lens.documentPath.path);

    const exist = fs.existsSync(testPathAbsolute);

    let matches = 0;
    let line = 0;
    if (exist) {
      try {
        const symbols = await vscode.commands.executeCommand<
          vscode.DocumentSymbol[]
        >(
          'vscode.executeDocumentSymbolProvider',
          vscode.Uri.parse(testPathAbsolute),
        );
        const parentSymbol = SymbolUtils.getTestParentSymbol(
          symbols,
          lens.className!,
        );
        if (parentSymbol) {
          matches = SymbolUtils.getNumberOfTests(parentSymbol);
          line = parentSymbol.range.start.line;
        }
      } catch (e) {
        console.log(e);
      }
    }

    const label = exist ? matches + ' tests' : 'Create a test file';
    return {
      ...lens,
      command: {
        title: label,
        command: 'flutter-toolkit.goTestFile',
        arguments: [line, 'codelens'],
      },
    };
  }
}
