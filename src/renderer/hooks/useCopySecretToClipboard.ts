import { ipcRenderer } from 'electron'

import Gopass from '../secrets/Gopass'
import { useNotificationContext } from '../notifications/NotificationProvider'

export function useCopySecretToClipboard() {
    const notificationContext = useNotificationContext()

    return (secretKey: string) => {
        Gopass.copy(secretKey).then(() => {
            notificationContext.show({ status: 'OK', message: 'Secret has been copied to your clipboard.' })
            ipcRenderer.send('hideSearchWindow')
        })
        .catch(() => {
            notificationContext.show({ status: 'ERROR', message: 'Oops, something went wrong. Please try again.' })
        })
    }
}
