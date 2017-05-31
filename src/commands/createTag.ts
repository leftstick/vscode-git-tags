import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from '../gitTagsViewProvider';

import { create, syncCreate } from '../services/gitTagsResolver';

export function createCMD(provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {
    return vscode.commands.registerCommand('extension.gitcreatetag', async function () {

        try {
            const tag = await vscode.window.showInputBox({
                placeHolder: 'Type a tag...'
            });

            if (!tag || !tag.trim()) {
                return;
            }

            await create(tag, vscode.workspace.rootPath);

            refreshTagsView();

            const picked = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Would you like to sync this tag to remote repository?'
            });

            if (picked !== 'Yes') {
                return;
            }

            await syncCreate(vscode.workspace.rootPath);

            vscode.window.setStatusBarMessage('Tag synchronised', 3000);

        } catch (err) {
            vscode.window.showErrorMessage(err);
        }

    });
}
