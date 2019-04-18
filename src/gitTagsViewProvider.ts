import * as vscode from 'vscode';

import { tags, refreshFromRemote } from './services/gitTagsResolver';
import { html } from './template';


export class GitTagsViewProvider {
    // private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    // private _tags: Array<Tag>;
    private _panel: vscode.WebviewPanel;

    constructor() {
        refreshFromRemote(vscode.workspace.rootPath)
    }

    // public provideTextDocumentContent(uri: vscode.Uri): string {
    //     if (!this._tags) {
    //         return '';
    //     }

    //     return html(this._tags);
    // }

    set panel(panel: vscode.WebviewPanel){
        this._panel = panel
    }

    // get onDidChange(): vscode.Event<vscode.Uri> {
    //     return this._onDidChange.event;
    // }

    // public async updateTags() {

    //     const cwd = vscode.workspace.rootPath;

    //     this._tags = await tags(cwd);

    //     this._onDidChange.fire(GITTAGSURI);
    // }

    private async getInitHtml(): Promise<string> {
        const cwd = vscode.workspace.rootPath;
        const tagList =  await tags(cwd);
        return html(tagList);
    }

    public async refreshView() {
        if(!this._panel){
            return;
        }
        const html = await this.getInitHtml()
        this._panel.webview.html = html;
    }
}