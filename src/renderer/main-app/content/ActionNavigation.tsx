import * as React from 'react'
import * as m from 'react-materialize'
import Gopass from '../../secrets/Gopass'

interface ActionButtonProps {
    icon: string
    onClick?: () => void
    style?: any
}

const ActionButton = ({ icon, onClick, style }: ActionButtonProps) => (
    <m.Button
        floating
        large
        className='red'
        waves='light'
        icon={icon}
        onClick={onClick}
        style={style}
    />
)

const noop = () => undefined
export default class ActionNavigation extends React.Component<any, any> {
    render() {
        return (
            <div style={{ padding: '10px 0px' }}>
                <ActionButton icon='add' onClick={noop} />
                <ActionButton
                    icon='refresh'
                    onClick={this.refreshGopassStores}
                    style={{ marginLeft: '20px' }}
                />
            </div>
        )
    }

    refreshGopassStores = async () => {
        try {
            await Gopass.sync()
            alert('Your stores have been synchronised successfully.')
        } catch (err) {
            alert(`Oops, something went wrong: ${JSON.stringify(err)}`)
        }
    }
}
