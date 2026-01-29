import type { IConfig } from '@/shared/types'
import { findUp } from 'find-up'

export const inspectPackage = async (config: IConfig) => {
    const packageJsonPath = await findUp('package.json', {
        cwd: config.cwd,
    })

    return {
        hasPackage: !!packageJsonPath,
        packageJsonPath: packageJsonPath || '',
    }
}
