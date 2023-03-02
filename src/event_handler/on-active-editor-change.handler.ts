import { TextEditor, Uri, window, workspace } from 'vscode';
import { analyticsService } from '../services/analytics.service';
import { findClosestTestFiles } from '../utils/files-utils';
import {
  getAbsoluteLibRootFolder,
  getAbsoluteTestFile,
  getRelativePath,
  isTestFileExisting,
  openDocumentInEditor,
} from '../utils/utils';

export async function onEditorChangedWrapper(event: TextEditor | undefined) {
  try {
    await onEditorChanged(event);
  } catch (err) {
    analyticsService.trackError(err);
  }
}

async function onEditorChanged(event: TextEditor | undefined) {
  if (!event) {
    return;
  }

  const path = event.document.uri.path;

  if (path.endsWith('_test.dart')) {
    return;
  }

  const testFileExisting = isTestFileExisting(path);

  if (testFileExisting) {
    return;
  }

  const testPathAbsolute = getAbsoluteTestFile(path);
  const libRootFolder = getAbsoluteLibRootFolder(path);
  const closest = findClosestTestFiles(testPathAbsolute, libRootFolder);

  if (closest.length === 0) {
    return;
  }

  const paths = closest
    .map((el) => ({
      title: el.target.split('/').reverse()[0],
      path: el.target,
    }))
    .slice(0, 3);

  const response = await window.showInformationMessage(
    'Test files that might contain tests for this file, do you want to rename one?',
    ...paths,
  );

  if (!response || !paths.includes(response)) {
    return;
  }

  const message = `Are you sure you want to rename ${getRelativePath(
    response.path,
  )} to ${testPathAbsolute}`;
  const yesNoResponse = await window.showInformationMessage(
    message,
    'Yes',
    'No',
  );

  if (yesNoResponse !== 'Yes') {
    return;
  }

  await workspace.fs.rename(
    Uri.parse(response.path),
    Uri.parse(testPathAbsolute),
  );
  analyticsService.tagEvent('rename-test-file');

  openDocumentInEditor(testPathAbsolute);
}
