import * as vscode from 'vscode';
import { activateCommands } from './commands';
import { activateEventHandlers } from './event_handler';
import { activateProviders } from './providers';
import { analyticsService } from './services/analytics.service';
import { UserService } from './services/user.service';

export function activate(context: vscode.ExtensionContext) {
  try {
    activeExtension(context);
  } catch (err) {
    analyticsService.trackError(err);
  }
}

function activeExtension(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    analyticsService.init(UserService.getUserId(context)),
  );

  activateCommands(context);
  activateProviders(context);
  activateEventHandlers(context);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      analyticsService.updateUserProperties();
      analyticsService.trackUpdatedProperties(event);
    }),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  analyticsService.endSession();
}
