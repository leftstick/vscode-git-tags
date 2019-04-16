import * as vscode from 'vscode';

import { GitTagsViewProvider, GITTAGSURI } from '../gitTagsViewProvider';

import { deleteTag, syncDelete } from '../services/gitTagsResolver';

export function deleteCMD(provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {
    return vscode.commands.registerCommand('extension.deleteGitTag', async function (tag: string) {

        try {
            const picked = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Would you like to delete this tag from remote repository as well?'
            });
            if (picked !== 'Yes') {
                return;
            }
            await deleteTag(tag, vscode.workspace.rootPath);
            refreshTagsView();
            await syncDelete(tag, vscode.workspace.rootPath);
            vscode.window.setStatusBarMessage(`Remote tag ${tag} deleted`, 3000);
        } catch (err) {
            vscode.window.showErrorMessage('Delete remote Tag failed');
        }
    });
}
