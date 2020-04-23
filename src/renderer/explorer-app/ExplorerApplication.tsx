import * as React from 'react'

import SecretExplorer from './side-navigation/SecretExplorer'
import MainContent from './MainContent'

import './ExplorerApplication.css'
import { useSecretsContext } from './SecretsProvider'

const ExplorerApplication = () => {
    const { tree, applySearchToTree, loadSecretsAndBuildTree, searchValue } = useSecretsContext()

    React.useEffect(
        () => {
            loadSecretsAndBuildTree()
        },
        ['once']
    )

    return (
        <>
            <SecretExplorer
                tree={tree}
                searchValue={searchValue}
                onSearchValueChange={newValue => {
                    applySearchToTree(newValue)
                }}
            />
            <MainContent/>
        </>
    )
}

export default ExplorerApplication
