import { Tree } from '../explorer-app/side-navigation/TreeComponent'
import SecretsDirectoryService from './SecretsDirectoryService'
import SecretsFilterService from './SecretsFilterService'
import { LoadSecretsTree, LOAD_SECRETS_TREE, SET_SEARCH, SetSearch } from './secretsActions'

export const INITIAL_STATE: SecretsState = {
    sideNavigationTree: {
        name: 'Stores',
        toggled: true,
        children: []
    },
    searchValue: ''
}

export interface SecretsState {
    sideNavigationTree: Tree
    searchValue: string
}

export type Actions = LoadSecretsTree | SetSearch
const secretsReducer = (state: SecretsState = INITIAL_STATE, action: Actions): SecretsState => {
    switch (action.type) {
        case LOAD_SECRETS_TREE:
            const filteredSecretNames = SecretsFilterService.filterBySearch(action.secretNames, state.searchValue)
            const sideNavigationTree: Tree = SecretsDirectoryService.secretPathsToTree(filteredSecretNames)

            return {
                ...state,
                sideNavigationTree
            }

        case SET_SEARCH:
            return {
                ...state,
                searchValue: action.searchValue
            }

        default:
            return state
    }
}

export default secretsReducer
