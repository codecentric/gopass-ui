import * as React from 'react'
import * as m from 'react-materialize'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

import { RouteComponentProps, withRouter } from 'react-router'
import SecretTree from './SecretTree'
import { useSecretsContext } from '../SecretsProvider'

const SecretExplorer = ({ history }: RouteComponentProps) => {
    const { tree, applySearchToTree, reloadSecretNames, searchValue } = useSecretsContext()
    const navigateToSecretDetailView = (secretName: string) => history.replace(`/secret/${btoa(secretName)}`)
    const clearSearch = () => applySearchToTree('')

    React.useEffect(() => {
        reloadSecretNames()
    }, [])

    return (
        <div className='secret-explorer'>
            <KeyboardEventHandler handleKeys={['esc']} handleFocusableElements onKeyEvent={clearSearch} />
            <m.Input
                className='search-bar'
                value={searchValue}
                placeholder='Search...'
                onChange={(_: any, updatedSearchValue: string) => {
                    applySearchToTree(updatedSearchValue)
                }}
            />
            <SecretTree tree={tree} onSecretClick={navigateToSecretDetailView} />
        </div>
    )
}

export default withRouter(SecretExplorer)
