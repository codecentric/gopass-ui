import * as React from 'react'
import * as m from 'react-materialize'
import { Notification } from './notificationReducer'

export interface NotificationViewProps {
    notification?: Notification
    hideNotification?: Function
}

export default class NotificationView extends React.Component<NotificationViewProps> {
    render() {
        const { notification } = this.props

        return notification ? this.renderNotification(notification) : null
    }

    renderNotification(notification: Notification) {
        return <m.Row>
            <m.Col s={12}>
                <m.CardPanel className={ `${notification.status === 'OK' ? 'green' : 'red'} lighten-1 black-text` }>
                    <m.Row style={ { marginBottom: 0 } }>
                        <m.Col s={11}>
                            <span>{ notification.message }</span>
                        </m.Col>
                        <m.Col s={1} style={ { textAlign: 'right' } } >
                            <a className='black-text link' onClick={ () => this.props.hideNotification!() }><m.Icon small>close</m.Icon></a>
                        </m.Col>
                    </m.Row>
                </m.CardPanel>
            </m.Col>
        </m.Row>
    }
}
