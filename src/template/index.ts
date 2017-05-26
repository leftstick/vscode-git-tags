import * as vscode from 'vscode';
import * as path from 'path';
import * as t from 'lodash.template';

import { Tag } from '../model';

const compiled = t(`
        <html>
            <link rel="stylesheet" href="${assetPath('css', 'gittags.css')}" >
            <body>
                <div class="create-section">
                    <input placeholder="Type new tag..."/>
                    <a>Create Tag</a>
                </div>
                <div class="container">
                    <% for(var i = 0; i < obj.tags.length; i++) { %>
                    <% const tag = obj.tags[i]; %>

                    <div class="line">
                        <div class="hash"><%= tag.hash %></div>
                        <div class="tag"><%= tag.tag %></div>
                        <div class="commit"><%= tag.commitMessage %></div>
                        <div class="oper">
                            <a href="<%= encodeURI('command:extension.deleteTag?' + JSON.stringify([tag.tag])) %>">DEL</a>
                        </div>
                    </div>

                    <% } %>
                </div>
            </body>
        </html>
    `, { variable: 'obj' });

export function html(tags: Array<Tag>) {

    return compiled({
        tags
    });
}

function assetPath(...args) {
    return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'assets', ...args)).toString();
}

function nodeModulesPath(...args) {
    return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'node_modules', ...args)).toString();
}
