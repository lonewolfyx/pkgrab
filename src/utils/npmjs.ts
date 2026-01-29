import type { INpmRegistryResult, IRegistryInfo } from '@/shared/types'
import { ofetch } from 'ofetch'

export const isRegistryNpmPackage = async (pkgName: string): Promise<IRegistryInfo> => {
    const result = await ofetch(`https://registry.npmjs.org/${pkgName}`).catch(err => err.data) as INpmRegistryResult

    return {
        isRegistry: !(result.error && result.error === 'Not found'),
        name: result?.name ?? '',
        version: result?.['dist-tags']?.latest ?? '',
    }
}
