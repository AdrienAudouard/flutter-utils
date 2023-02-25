import * as fs from 'fs';
import * as vscode from 'vscode';
import { analyticsService } from '../services/analytics.service';
import { getSourcePath, openDocumentInEditor } from '../utils/utils';

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

    const sourcePath = getSourcePath(filePath);

    const exist = fs.existsSync(sourcePath);

    if (!exist) {
        vscode.window.showInformationMessage('Source file ' + sourcePath + ' do not exists');
        return;
    }

    analyticsService.tagEvent('open-source-file', {source: 'command'});
    openDocumentInEditor(sourcePath);
}