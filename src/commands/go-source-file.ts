import * as fs from 'fs';
import * as vscode from 'vscode';
import { getAbsolutePath, getRelativePath, getRelativeSourcePath, openDocumentInEditor } from '../utils/utils';

export async function goSourceFile() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showInformationMessage('Error: no active editor found.');
        return;
    }

    const filePath = editor.document.uri.path;

    if (!filePath) {
        vscode.window.showInformationMessage('Error: unable to find path for current editor.');
        return;
    }

    const workspacePath = vscode.workspace.workspaceFolders![0].uri.path;

    if (!filePath.startsWith(workspacePath)) {
        vscode.window.showInformationMessage('Error: file not in current workspace.');
        return;
    }

    const fileRelativePath = getRelativePath(filePath);
    const sourcePath = getRelativeSourcePath(fileRelativePath);
    const sourceAbsolutePath = getAbsolutePath(sourcePath);

    const exist = fs.existsSync(sourceAbsolutePath);

    if (!exist) {
        vscode.window.showInformationMessage('Source file ' + sourceAbsolutePath + ' do not exists');
        return;
    }

    openDocumentInEditor(sourceAbsolutePath);
}