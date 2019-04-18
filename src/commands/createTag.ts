import * as vscode from 'vscode';

import { GitTagsViewProvider } from '../gitTagsViewProvider';

import { create, createWithMessage, syncCreate } from '../services/gitTagsResolver';

export function createCMD(provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {
    return vscode.commands.registerCommand('extension.gitcreatetag', async function () {

        try {
            const tag = await vscode.window.showInputBox({
                placeHolder: 'Type a tag...'
            });

            if (!tag || !tag.trim()) {
                return;
            }

            const message = await vscode.window.showInputBox({
                placeHolder: 'Type a message...'
            });

            if (message) {
                await createWithMessage(tag, message, vscode.workspace.rootPath);
            } else {
                await create(tag, vscode.workspace.rootPath);
            }

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
