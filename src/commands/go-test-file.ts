import * as fs from 'fs';
import * as p from 'path';
import * as vscode from 'vscode';
import { getAbsolutePath, getRelativePath, getRelativeTestPath, openDocumentInEditor } from '../utils/utils';

export async function goTestFile() {
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
    const testPath = getRelativeTestPath(fileRelativePath);
    const testPathAbsolute = getAbsolutePath(testPath);

    const exist = fs.existsSync(testPathAbsolute);

    if (!exist) {
        const selection = await vscode.window.showQuickPick(["Yes", "No"], { "placeHolder": "Test file do not exists'. Do you want to create it?" });

        if (selection !== 'Yes') {
            return;
        }

        fs.mkdirSync(p.dirname(testPathAbsolute), { recursive: true });

        fs.writeFileSync(testPathAbsolute, '');

        vscode.window.showInformationMessage('Test file created');
    }

    openDocumentInEditor(testPathAbsolute);
}