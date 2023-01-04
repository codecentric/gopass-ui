import { ipcRenderer } from 'electron'

// import { useNotificationContext } from '../common/notifications/NotificationProvider'
import Gopass from './Gopass'

export function useCopySecretToClipboard() {
    // const notificationContext = useNotificationContext()

    return (secretKey: string) => {
        Gopass.copy(secretKey)
            .then(() => {
                // TODO!
                // notificationContext.show({ status: 'OK', message: 'Secret has been copied to your clipboard.' })
                ipcRenderer.send('hideSearchWindow')
            })
            .catch(() => {
                // TODO!
                // notificationContext.show({ status: 'ERROR', message: 'Oops, something went wrong. Please try again.' })
            })
    }
}
