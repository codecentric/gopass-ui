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
    return <>{filteredSecretNames.map((secretKey, i) => {
        const secretPath = secretKey.split('/')
        const isSelected = i === selectedItemIndex ? 'selected' : undefined

        return <m.CollectionItem key={`entry-${i}`} className={isSelected} onClick={() => onItemClick(secretKey)}>
            <SecretText secretPath={secretPath} highlightRegExp={highlightRegExp}/>
        </m.CollectionItem>
    })}</>
}
