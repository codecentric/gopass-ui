import * as React from 'react'
import * as m from 'react-materialize'
import { Animated } from 'react-animated-css'

import { useNotificationContext } from './NotificationProvider'

const DEFAULT_TIMEOUT = 3000

export default function NotificationView(props: { dismissTimeout?: number }) {
    const { notification, hide, isHidden } = useNotificationContext()
    const { dismissTimeout = DEFAULT_TIMEOUT } = props

    React.useEffect(() => {
        let timeoutId = 0

        if (notification && dismissTimeout !== 0) {
            timeoutId = window.setTimeout(() => hide(), dismissTimeout)
        }

        return () => {
            if (timeoutId !== 0) {
                clearTimeout(timeoutId)
            }
        }
    }, [notification, dismissTimeout])

    return (
        <Animated animationIn='fadeInDown' animationInDuration={1000} animationOutDuration={1000} animationOut='fadeOutUp' isVisible={!isHidden}>
            <m.Row>
                <m.Col s={12}>
                    {notification && (
                        <m.CardPanel className={`${notification.status === 'OK' ? 'green' : 'red'} lighten-1 black-text`}>
                            <m.Row style={{ marginBottom: 0 }}>
                                <m.Col s={11}>
                                    <span>{notification ? notification.message : ''}</span>
                                </m.Col>
                                <m.Col s={1} style={{ textAlign: 'right' }}>
                                    <a className='black-text link' onClick={() => hide()}>
                                        <m.Icon small>close</m.Icon>
                                    </a>
                                </m.Col>
                            </m.Row>
                        </m.CardPanel>
                    )}
                </m.Col>
            </m.Row>
        </Animated>
    )
}
