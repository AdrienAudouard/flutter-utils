import * as vscode from 'vscode';
import { ConfigurationUtils } from './configuration.utils';

export class SymbolUtils {
  public static getTestParentSymbol(
    parent: vscode.DocumentSymbol[],
    symbolName: string,
  ): vscode.DocumentSymbol | undefined {
    if (parent.length === 0) {
      return undefined;
    }

    for (const element of parent) {
      if (
        element.name.includes('group') &&
        element.name.toLowerCase().includes(symbolName.toLowerCase())
      ) {
        return element;
      }
    }

    return this.getTestParentSymbol(
      parent.map((element) => element.children).flat(),
      symbolName,
    );
  }

  public static getNumberOfTests(
    parent: vscode.DocumentSymbol | vscode.DocumentSymbol[],
  ): number {
    if (!Array.isArray(parent)) {
      return this.getNumberOfTests(parent.children);
    }

    if (parent.length === 0) {
      return 0;
    }

    const count = parent.filter((element) =>
      this.isTestFunction(element),
    ).length;
    const toSearch = parent.map((element) => element.children).flat();

    return count + this.getNumberOfTests(toSearch);
  }

  private static isTestFunction(element: vscode.DocumentSymbol): boolean {
    const testFunctions = ConfigurationUtils.getTestFunctionsName();

    for (const testFunction of testFunctions) {
      if (element.name.includes(testFunction)) {
        return true;
      }
    }

    return false;
  }
}
