import * as m from 'react-materialize'
import * as React from 'react'

import { SecretText } from './SecretText'

export interface CollectionItemProps {
    filteredSecretNames: string[]
    selectedItemIndex: number
    highlightRegExp?: RegExp
    onItemClick: (secretKey: string) => void
}

export function CollectionItems({ filteredSecretNames, selectedItemIndex, onItemClick, highlightRegExp }: CollectionItemProps) {
    return <>{}</>
}
