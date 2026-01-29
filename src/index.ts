import type { ICommandOptions } from '@/shared/types'
import fs from 'node:fs'
import { resolve } from 'node:path'
import * as process from 'node:process'
import { confirm, intro, log, spinner } from '@clack/prompts'
import cac from 'cac'
import pc from 'picocolors'
import { CANCEL_PROCESS } from '@/constant.ts'
import { isCancelProcess, isRegistryNpmPackage } from '@/utils'
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

        const registry = await confirm({
            message: `You can initialize a new package with ${pc.green(pkgName)}?`,
            initialValue: true,
        })

        isCancelProcess(registry, CANCEL_PROCESS)
        if (!registry) {
            log.error('Aborted. No package was created.')
            process.exit(0)
        }

        const packageFolder = resolve(options.cwd, pkgName)
        if (!fs.existsSync(packageFolder)) {
            fs.mkdirSync(packageFolder)
        }
        else {
            const coverage = await confirm({
                message: `Directory "${pc.green(pkgName)}" exists. Overwrite?`,
                initialValue: true,
            })
            isCancelProcess(coverage, CANCEL_PROCESS)
            if (coverage) {
                fs.rmdirSync(packageFolder)
                fs.mkdirSync(packageFolder)
            }
        }
    })

cli.help()
cli.version(version)
cli.parse()
