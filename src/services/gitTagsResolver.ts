import * as child_process from 'child_process';
import * as os from 'os';

import { Tag } from '../model';

export function tags(cwd: string): Promise<Array<Tag>> {

    return new Promise((resolve, reject) => {
        child_process.exec(`git log --tags --decorate --simplify-by-decoration --oneline`, {
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
                .filter(line => /\(tag:\s/.test(line))
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


