import * as vscode from 'vscode';

export class ConfigurationUtils {
  static properties = [
    { scope: 'flutter-utils', key: 'closestFileMinPercentage' },
    { scope: 'flutter-utils.codeLens', key: 'enabled' },
    { scope: 'flutter-utils.suggestions', key: 'renameTestFile' },
    { scope: 'flutter-utils.codeLens', key: 'testFunctions' },
  ];

  public static getMinPercentageForCloseFile(): number {
    return (
      this.getConfigurationValue<number>(
        'flutter-utils',
        'closestFileMinPercentage',
      ) ?? 0.8
    );
  }

  public static isCodeLensEnabled(): boolean {
    return (
      this.getConfigurationValue<boolean>(
        'flutter-utils.codeLens',
        'enabled',
      ) ?? false
    );
  }

  public static isRenameSuggestionEnabled(): boolean {
    return (
      this.getConfigurationValue<boolean>(
        'flutter-utils.suggestions',
        'renameTestFile',
      ) ?? false
    );
  }

  public static getTestFunctionsName(): string[] {
    return (
      this.getConfigurationValue<string[]>(
        'flutter-utils.codeLens',
        'testFunctions',
      ) ?? []
    );
  }

  public static getConfigurationValue<T>(scope: string, key: string) {
    return vscode.workspace.getConfiguration(scope).get<T>(key);
  }

  public static getUserProperties(): { [key: string]: string } {
    return {
      code_lens_enabled: this.isCodeLensEnabled().toString(),
      closest_file_percent: this.getMinPercentageForCloseFile().toString(),
      rename_suggestion_enabled: this.isRenameSuggestionEnabled().toString(),
      test_function_names: this.getTestFunctionsName().toString(),
    };
  }
}
