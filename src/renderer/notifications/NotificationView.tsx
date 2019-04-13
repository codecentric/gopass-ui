import * as React from 'react'
import * as m from 'react-materialize'
import { Notification } from './notificationReducer'

const DEFAULT_TIMEOUT = 3000

export interface NotificationViewProps {
    notification?: Notification
    dismissTimeout?: number
    hideNotification?: () => void
}

export default class NotificationView extends React.Component<NotificationViewProps> {
    private timeoutId?: number

    public render() {
        const { notification } = this.props

        return notification ? this.renderNotification(notification) : null
    }

    public componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
    }

    private renderNotification(notification: Notification) {
        const { dismissTimeout = DEFAULT_TIMEOUT } = this.props

        if (dismissTimeout !== 0) {
            this.setAutoTimeout(dismissTimeout)
        }

        return (
            <m.Row>
                <m.Col s={12}>
                    <m.CardPanel className={`${notification.status === 'OK' ? 'green' : 'red'} lighten-1 black-text`}>
                        <m.Row style={{ marginBottom: 0 }}>
                            <m.Col s={11}>
                                <span>{notification.message}</span>
                            </m.Col>
                            <m.Col s={1} style={{ textAlign: 'right' }}>
                                <a className='black-text link' onClick={() => this.props.hideNotification!()}>
                                    <m.Icon small>close</m.Icon>
                                </a>
                            </m.Col>
                        </m.Row>
                    </m.CardPanel>
                </m.Col>
            </m.Row>
        )
    }

    private setAutoTimeout(dismissTimeout: number) {
        console.info('SET TIMEOUT FOR', this.props.dismissTimeout)
        this.timeoutId = window.setTimeout(() => this.props.hideNotification!(), dismissTimeout)
    }
}
