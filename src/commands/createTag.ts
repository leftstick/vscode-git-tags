import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from '../gitTagsViewProvider';

import { create, syncCreate } from '../services/gitTagsResolver';

export function createCMD(provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {
    return vscode.commands.registerCommand('extension.gitcreatetag', () => {
        vscode.window.showInputBox({
            placeHolder: 'Type a tag...'
        })
            .then(val => {
                return create(val, vscode.workspace.rootPath);
            })
            .then(() => {
                refreshTagsView();
                return vscode.window.showQuickPick(['Yes', 'No'], {
                    placeHolder: 'Would you like to sync this tag to remote repository?'
                });
            }, err => {
                if (err !== 'NO_VALUE') {
                    vscode.window.showErrorMessage(err);
                }
                return 'No';
            })
            .then(val => {
                if (val === 'Yes') {
                    return syncCreate(vscode.workspace.rootPath);
                }
            })
            .then(val => {
                if (val === 'SYNCED') {
                    vscode.window.setStatusBarMessage('Tag synchronised', 3000);
                }
            }, err => {
                if (err === 'SYNC_FAILED') {
                    vscode.window.showErrorMessage('Tag synchronised failed');
                }
            });

    });
}
