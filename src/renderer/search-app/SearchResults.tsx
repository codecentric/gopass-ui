import * as React from 'react'
import { ipcRenderer } from 'electron'
import * as m from 'react-materialize'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'
import * as replace from 'string-replace-to-array'

import Gopass from '../secrets/Gopass'
import { useNotificationContext } from '../notifications/NotificationProvider'
import { useCopySecretToClipboard } from '../hooks/useCopySecretToClipboard'

const NUMBER_OF_SEARCH_RESULTS = 15

export interface SearchResultsProps {
    search?: string
}

export default function SearchResults(props: SearchResultsProps) {
    const [ secretNames, setSecretNames ] = React.useState<string[]>([])
    const [ filteredSecretNames, setFilteredSecretNames ] = React.useState<string[]>([])
    const [ searchValues, setSearchValues ] = React.useState<string[]>([])
    const [ selectedItemIndex, setSelectedItemIndex ] = React.useState(0)

    const copySecretToClipboard = useCopySecretToClipboard()

    const updateFilteredSecrets = (search?: string) => {
        if (search) {
            const newSearchValues = search.split(' ').map(searchValue => searchValue.trim())

            setSearchValues(newSearchValues)
            setFilteredSecretNames(secretNames.filter(filterMatchingSecrets(newSearchValues)).slice(0, NUMBER_OF_SEARCH_RESULTS))
        } else {
            setSearchValues([])
            setFilteredSecretNames(secretNames.slice(0, NUMBER_OF_SEARCH_RESULTS))
        }
        setSelectedItemIndex(0)
    }

    React.useEffect(() => {
        Gopass.getAllSecretNames().then(newSecretNames => {
            setSecretNames(newSecretNames)
        })
    }, [])

    React.useEffect(() => {
        updateFilteredSecrets()
    }, [ secretNames ])

    React.useEffect(() => {
        updateFilteredSecrets(props.search)
    }, [ props.search ])

    const onSelectCollectionItem = (secretKey: string) => () => {
        copySecretToClipboard(secretKey)
    }

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
                break
        }
    }

    const highlightRegExp = searchValues.length > 0 ? new RegExp(`(${searchValues.join('|')})`, 'g') : undefined

    const getHighlightedSegment = (segment: string) => {
        if (!highlightRegExp) {
            return segment
        }

        return replace(segment, highlightRegExp, (_: any, match: string, offset: number) => {
            return <mark key={`highlight-${segment}-${offset}`}>{match}</mark>
        })
    }

    return <>
        <KeyboardEventHandler
            handleKeys={ [ 'up', 'shift+tab', 'down', 'tab', 'enter', 'esc' ] }
            handleFocusableElements
            onKeyEvent={ onKeyEvent }
        />
        <m.Collection>
            { filteredSecretNames.map((secretName, i) => {
                const splittedSecretName = secretName.split('/')
                const isSelected = i === selectedItemIndex ? 'selected' : undefined

                return (
                    <m.CollectionItem key={ `secret-${i}` } className={ isSelected } onClick={ onSelectCollectionItem(secretName) }>
                        {splittedSecretName.reduce(
                            (result: string[], segment, currentIndex) => {
                                const extendedResult = result.concat(
                                    getHighlightedSegment(segment)
                                )

                                if (currentIndex < splittedSecretName.length - 1) {
                                    extendedResult.push(' > ')
                                }

                                return extendedResult
                            },
                            [ ]
                        )}
                    </m.CollectionItem>
                )
            }) }
        </m.Collection>
    </>
}

function filterMatchingSecrets(searchValues: string[]) {
    return (secretName: string) => searchValues.every(searchValue => secretName.includes(searchValue))
}
