import type { ICommandOptions } from '@/shared/types'
import fs from 'node:fs'
import * as process from 'node:process'
import { confirm, intro, log, spinner } from '@clack/prompts'
import cac from 'cac'
import { downloadTemplate } from 'giget'
import pc from 'picocolors'
import { rimraf } from 'rimraf'
import { x } from 'tinyexec'
import { resolveConfig } from '@/config.ts'
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

        const config = resolveConfig(pkgName, options)

        const loading = spinner()
        loading.start('Checking npm package registration')

        const pkg = await isRegistryNpmPackage(config.pkg)
        if (pkg.isRegistry) {
            return loading.error(`${pc.green(config.pkg)} is registered 📦 ${pc.red(pkg.version)}`)
        }
        loading.stop(`${pc.green(config.pkg)} is not published on npm`)

        const registry = await confirm({
            message: `You can initialize a new package with ${pc.green(config.pkg)}?`,
            initialValue: true,
        })

        isCancelProcess(registry, CANCEL_PROCESS)
        if (!registry) {
            log.error('Aborted. No package was created.')
            process.exit(0)
        }

        const packageFolder = config.projectPath
        if (!fs.existsSync(packageFolder)) {
            fs.mkdirSync(packageFolder)
        }
        else {
            const coverage = await confirm({
                message: `Directory "${pc.green(config.pkg)}" exists. Overwrite?`,
                initialValue: true,
            })
            isCancelProcess(coverage, CANCEL_PROCESS)
            if (!coverage) {
                log.error('Aborted. No package was created.')
                process.exit(0)
            }

            await rimraf(packageFolder)
            fs.mkdirSync(packageFolder)
        }

        log.step('Package initialize... ☕')
        await downloadTemplate('https://codeload.github.com/lonewolfyx-template/npm-base/tar.gz/refs/heads/master', {
            dir: config.projectPath,
            force: true,
        })

        log.step('Installation in progress... ☕')
        await x('npx', ['-y', '@antfu/ni'], {
            nodeOptions: {
                cwd: config.projectPath,
                stdio: 'inherit',
                shell: true,
            },
        })
        log.success(`${pc.green(config.pkg)} package created successfully.`)
    })

cli.help()
cli.version(version)
cli.parse()
