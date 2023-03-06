import * as vscode from 'vscode';
import { TestSyncConfigurationValue } from '../event_handler/on-rename-file.handler';

export class ConfigurationUtils {
  static properties = [
    { scope: 'flutter-utils', key: 'closestFileMinPercentage' },
    { scope: 'flutter-utils.codeLens', key: 'enabled' },
    { scope: 'flutter-utils.suggestions', key: 'renameTestFile' },
    { scope: 'flutter-utils.codeLens', key: 'testFunctions' },
    { scope: 'flutter-utils.synchronisation', key: 'onRename' },
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

  public static getTestFileSyncValue(): TestSyncConfigurationValue {
    return (
      this.getConfigurationValue<TestSyncConfigurationValue>(
        'flutter-utils.synchronisation',
        'onRename',
      ) ?? TestSyncConfigurationValue.never
    );
  }

  public static setTestFileSyncToAlways() {
    vscode.workspace
      .getConfiguration('flutter-utils.synchronisation')
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
