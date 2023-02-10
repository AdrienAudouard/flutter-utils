import { TextEditor, Uri, window, workspace } from "vscode";
import { findClosestTestFiles } from "../utils/files-utils";
import { getAbsolutePath, getRelativePath, getRelativeTestPath, isTestFileExisting, openDocumentInEditor } from "../utils/utils";

export async function functiononEditorChanged(event: TextEditor | undefined) {
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

    const fileRelativePath = getRelativePath(path);
    const testPath = getRelativeTestPath(fileRelativePath);
    const testPathAbsolute = getAbsolutePath(testPath);
    const closest = findClosestTestFiles(testPathAbsolute);
    const paths = closest.map((el) => ({ title: el.target.split('/').reverse()[0], path: el.target })).slice(0, 3);

    const response = await window.showInformationMessage("Test files that might contain tests for this file, do you want to rename one?", ...paths);

    if (!response || !paths.includes(response)) {
        return;
    }

    const message = `Are you sure you want to rename ${getRelativePath(response.path)} to ${testPath}`;
    const yesNoResponse = await window.showInformationMessage(message, "Yes", "No");

    if (yesNoResponse !== "Yes") {
        return;
    }

    await workspace.fs.rename(Uri.parse(response.path), Uri.parse(testPathAbsolute));

    openDocumentInEditor(testPathAbsolute);
}