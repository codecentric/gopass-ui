import * as React from 'react'

export interface Notification {
    status: 'OK' | 'ERROR'
    message: string
}

export interface NotificationContext {
    notification?: Notification
    show: (notification: Notification) => void
    hide: () => void
}

export const Context = React.createContext<NotificationContext | null>(null)

export function useNotificationContext() {
    const context = React.useContext(Context)

    if (!context) {
        throw Error('NO Context!')
    }

    return context
}

export default function NotificationProvider({ children }: any) {
    const [ notification, setNotification ] = React.useState<Notification | undefined>()

    return <Context.Provider value={{
        notification,
        show: newNotification => {
            setNotification(newNotification)
        },
        hide: () => {
            setNotification(undefined)
        }
    }}>{children}</Context.Provider>
}
