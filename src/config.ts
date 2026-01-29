import type { ICommandOptions, IConfig } from '@/shared/types'
import { resolve } from 'node:path'

export const resolveConfig = (pkgName: string, options: ICommandOptions): IConfig => {
    const { cwd } = options
    return {
        cwd,
        projectPath: resolve(cwd, pkgName),
    }
}
