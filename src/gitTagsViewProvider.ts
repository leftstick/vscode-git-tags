import * as vscode from 'vscode';

import { Tag } from './model';
import { tags } from './services/gitTagsResolver';
import { html } from './template';

export const GITTAGSURI = vscode.Uri.parse('gittags://sourcecontrol/gittags');


export class GitTagsViewProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private _tags: Array<Tag>;

    public provideTextDocumentContent(uri: vscode.Uri): string {
        if (!this._tags) {
            return '';
        }

        return html(this._tags);
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public async updateTags() {

        const cwd = vscode.workspace.rootPath;

        this._tags = await tags(cwd);

        console.log(this._tags);

        this._onDidChange.fire(GITTAGSURI);
    }
}