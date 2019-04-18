// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { GitTagsViewProvider } from './gitTagsViewProvider';

import { createCMD, deleteCMD, listCMD } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "git tags" is now active!');

    const provider = new GitTagsViewProvider();
    // const registration = vscode.workspace.registerTextDocumentContentProvider('gittags', provider);

    async function refreshTagsView() {
        try {
            await provider.refreshView();
        } catch (err) {
            vscode.window.showErrorMessage(err.message || err);
        }
    }

    context.subscriptions.push(listCMD(context, provider, refreshTagsView));
    context.subscriptions.push(createCMD(provider, refreshTagsView));
    context.subscriptions.push(deleteCMD(provider, refreshTagsView));

    // context.subscriptions.push(registration);
}

// this method is called when your extension is deactivated
export function deactivate() {
}