import type { ICommandOptions } from '@/shared/types'

export const resolveConfig = (options: ICommandOptions) => {
    const { cwd } = options
    return {
        cwd,
    }
}
