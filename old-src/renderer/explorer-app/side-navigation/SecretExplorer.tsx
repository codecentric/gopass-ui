import * as React from 'react'
import * as m from 'react-materialize'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'
import { useNavigate } from 'react-router-dom'

import SecretTree from './SecretTree'
import { useSecretsContext } from '../SecretsProvider'

export const SecretExplorer = () => {
    const navigate = useNavigate()
    const { tree, applySearchToTree, reloadSecretNames, searchValue } = useSecretsContext()
    const navigateToSecretDetailView = (secretName: string) => navigate(`/secret/${btoa(secretName)}`)
    const clearSearch = () => applySearchToTree('')

    React.useEffect(() => {
        reloadSecretNames()
    }, [])

    return (
        <div className='secret-explorer'>
            <KeyboardEventHandler handleKeys={['esc']} handleFocusableElements onKeyEvent={clearSearch} />
            <div className='search-bar'>
                <m.Input
                    value={searchValue}
                    placeholder='Search...'
                    onChange={(_: any, updatedSearchValue: string) => {
                        applySearchToTree(updatedSearchValue)
                    }}
                />
            </div>
            <SecretTree tree={tree} onSecretClick={navigateToSecretDetailView} />
        </div>
    )
}
