import type { Options } from 'boxen'
import boxen from 'boxen'
import defu from 'defu'

export const useMessage = (content: string, options?: Options) => {
    const option = defu(options || {}, {
        title: 'Warning',
        padding: 1,
        margin: 0,
        borderStyle: 'round' as const,
        borderColor: 'yellow' as const,
    })

    return console.log(boxen(content, option))
}
