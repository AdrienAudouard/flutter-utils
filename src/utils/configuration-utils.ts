import * as vscode from 'vscode';

export class ConfigurationUtils {
    public static getMinPercentageForCloseFile(): number {
        return this.getConfigurationValue<number>('flutter-utils', 'closestFileMinPercentage') ?? 0.8;
    }

    public static isCodeLensEnabled(): boolean {
        return this.getConfigurationValue<boolean>('flutter-utils.codeLens', 'enabled') ?? false;
    }

    public static isRenameSuggestionEnabled(): boolean {
        return this.getConfigurationValue<boolean>('flutter-utils.suggestions', 'renameTestFile') ?? false;
    }

    public static getTestFunctionsName(): string[] {
        return this.getConfigurationValue<string[]>('flutter-utils.codeLens', 'testFunctions') ?? [];
    }

    public static getConfigurationValue<T>(scope: string, key: string) {
        return vscode.workspace.getConfiguration(scope).get<T>(key);
    }
}