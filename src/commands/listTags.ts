import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from '../gitTagsViewProvider';

export function listCMD(provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {
    return vscode.commands.registerCommand('extension.gittags', () => {
        // The code you place here will be executed every time your command is executed

        refreshTagsView();

        vscode.commands.executeCommand('vscode.previewHtml', GITTAGSURI, vscode.ViewColumn.One, 'Git Tags')
            .then(success => {
                return provider
                    .updateTags()
                    .catch(err => {
                        vscode.window.showErrorMessage(err);
                    });
            }, reason => {
                vscode.window.showErrorMessage(reason);
            });

    });
}
