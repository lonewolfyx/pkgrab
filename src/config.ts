import type { ICommandOptions, IConfig } from '@/shared/types'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import boxen from 'boxen'
import { x } from 'tinyexec'

export const loaderToken = async (cwd: string): Promise<string> => {
    const npmrcPath = await x('npm', ['config', 'get', 'userconfig'], {
        nodeOptions: {
            cwd,
            stdio: 'pipe',
        },
    })

    const content = await readFile(npmrcPath.stdout.trim(), 'utf-8')
    const [, tokenValue] = content.match(/\/\/registry.npmjs.org\/:_authToken=(.*)/) || []
    const token = tokenValue?.trim() || null
    if (!token) {
        console.log(boxen(
            `_authToken not found in your .npmrc file,
you can use the following codemod:
Run "dnmp set <token> or npm config set //registry.npmjs.org/:_authToken=<token>"`,
            {
                title: 'Warning',
                padding: 1,
                margin: 0,
                borderStyle: 'round',
                borderColor: 'yellow',
            },
        ))
        process.exit(0)
    }
    return token
}

export const resolveConfig = async (pkgName: string, options: ICommandOptions): Promise<IConfig> => {
    const { cwd } = options
    return {
        pkg: pkgName,
        cwd,
        projectPath: resolve(cwd, pkgName),
        token: await loaderToken(cwd),
    }
}
