import * as fs from 'fs';
import * as vscode from 'vscode';

export function getAbsolutePath(path: String) {
    const workspacePath = vscode.workspace.workspaceFolders![0].uri.path;
    return workspacePath + path;
}

export function isTestFileExisting(path: string): boolean {
    const testPathAbsolute = getAbsoluteTestFile(path);

    return fs.existsSync(testPathAbsolute);
}

export function getRelativeTestPath(path: string) {
    const testFolder = getTestFolder();

    return path.replace('/lib', testFolder).replace('.dart', '_test.dart');
}

export function getSourcePath(path: string) {
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

export function getAbsoluteTestFile(filePath: string): string {
    const testFolder = getAbsoluteTestFolderForFile(filePath);
    const rootFolder = testFolder.replace(getTestFolder(), '');
    const fileRelative = filePath.replace(rootFolder, '').replace('/lib', '');
    return (testFolder + fileRelative).replace('//', '/').replace('.dart', '_test.dart');
}

// Search the nearest test folder of the given test file
export function getAbsoluteTestFolderForFile(testFile: string): string {
    const root = getAbsoluteLibRootFolder(testFile);

    return root + getTestFolder();
}

export function getAbsoluteLibRootFolder(filePath: string): string {
    const workspacePath = vscode.workspace.workspaceFolders![0].uri.path;

    let parent = getParentPath(filePath);
    let findTestFolder = false;
    do {
        const files = fs.readdirSync(parent);
        const containsTestFolder = files.find(isPackageRootDir);

        if (containsTestFolder) {
            findTestFolder = true;
        } else {
            parent = getParentPath(parent);
        }

    } while(parent.length !== 0 && parent !== workspacePath && !findTestFolder);

    return parent;
}

export function isPackageRootDir(path: string): boolean {
    return path.endsWith('pubspec.yaml');
}

// Return the path of the parent folder.
// For example, for a file with a path "/parent/file.js" it will return "/parent"
export function getParentPath(file: String): string {
    const fileParts = file.split('/');
    fileParts.pop();

    return fileParts.join('/').replace('//', '/');
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