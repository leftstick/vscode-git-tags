import * as vscode from 'vscode';
import * as path from 'path';
import t from 'lodash/template';

import { Tag } from '../model';

function compile(webview: vscode.Webview) {
    return t(`
    <html>
        <link rel="stylesheet" href="${assetPath(webview, 'css', 'gittags.css')}" >
        <body>
            <div id="container" class="ag-theme-blue"></div>

            <script>
            window.rows = <%= JSON.stringify(obj.tags) %>
            </script>
            <script src="${assetPath(webview, 'js', 'aggrid.js')}"></script>
            <script src="${assetPath(webview, 'js', 'app.js')}"></script>
        </body>
    </html>
`, { variable: 'obj' });
}


export function html(tags: Array<Tag>, webview: vscode.Webview) {
    return compile(webview)({
        tags
    });
}

function assetPath(webview: vscode.Webview, ...args: string[]) {
    return webview.asWebviewUri(vscode.Uri.file(path.join(__dirname, '..', '..', 'assets', ...args)))
}

