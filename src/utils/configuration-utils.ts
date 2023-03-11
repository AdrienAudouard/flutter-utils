import * as vscode from 'vscode';
import { TestSyncConfigurationValue } from '../event_handler/on-rename-file.handler';

export class ConfigurationUtils {
  static properties = [
    { scope: 'flutter-toolkit', key: 'closestFileMinPercentage' },
    { scope: 'flutter-toolkit.codeLens', key: 'enabled' },
    { scope: 'flutter-toolkit.suggestions', key: 'renameTestFile' },
    { scope: 'flutter-toolkit.codeLens', key: 'testFunctions' },
    { scope: 'flutter-toolkit.synchronisation', key: 'onRename' },
    { scope: 'flutter-toolkit', key: 'quickFixes' },
  ];

  public static getMinPercentageForCloseFile(): number {
    return (
      this.getConfigurationValue<number>(
        'flutter-toolkit',
        'closestFileMinPercentage',
      ) ?? 0.8
    );
  }

  public static isCodeLensEnabled(): boolean {
    return (
      this.getConfigurationValue<boolean>(
        'flutter-toolkit.codeLens',
        'enabled',
      ) ?? false
    );
  }

  public static getTestFileSyncValue(): TestSyncConfigurationValue {
    return (
      this.getConfigurationValue<TestSyncConfigurationValue>(
        'flutter-toolkit.synchronisation',
        'onRename',
      ) ?? TestSyncConfigurationValue.never
    );
  }

  public static setTestFileSyncToAlways() {
    vscode.workspace
      .getConfiguration('flutter-toolkit.synchronisation')
      .update('onRename', TestSyncConfigurationValue.always);
  }

  public static isTestFileSyncEnabled(): boolean {
    const value = this.getTestFileSyncValue();

    return (
      value === TestSyncConfigurationValue.always ||
      value === TestSyncConfigurationValue.ask
    );
  }

  public static isRenameSuggestionEnabled(): boolean {
    return (
      this.getConfigurationValue<boolean>(
        'flutter-toolkit.suggestions',
        'renameTestFile',
      ) ?? false
    );
  }

  public static isQuickFixesEnabled(): boolean {
    return this.getConfigurationValue('flutter-toolkit', 'quickFixes') ?? false;
  }

  public static getTestFunctionsName(): string[] {
    return (
      this.getConfigurationValue<string[]>(
        'flutter-toolkit.codeLens',
        'testFunctions',
      ) ?? []
    );
  }

  public static getConfigurationValue<T>(scope: string, key: string) {
    return vscode.workspace.getConfiguration(scope).get<T>(key);
  }

  public static getUserProperties(): { [key: string]: string } {
    const properties: any = {};

    this.properties.forEach((props) => {
      properties[props.scope + '.' + props.key] = this.getConfigurationValue(
        props.scope,
        props.key,
      );
    });

    return properties;
  }
}
