import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../state/AppState'
import Gopass from '../secrets/Gopass'

// (Re-)Load secrets
export const LOAD_SECRETS_TREE = 'LOAD_SECRETS_TREE'
export interface LoadSecretsTree { type: typeof LOAD_SECRETS_TREE, secretNames: string[] }
export const loadSecretsTree = (secretNames: string[]): LoadSecretsTree => ({ type: LOAD_SECRETS_TREE, secretNames })

export const loadInitialSecretsTree = (): ThunkAction<Promise<void>, AppState, {}, LoadSecretsTree> => (
    async (dispatch: Dispatch) => {
        const secretNames = await Gopass.getAllSecretNames()
        dispatch(loadSecretsTree(secretNames))
    }
)

// Search
export const SET_SEARCH = 'SET_SEARCH'
export interface SetSearch { type: typeof SET_SEARCH, searchValue: string }
export const setSearch = (searchValue: string): SetSearch => ({ type: SET_SEARCH, searchValue })

export const setSearchAndReload = (searchValue: string): ThunkAction<Promise<void>, AppState, {}, SetSearch> => (
    async (dispatch: Dispatch) => {
        dispatch(setSearch(searchValue))
        dispatch(loadInitialSecretsTree() as any)
    }
)
