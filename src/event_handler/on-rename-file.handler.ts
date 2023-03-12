import { renameSync } from 'fs';
import * as vscode from 'vscode';
import { analyticsService } from '../services/analytics.service';
import { ConfigurationUtils } from '../utils/configuration.utils';
import { isFileExisting } from '../utils/files-utils';
import { output } from '../utils/output-channel';
import { getAbsoluteTestFile, getRelativePath } from '../utils/utils';

export async function onRenameFiles(event: vscode.FileRenameEvent) {
  event.files.forEach(async (file) => {
    try {
      await onRenameFile(file);
    } catch (err) {
      analyticsService.trackError(err);
    }
  });
}

async function onRenameFile(file: {
  readonly oldUri: vscode.Uri;
  readonly newUri: vscode.Uri;
}) {
  const testPathAbsolute = getAbsoluteTestFile(file.oldUri.path);
  const isTestFileExisting = isFileExisting(testPathAbsolute);

  if (!isTestFileExisting) {
    return;
  }

  if (
    ConfigurationUtils.getTestFileSyncValue() === TestSyncConfigurationValue.ask
  ) {
    const selection = await vscode.window.showQuickPick(
      ['Yes', 'No', 'Always'],
      {
        title: 'Test file do not exists. Do you want to create it?',
      },
    );

    analyticsService.tagEvent('rename-modal-displayed', {
      value: selection ?? '',
    });

    if (selection !== 'Yes' && selection !== 'Always') {
      return;
    }

    if (selection === 'Always') {
      ConfigurationUtils.setTestFileSyncToAlways();
    }
  }

  const newTestPath = getAbsoluteTestFile(file.newUri.path);
  analyticsService.tagEvent('sync-test-file');

  renameSync(testPathAbsolute, newTestPath);

  output.append(
    `Test file "${getRelativePath(
      testPathAbsolute,
    )}" renamed to "${getRelativePath(newTestPath)}".`,
  );
  output.show();
}

export enum TestSyncConfigurationValue {
  always = 'Always',
  ask = 'Ask',
  never = 'Never',
}
