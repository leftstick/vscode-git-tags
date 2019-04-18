import * as vscode from 'vscode';
import * as path from 'path';
import t from 'lodash/template';

import { Tag } from '../model';

const compiled = t(`
        <html>
            <link rel="stylesheet" href="${assetPath('css', 'gittags.css')}" >
            <body>
                <div id="container" class="ag-theme-blue"></div>

                <script>
                window.rows = <%= JSON.stringify(obj.tags) %>
                </script>
                <script src="${assetPath('js', 'aggrid.js')}"></script>
                <script src="${assetPath('js', 'app.js')}"></script>
            </body>
        </html>
    `, { variable: 'obj' });

export function html(tags: Array<Tag>) {
    return compiled({
        tags
    });
}

function assetPath(...args) {
    return vscode.Uri.file(path.join(__dirname, '..', '..', 'assets', ...args)).with({
        scheme: 'vscode-resource'
      });
}

function nodeModulesPath(...args) {
    return vscode.Uri.file(path.join(__dirname, '..', '..', 'node_modules', ...args)).toString();
}
