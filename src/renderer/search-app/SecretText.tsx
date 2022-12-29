import * as React from 'react'
import replace from 'string-replace-to-array'

export interface SecretTextProps {
    secretPath: string[]
    highlightRegExp?: RegExp
}

const getHighlightedSegment = (segment: string, highlightRegExp?: RegExp) => {
    if (!highlightRegExp) {
        return segment
    }

    return replace(segment, highlightRegExp, (_: any, match: string, offset: number) => {
        return <mark key={`highlight-${segment}-${offset}`}>{match}</mark>
    })
}

export function SecretText({ secretPath, highlightRegExp }: SecretTextProps) {
    return (
        <>
            {secretPath.reduce((result: string[], segment, currentIndex) => {
                const extendedResult = result.concat(getHighlightedSegment(segment, highlightRegExp))

                if (currentIndex < secretPath.length - 1) {
                    extendedResult.push(' > ')
                }

                return extendedResult
            }, [])}
        </>
    )
}
