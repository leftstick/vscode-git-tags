import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from '../gitTagsViewProvider';

import { deleteTag, syncDelete } from '../services/gitTagsResolver';

export function deleteCMD(provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {
    return vscode.commands.registerCommand('extension.deleteGitTag', (tag: string) => {

        deleteTag(tag, vscode.workspace.rootPath)
            .then(val => {
                refreshTagsView();
                return vscode.window.showQuickPick(['Yes', 'No'], {
                    placeHolder: 'Would you like to delete this tag from remote repository as well?'
                });
            }, err => {
                vscode.window.showErrorMessage('Tag deleted failed');
                return 'No';
            })
            .then(val => {
                if (val === 'Yes') {
                    return syncDelete(tag, vscode.workspace.rootPath);
                }
            })
            .then(val => {
                if (val === 'SYNCED') {
                    vscode.window.setStatusBarMessage(`Remote tag ${tag} deleted`, 3000);
                }
            })
            .catch(err => {
                vscode.window.showErrorMessage('Delete remote Tag failed');
            });
    });
}
