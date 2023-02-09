import * as vscode from 'vscode';

export function getAbsolutePath(path: String) {
    const workspacePath = vscode.workspace.workspaceFolders![0].uri.path;
    return workspacePath + path;
}

export function getRelativeTestPath(path: string) {
    const testFolder = getTestFolder();

    return path.replace('/lib', testFolder).replace('.dart', '_test.dart');
}

export function getRelativeSourcePath(path: string) {
    const testFolder = getTestFolder();

    return path.replace(testFolder, '/lib/',).replace('_test.dart', '.dart');
}

export function getRelativePath(path: String) {
    const workspacePath = vscode.workspace.workspaceFolders![0].uri.path;
    return path.substring(workspacePath.length);
}

export function getRelativeTestFolder() {
    const workspacePath = vscode.workspace.workspaceFolders![0].uri.path;
    const testFolder = getTestFolder();

    return workspacePath + testFolder;
}

function getTestFolder() {
    const subFolder = vscode.workspace.getConfiguration('flutter-utils').get('testFileFolder') as string;
    const subFolderPath = subFolder.length >= 0 ? '/' + subFolder : '';

    return '/test' + subFolderPath;
}

export function openDocumentInEditor(filePath: string, line?: number) {
    var openPath = vscode.Uri.parse("file://" + filePath);
    vscode.workspace.openTextDocument(openPath).then(doc => {
        vscode.window.showTextDocument(doc).then(() => {
            if (!line) {
                return;
            }
            /// Set the scroll and the cursor to the position we want
            const editor = vscode.window.activeTextEditor;
            const newPosition = new vscode.Position(line, 0);
            const newSelection = new vscode.Selection(newPosition, newPosition);
            editor!.selection = newSelection;

            const lineToGo = Math.max(0, line - 10);
            const scrollPosition = new vscode.Position(lineToGo, 0);
            const range = new vscode.Range(scrollPosition, scrollPosition);

            editor?.revealRange(range);
        });
    });
}

export function getTestFileSnippet(): string {

    return `import 'package:flutter_test/flutter_test.dart';

void main() {
	group(
		'', 
		() {
			
		},
	);
}`;
}