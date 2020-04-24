import * as React from 'react'
import { ipcRenderer } from 'electron'
import * as m from 'react-materialize'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

import Gopass from '../secrets/Gopass'
import { useCopySecretToClipboard } from '../secrets/useCopySecretToClipboard'
import { CollectionItems } from './CollectionItems'

const NUMBER_OF_SEARCH_RESULTS = 15

export interface SearchResultsProps {
    search: string
}

export default function SearchResults(props: SearchResultsProps) {
    const [allSecretNames, setAllSecretNames] = React.useState<string[]>([])
    const [filteredSecretNames, setFilteredSecretNames] = React.useState<string[]>([])
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0)
    const [highlightRegExp, setHighlightRegExp] = React.useState<RegExp | undefined>()

    const copySecretToClipboard = useCopySecretToClipboard()

    const updateFilteredSecrets = (search?: string) => {
        if (search) {
            const searchValues = search.split(' ').map(searchValue => searchValue.trim())

            setFilteredSecretNames(allSecretNames.filter(filterMatchingSecrets(searchValues)).slice(0, NUMBER_OF_SEARCH_RESULTS))
            setHighlightRegExp(new RegExp(`(${searchValues.join('|')})`, 'g'))
        } else {
            setFilteredSecretNames(allSecretNames.slice(0, NUMBER_OF_SEARCH_RESULTS))
            setHighlightRegExp(undefined)
        }
        setSelectedItemIndex(0)
    }

    React.useEffect(() => {
        Gopass.getAllSecretNames().then(newSecretNames => {
            setAllSecretNames(newSecretNames)
        })
    }, [])

    React.useEffect(() => {
        updateFilteredSecrets()
    }, [allSecretNames])

    React.useEffect(() => {
        updateFilteredSecrets(props.search)
    }, [props.search])

    const onKeyEvent = (key: string, event: any) => {
        switch (key) {
            case 'shift+tab':
            case 'up':
                if (selectedItemIndex > 0) {
                    setSelectedItemIndex(selectedItemIndex - 1)
                    event.preventDefault()
                }
                break

            case 'down':
            case 'tab':
                if (selectedItemIndex < filteredSecretNames.length - 1) {
                    setSelectedItemIndex(selectedItemIndex + 1)
                    event.preventDefault()
                }
                break

            case 'enter':
                const secretKey = filteredSecretNames[selectedItemIndex]
                if (secretKey) {
                    copySecretToClipboard(secretKey)
                }

                event.preventDefault()
                break

            case 'esc':
                ipcRenderer.send('hideSearchWindow')
                break
            default:
                console.error('This should not happen ;-) Please verify the "handleKeys" prop from the "KeyboardEventHandler"')
                break
        }
    }

    const onSelectCollectionItem = (secretKey: string) => () => {
        copySecretToClipboard(secretKey)
    }

    return (
        <>
            <KeyboardEventHandler handleKeys={['up', 'shift+tab', 'down', 'tab', 'enter', 'esc']} handleFocusableElements onKeyEvent={onKeyEvent} />
            <m.Collection>
                <CollectionItems
                    filteredSecretNames={filteredSecretNames}
                    selectedItemIndex={selectedItemIndex}
                    highlightRegExp={highlightRegExp}
                    onItemClick={onSelectCollectionItem}
                />
            </m.Collection>
        </>
    )
}

function filterMatchingSecrets(searchValues: string[]) {
    return (secretName: string) => searchValues.every(searchValue => secretName.toLowerCase().includes(searchValue.toLowerCase()))
}
