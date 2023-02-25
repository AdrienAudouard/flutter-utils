import * as fs from 'fs';
import * as p from 'path';
import * as vscode from 'vscode';
import { analyticsService } from '../services/analytics.service';
import { findClosestTestFiles } from '../utils/files-utils';
import { getAbsoluteLibRootFolder, getAbsolutePath, getAbsoluteTestFile, getRelativePath, getTestFileSnippet, isTestFileExisting, openDocumentInEditor } from '../utils/utils';

const createLabel = 'Create test file';
const cancelLabel = 'Cancel';

export async function goTestFile(line?: number, source?: string) {
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

    const testPathAbsolute = getAbsoluteTestFile(filePath);
    const exist = isTestFileExisting(filePath);

    if (!exist) {
        const libRootFolder = getAbsoluteLibRootFolder(filePath);
        const closest = findClosestTestFiles(testPathAbsolute, libRootFolder);
        const options = [createLabel, cancelLabel, ...closest.map((file: { target: String, rating: number }) => {
            const percent = (file.rating * 100).toFixed(2);
            return getRelativePath(file.target) + ' - ' + percent + ' %';
        })];

        const selection = await vscode.window.showQuickPick(options, { "title": "Test file do not exists. Do you want to create it?" });

        if (selection === cancelLabel || !options.includes(selection ?? '')) {
            analyticsService.tagEvent('open-test-file-cancel', {source: source ?? 'command'});
            return;
        }

        if (selection === createLabel) {
            fs.mkdirSync(p.dirname(testPathAbsolute), { recursive: true });

            fs.writeFileSync(testPathAbsolute, getTestFileSnippet());

            vscode.window.showInformationMessage('Test file created');

            analyticsService.tagEvent('create-test-file', {source: source ?? 'command'});
            tagOpenTestFile(source);
            openDocumentInEditor(testPathAbsolute, line);
        } else {
            const selectionPath = selection!.split('-')[0].trim();
            tagOpenTestFile(source);
            openDocumentInEditor(getAbsolutePath(selectionPath), line);
        }
    } else {
        tagOpenTestFile(source);
        openDocumentInEditor(testPathAbsolute, line);
    }
}

function tagOpenTestFile(source?: string) {
    analyticsService.tagEvent('open-test-file', {source: source ?? 'command'});
}