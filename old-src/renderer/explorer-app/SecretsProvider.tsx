import * as React from 'react'
import { Tree } from '../components/tree/TreeComponent'
import SecretsFilterService from './side-navigation/SecretsFilterService'
import SecretsDirectoryService from './side-navigation/SecretsDirectoryService'
import Gopass from '../secrets/Gopass'

export interface SecretsContext {
    tree: Tree
    searchValue: string

    applySearchToTree: (searchValue: string) => void
    reloadSecretNames: () => Promise<void>
}

const Context = React.createContext<SecretsContext | undefined>(undefined)
export const useSecretsContext = () => {
    const context = React.useContext(Context)
    if (!context) {
        throw Error('no secrets context!')
    }

    return context
}

export const SecretsProvider = ({ children }: { children: React.ReactNode }) => {
    const [tree, setTree] = React.useState<Tree>({ name: 'Stores', toggled: true, children: [], path: '' })
    const [searchValue, setSearchValue] = React.useState<string>('')
    const [secretNames, setSecretNames] = React.useState<string[]>([])

    const applySearchToTree = (newSearchValue?: string, updatedSecretNames?: string[]) => {
        let searchValueToUse = searchValue
        if (newSearchValue !== undefined) {
            setSearchValue(newSearchValue)
            searchValueToUse = newSearchValue
        }
        const filteredSecretNames = SecretsFilterService.filterBySearch(updatedSecretNames || secretNames, searchValueToUse)
        const newTree: Tree = SecretsDirectoryService.secretPathsToTree(filteredSecretNames, tree, filteredSecretNames.length <= 15)

        setTree(newTree)
    }
    const loadSecretsAndBuildTree = async (newSearchValue: string | undefined = undefined) => {
        const allSecretNames = await Gopass.getAllSecretNames()
        setSecretNames(allSecretNames)
        applySearchToTree(newSearchValue !== undefined ? newSearchValue : searchValue, allSecretNames)
    }

    const providerValue: SecretsContext = {
        tree,
        searchValue,
        reloadSecretNames: () => loadSecretsAndBuildTree(),
        applySearchToTree
    }

    return <Context.Provider value={providerValue}>{children}</Context.Provider>
}
