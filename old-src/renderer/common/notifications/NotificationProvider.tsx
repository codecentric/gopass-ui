import * as React from 'react'

export interface Notification {
    status: 'OK' | 'ERROR'
    message: string
}

export interface NotificationContext {
    notification?: Notification
    isHidden: boolean
    show: (notification: Notification) => void
    hide: () => void
}

const Context = React.createContext<NotificationContext | null>(null)

export function useNotificationContext() {
    const context = React.useContext(Context)

    if (!context) {
        throw Error('NO Context!')
    }

    return context
}

export default function NotificationProvider({ children }: any) {
    const [notification, setNotification] = React.useState<Notification | undefined>()
    const [isHidden, setIsHidden] = React.useState<boolean>(false)

    return (
        <Context.Provider
            value={{
                notification,
                isHidden,
                show: newNotification => {
                    setNotification(newNotification)
                    setIsHidden(false)
                },
                hide: () => {
                    setIsHidden(true)
                    setTimeout(() => {
                        setNotification(undefined)
                    }, 1000)
                }
            }}
        >
            {children}
        </Context.Provider>
    )
}
