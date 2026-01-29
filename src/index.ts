import type { ICommandOptions } from '@/shared/types'
import * as process from 'node:process'
import { intro, spinner } from '@clack/prompts'
import cac from 'cac'
import pc from 'picocolors'
import { isRegistryNpmPackage } from '@/utils'
import { name, version } from '../package.json'

const cli = cac(name)

cli.command('[pkgName]', 'package name')
    .option('--cwd,-c', 'project cwd', { default: process.cwd() })
    .action(async (pkgName: string = '', options: ICommandOptions) => {
        intro(pc.bgCyan(` ${name} [v${version}]`))

        if (!pkgName) {
            return cli.outputHelp()
        }

        const loading = spinner()
        loading.start('Checking npm package registration')

        const pkg = await isRegistryNpmPackage(pkgName)
        if (pkg.isRegistry) {
            return loading.error(`${pc.green(pkgName)} is registered 📦 ${pc.red(pkg.version)}`)
        }
        loading.stop(`${pc.green(pkgName)} is not published on npm`)
    })

cli.help()
cli.version(version)
cli.parse()
