import * as child_process from 'child_process';
import * as os from 'os';
import * as vscode from 'vscode';

import { Tag } from '../model';
const gitpath = vscode.workspace.getConfiguration('git').get('path') || 'git';

export function tags(cwd: string): Promise<Array<Tag>> {

    return new Promise((resolve, reject) => {

            child_process.exec(gitpath + ' log --tags --decorate --simplify-by-decoration --oneline', {
                cwd: cwd
            }, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }
                if (stderr) {
                    return reject(stderr);
                }
    
                const tags: Array<Tag> = stdout
                    .replace(/\r\n/mg, '\n')
                    .split('\n')
                    .filter(line => /[\(\s]tag:\s/.test(line))
                    .map(line => {
                        const matched = line.match(/([a-z0-9]{7})\s\((.*)\)\s(.*)/);
                        return {
                            hash: matched[1],
                            tag: matched[2].match(/tag:\s([^,\s]+)/)[1],
                            commitMessage: matched[3]
                        };
                    });
                resolve(tags);
            });

    });

}

export function create(val: string, cwd: string): Promise<undefined> {
    return createWithMessage(val, '', cwd);
}

export function createWithMessage(val: string, message: string, cwd: string): Promise<undefined> {
    if (!val) {
        return Promise.reject('NO_VALUE');
    }
    return new Promise((resolve, reject) => {
        child_process.exec(`${gitpath} tag ${message ? '-m "' + message + '"' : ''} ${val}`, {
            cwd: cwd
        }, (error, stdout, stderr) => {
            if (stderr) {
                return reject(stderr);
            }
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

export function syncCreate(cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        child_process.exec(gitpath + ' push --tags', {
            cwd: cwd
        }, (error, stdout, stderr) => {
            if (error) {
                return reject('SYNC_FAILED');
            }
            if (stderr && !/\[new tag\]/.test(stderr)) {
                return reject('SYNC_FAILED');
            }
            resolve('SYNCED');
        });
    });
}

export function deleteTag(tag: string, cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        child_process.exec(`${gitpath} tag -d ${tag}`, {
            cwd: cwd
        }, (error, stdout, stderr) => {
            if (stderr && !/Deleted tag/.test(stderr)) {
                return reject('DEL_FAILED');
            }
            if (error) {
                return reject('DEL_FAILED');
            }
            resolve('DELETED');
        });
    });
}

export function syncDelete(tag: string, cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        child_process.exec(`${gitpath} push origin :refs/tags/${tag}`, {
            cwd: cwd
        }, (error, stdout, stderr) => {
            if (error) {
                return reject('SYNC_FAILED');
            }
            if (stderr && !/\[deleted\]/.test(stderr)) {
                return reject('SYNC_FAILED');
            }
            resolve('SYNCED');
        });
    });
}

export function refreshFromRemote(cwd: string) {
    child_process.exec(gitpath + ' fetch --tags', {cwd: cwd}, () => {
        console.log('tags refreshed with remote');
    });    
}

