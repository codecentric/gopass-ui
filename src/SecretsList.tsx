import * as React from 'react'
import { ipcRenderer } from 'electron'
import { useCopySecretToClipboard } from './useCopySecretToClipboard'
import { Gopass } from './Gopass'
import KeyboardEventHandler from 'react-keyboard-event-handler'
import { List, notification, Space, Tooltip } from 'antd'
import { SecretKey } from './SecretKey'
import { SecretValue } from './SecretValue'
import classNames from 'classnames'
import { EditSecret } from './EditSecret'
import { ListHeader } from './ListHeader'
import { AddEntryModal } from './AddEntryModal'
import { DeleteEntryModal } from './DeleteEntryModal'
import { EditOutlined, CopyOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

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
    const [watchingForKeyEvents, setWatchingForKeyEvents] = React.useState(true)
    const [secretKeyToDelete, setSecretKeyToDelete] = React.useState<string | undefined>(undefined)

    const disableKeyWatching = React.useCallback(() => {
        setWatchingForKeyEvents(false)
    }, [])
    const enableKeyWatching = React.useCallback(() => {
        setWatchingForKeyEvents(true)
    }, [])
    const openAddEntryModal = React.useCallback(() => {
        setAddEntryModalShown(true)
    }, [])
    const closeAddEntryModal = React.useCallback(() => {
        setAddEntryModalShown(false)
    }, [])

    const closeDeleteEntryModal = React.useCallback(() => {
        setSecretKeyToDelete(undefined)
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

    const refreshSecrets = () => {
        Gopass.getAllSecretNames().then(setAllSecretNames)
    }

    React.useEffect(refreshSecrets, [])

    React.useEffect(() => {
        updateFilteredSecrets()
    }, [allSecretNames])

    React.useEffect(() => {
        updateFilteredSecrets(search)
    }, [search])

    React.useEffect(() => {
        if (addEntryModalShown || secretKeyToDelete) {
            disableKeyWatching()
        } else {
            enableKeyWatching()
        }
    }, [addEntryModalShown, secretKeyToDelete])

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
        setSecretNamesInEditMode(secretNamesInEditMode.filter(key => key !== secretKey))
    }

    const onClickHideKey = (secretKey: string) => () => {
        setShownSecretNames(shownSecretNames.filter(key => key !== secretKey))
    }

    const onClickEditKey = (secretKey: string) => () => {
        setSecretNamesInEditMode([...secretNamesInEditMode, secretKey])
        setShownSecretNames(shownSecretNames.filter(key => key !== secretKey))
    }

    const closeEditMode = (secretKey: string) => {
        setSecretNamesInEditMode(secretNamesInEditMode.filter(key => key !== secretKey))
    }

    const onClickCopyKey = (secretKey: string) => () => {
        Gopass.copy(secretKey)
    }

    const onClickDeleteKey = (secretKey: string) => () => {
        setSecretKeyToDelete(secretKey)
    }

    return (
        <>
            <KeyboardEventHandler
                isDisabled={!watchingForKeyEvents}
                handleKeys={['up', 'shift+tab', 'down', 'tab', 'enter', 'esc']}
                handleFocusableElements
                onKeyEvent={onKeyEvent}
            />
            <AddEntryModal shown={addEntryModalShown} closeModal={closeAddEntryModal} refreshSecrets={refreshSecrets} />
            <DeleteEntryModal secretKey={secretKeyToDelete} closeModal={closeDeleteEntryModal} refreshSecrets={refreshSecrets} />
            <List
                size='small'
                header={<ListHeader numberOfEntries={filteredSecretNames.length} openAddEntryModal={openAddEntryModal} refreshSecrets={refreshSecrets} />}
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
                                isKeyShown ? (
                                    <a onClick={onClickHideKey(secretKey)}>
                                        <Tooltip title='hide'>
                                            <EyeInvisibleOutlined />
                                        </Tooltip>
                                    </a>
                                ) : (
                                    <a onClick={onClickShowKey(secretKey)}>
                                        <Tooltip title='show'>
                                            <EyeOutlined />
                                        </Tooltip>
                                    </a>
                                ),
                                <a onClick={onClickEditKey(secretKey)}>
                                    <Tooltip title='edit'>
                                        <EditOutlined />
                                    </Tooltip>
                                </a>,
                                <a onClick={onClickDeleteKey(secretKey)}>
                                    <Tooltip title='delete'>
                                        <DeleteOutlined />
                                    </Tooltip>
                                </a>,
                                <a onClick={onClickCopyKey(secretKey)}>
                                    <Tooltip title='copy'>
                                        <CopyOutlined />
                                    </Tooltip>
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
