import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from '../gitTagsViewProvider';

export function listCMD(context: vscode.ExtensionContext, provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {

    let panel: vscode.WebviewPanel

    return vscode.commands.registerCommand('extension.gittags', async function () {
        // The code you place here will be executed every time your command is executed

        refreshTagsView();

        if (vscode.workspace.textDocuments.every(t => t.fileName !== '/gittags')) {
            try {
                // await vscode.commands.executeCommand('vscode.previewHtml', GITTAGSURI, vscode.ViewColumn.One, 'Git Tags');

                if (!panel) {
                    panel = createWebPanel(context);
                    panel.onDidDispose(
                        () => {
                            // When the panel is closed, cancel any future updates to the webview content
                            provider.panel = panel = null;
                        },
                        null,
                        context.subscriptions
                    );
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
    const panel = vscode.window.createWebviewPanel('gittags', 'git tags', vscode.ViewColumn.One, {
        enableScripts: true
    });

    return panel;
}
