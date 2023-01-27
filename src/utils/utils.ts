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

export function openDocumentInEditor(filePath: string) {
    var openPath = vscode.Uri.parse("file://" + filePath);
    vscode.workspace.openTextDocument(openPath).then(doc => {
        vscode.window.showTextDocument(doc);
    });
}

export function getTestFileSnippet(): string {

    return `import 'package:test/test.dart'; 

void main() {
	group(
		'', 
		() {
			
		},
	);
}`;
}