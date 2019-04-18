import * as vscode from 'vscode';

import { GitTagsViewProvider } from '../gitTagsViewProvider';

import { deleteTag, syncDelete } from '../services/gitTagsResolver';

export function deleteCMD(provider: GitTagsViewProvider, refreshTagsView: Function): vscode.Disposable {
    return vscode.commands.registerCommand('extension.deleteGitTag', async function (tag: string) {

        try {
            const picked = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Would you like to delete this tag from remote repository as well?'
            });
            const rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath
            if (picked === 'Yes') {
                await syncDelete(tag, rootFolder);
                await deleteTag(tag, rootFolder);
            }else {
                await deleteTag(tag, rootFolder);
            }
            
            refreshTagsView();
            vscode.window.setStatusBarMessage(`Remote tag ${tag} deleted`, 3000);
        } catch (err) {
            refreshTagsView();
            vscode.window.showErrorMessage('Delete remote Tag failed', err);
        }
    });
}
