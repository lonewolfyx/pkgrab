import type { ICommandOptions } from '@/shared/types'
import * as process from 'node:process'
import cac from 'cac'
import { resolveConfig } from '@/config.ts'
import { inspectPackage } from '@/utils.ts'
import { name, version } from '../package.json'

const cli = cac(name)

cli.command('')
    .option('--cwd,-c', 'project cwd', { default: process.cwd() })
    .action(async (options: ICommandOptions) => {
        const config = resolveConfig(options)

        const { hasPackage } = await inspectPackage(config)
    })

cli.help()
cli.version(version)
cli.parse()
