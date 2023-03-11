import { v4 as uuidv4 } from 'uuid';
import * as vscode from 'vscode';

export class UserService {
  private static userIdKey = 'user_id';

  static getUserId(context: vscode.ExtensionContext): string {
    if (context.globalState.get(this.userIdKey)) {
      return context.globalState.get(this.userIdKey)!;
    }

    const id = uuidv4();
    context.globalState.update(this.userIdKey, id);

    return id;
  }

  static getAppVersion(): string {
    return vscode.extensions.getExtension('AdrienAudouard.flutter-toolkit')
      ?.packageJSON.version;
  }
}
