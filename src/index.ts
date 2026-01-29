import type { ICommandOptions } from '@/shared/types'
import * as process from 'node:process'
import cac from 'cac'
import { name, version } from '../package.json'

const cli = cac(name)

cli.command('[pkgName]')
    .option('--cwd,-c', 'project cwd', { default: process.cwd() })
    .action(async (pkgName: string = '', options: ICommandOptions) => {
        console.log('pkgName', pkgName)
    })

cli.help()
cli.version(version)
cli.parse()
