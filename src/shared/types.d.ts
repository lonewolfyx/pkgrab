export interface ICommandOptions {
    '--': string[]
    'c': string
    'cwd': string
}

export interface IConfig {
    cwd: string
    projectPath: string
}

export interface INpmRegistryResult {
    'name'?: string
    'dist-tags'?: {
        latest: string
    }
    'error'?: string
}

export interface IRegistryInfo {
    isRegistry: boolean
    name: string
    version: string
}
