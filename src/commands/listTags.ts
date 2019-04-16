import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from '../gitTagsViewProvider';

let panel: vscode.WebviewPanel;

export function listCMD(context: vscode.ExtensionContext, provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {


    return vscode.commands.registerCommand('extension.gittags', async function () {
        // The code you place here will be executed every time your command is executed

        refreshTagsView();

        if (vscode.workspace.textDocuments.every(t => t.fileName !== '/gittags')) {
            try {
                if (!panel) {
                    createWebPanel(context);
                } else if (!panel.visible) {
                    panel.reveal()
                }
                provider.panel = panel;
                provider.refreshView();
            } catch (err) {
                vscode.window.showErrorMessage(err);
            }
        }

    });
}

function createWebPanel(context: vscode.ExtensionContext){
    panel = vscode.window.createWebviewPanel('gittags', 'git tags', vscode.ViewColumn.One, {
        enableScripts: true
    });
    panel.onDidDispose(
        () => {
            // When the panel is closed, cancel any future updates to the webview content
            panel = null;
        },
        null,
        context.subscriptions
    );

    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'deleteTag':
                    vscode.commands.executeCommand('extension.deleteGitTag', message.text);
                    return;
            }
        },
        undefined,
        context.subscriptions
    );
}
