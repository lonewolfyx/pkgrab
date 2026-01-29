import { cancel, isCancel } from '@clack/prompts'

export * from './message'
export * from './npmjs'
export * from './package'

export const isCancelProcess = (value: unknown, message: string) => {
    if (isCancel(value)) {
        cancel(message)
        return process.exit(0)
    }
}
