import * as React from 'react'
import { ipcRenderer } from 'electron'
import { useCopySecretToClipboard } from './useCopySecretToClipboard'
import { Gopass } from './Gopass'
import KeyboardEventHandler from 'react-keyboard-event-handler'
import { List, notification, Space } from 'antd'
import { PlusCircleTwoTone } from '@ant-design/icons'
import { SecretKey } from './SecretKey'
import { SecretValue } from './SecretValue'
import classNames from 'classnames'
import { EditSecret } from './EditSecret'
import { ListHeader } from './ListHeader'
import { AddEntryModal } from './AddEntryModal'

export interface SecretsListProps {
    search: string
}

export function SecretsList({ search }: SecretsListProps) {
    const [api] = notification.useNotification()
    const [allSecretNames, setAllSecretNames] = React.useState<string[]>([])
    const [shownSecretNames, setShownSecretNames] = React.useState<string[]>([])
    const [secretNamesInEditMode, setSecretNamesInEditMode] = React.useState<string[]>([])
    const [filteredSecretNames, setFilteredSecretNames] = React.useState<string[]>([])
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0)
    const [highlightRegExp, setHighlightRegExp] = React.useState<RegExp | undefined>()
    const [addEntryModalShown, setAddEntryModalShown] = React.useState(false)

    const openAddEntryModal = React.useCallback(() => {
        setAddEntryModalShown(true)
    }, [])
    const closeAddEntryModal = React.useCallback(() => {
        setAddEntryModalShown(false)
    }, [])

    const copySecretToClipboard = useCopySecretToClipboard()

    const updateFilteredSecrets = (search?: string) => {
        if (search) {
            const searchValues = search.split(' ').map(searchValue => searchValue.trim())

            setFilteredSecretNames(allSecretNames.filter(filterMatchingSecrets(searchValues)))
            setHighlightRegExp(new RegExp(`(${searchValues.join('|')})`, 'g'))
        } else {
            setFilteredSecretNames(allSecretNames)
            setHighlightRegExp(undefined)
        }
        setSelectedItemIndex(0)
    }

    React.useEffect(() => {
        Gopass.getAllSecretNames().then(setAllSecretNames)
    }, [])

    React.useEffect(() => {
        updateFilteredSecrets()
    }, [allSecretNames])

    React.useEffect(() => {
        updateFilteredSecrets(search)
    }, [search])

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
        console.log('copy', secretKey)
        copySecretToClipboard(secretKey)
    }

    const onClickShowKey = (secretKey: string) => () => {
        setShownSecretNames([...shownSecretNames, secretKey])
    }

    const onClickEditKey = (secretKey: string) => () => {
        setSecretNamesInEditMode([...secretNamesInEditMode, secretKey])
    }

    const closeEditMode = (secretKey: string) => {
        setSecretNamesInEditMode(secretNamesInEditMode.filter(key => key !== secretKey))
    }

    const onClickHideKey = (secretKey: string) => () => {
        setShownSecretNames(shownSecretNames.filter(key => key !== secretKey))
    }

    const onClickCopyKey = (secretKey: string) => () => {
        setShownSecretNames(shownSecretNames.filter(key => key !== secretKey))
        api.info({ message: 'Secret copied', description: 'The secret is copied to the clipboard.', placement: 'top' })
    }

    return (
        <>
            <KeyboardEventHandler handleKeys={['up', 'shift+tab', 'down', 'tab', 'enter', 'esc']} handleFocusableElements onKeyEvent={onKeyEvent} />
            <AddEntryModal shown={addEntryModalShown} closeModal={closeAddEntryModal} />
            <List
                size='small'
                header={<ListHeader numberOfEntries={filteredSecretNames.length} openAddEntryModal={openAddEntryModal} />}
                bordered
                dataSource={filteredSecretNames}
                renderItem={(secretKey, i) => {
                    const secretPath = secretKey.split('/')
                    const isKeyShown = shownSecretNames.includes(secretKey)
                    const isKeyInEditMode = secretNamesInEditMode.includes(secretKey)
                    const className = classNames('list-entry', {
                        selected: i === selectedItemIndex,
                        even: i % 2 === 0
                    })

                    return (
                        <List.Item
                            key={`entry-${i}`}
                            className={className}
                            onClick={() => onSelectCollectionItem(secretKey)}
                            actions={[
                                isKeyShown ? <a onClick={onClickHideKey(secretKey)}>hide</a> : <a onClick={onClickShowKey(secretKey)}>show</a>,
                                <a onClick={onClickEditKey(secretKey)}>
                                    <u>e</u>dit
                                </a>,
                                <a onClick={onClickCopyKey(secretKey)}>
                                    <u>c</u>opy
                                </a>
                            ]}
                        >
                            <Space direction='vertical' size='small'>
                                <SecretKey secretPath={secretPath} highlightRegExp={highlightRegExp} />
                                {isKeyShown ? <SecretValue secretKey={secretKey} /> : null}
                                {isKeyInEditMode ? <EditSecret secretKey={secretKey} close={closeEditMode} /> : null}
                            </Space>
                        </List.Item>
                    )
                }}
            />
        </>
    )
}

function filterMatchingSecrets(searchValues: string[]) {
    return (secretName: string) => searchValues.every(searchValue => secretName.toLowerCase().includes(searchValue.toLowerCase()))
}
