import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { ipcRenderer } from 'electron'

import SearchResultsView, { SearchResultsProps } from './SearchResultsView'
import { showNotification } from '../notifications/notificationActions'
import Gopass from '../secrets/Gopass'

const mapDispatchToProps = (dispatch: Dispatch): SearchResultsProps => ({
    copySecretToClipboard: (secretName: string) => {
        Gopass.copy(secretName)
            .then(() => {
                dispatch(showNotification({ status: 'OK', message: 'Secret has been copied to your clipboard.' }))
                ipcRenderer.send('hideSearchWindow')
            })
            .catch(() => {
                dispatch(showNotification({ status: 'ERROR', message: 'Oops, something went wrong. Please try again.' }))
            })
    }
})

export default connect(
    undefined,
    mapDispatchToProps
)(SearchResultsView)
