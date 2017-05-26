// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from './gitTagsViewProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "git tags" is now active!');


    const provider = new GitTagsViewProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider('gittags', provider);


    const disposable = vscode.commands.registerCommand('extension.gittags', () => {
        // The code you place here will be executed every time your command is executed

        if (vscode.workspace.textDocuments.some(t => t.fileName === '/gittags')) {
            return provider
                .updateTags()
                .catch(err => {
                    vscode.window.showErrorMessage(err);
                });
        }

        vscode.commands.executeCommand('vscode.previewHtml', GITTAGSURI, vscode.ViewColumn.One, 'Git Tags')
            .then(success => {
                return provider
                    .updateTags()
                    .then(() => {
                        vscode.window.setStatusBarMessage('Double click on commit for copying hash into clipboard', 5000);
                    })
                    .catch(err => {
                        vscode.window.showErrorMessage(err);
                    });
            }, reason => {
                vscode.window.showErrorMessage(reason);
            });

    });

    context.subscriptions.push(disposable, registration);

}

// this method is called when your extension is deactivated
export function deactivate() {
}