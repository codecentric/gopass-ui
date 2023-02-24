import * as React from 'react'
import * as m from 'react-materialize'
import Gopass, { Mount } from '../../secrets/Gopass'
import { RoundActionButton } from '../../components/RoundActionButton'
import { useSecretsContext } from '../SecretsProvider'
import { useNotificationContext } from '../../common/notifications/NotificationProvider'
import { useNavigate } from 'react-router-dom'

function AddMountPage() {
    const notificationContext = useNotificationContext()
    const secretsContext = useSecretsContext()
    const [mount, setMount] = React.useState<Mount>({ name: '', path: '' })
    const navigate = useNavigate()

    const addMount = async () => {
        if (mount.path && mount.name) {
            try {
                await Gopass.addMount(mount)
                await secretsContext.reloadSecretNames()
                navigate('/mounts')
            } catch (err) {
                if (typeof err === 'string') {
                    if (err === 'duplicate-name') {
                        notificationContext.show({ status: 'ERROR', message: `A mount named "${mount.name}" does already exist` })
                    }

                    if (err.includes('Doubly mounted path')) {
                        notificationContext.show({
                            status: 'ERROR',
                            message: `The path "${mount.path}" is already in use by another mount`
                        })
                    }
                } else {
                    notificationContext.show({
                        status: 'ERROR',
                        message: `Unexpected error while adding mount: ${JSON.stringify(err)}`
                    })
                }
            }
        }
    }

    return (
        <>
            <div style={{ paddingTop: '0.75rem' }}>
                <RoundActionButton icon='arrow_back' onClick={() => navigate('/mounts')} />
            </div>

            <h4>New Mount</h4>

            <m.CardPanel>Create a new mount that shall be managed by Gopass as a password store from now on.</m.CardPanel>
            <m.Row>
                <m.Input s={12} value={mount.name} onChange={(_: any, value: string) => setMount({ ...mount, name: value })} label='Name' />
                <m.Input s={12} value={mount.path} onChange={(_: any, value: string) => setMount({ ...mount, path: value })} label='Directory path' />

                <m.Col s={12}>
                    <m.Button disabled={!mount.name || !mount.path} onClick={addMount} waves='light'>
                        Save
                    </m.Button>
                </m.Col>
            </m.Row>
        </>
    )
}

export default AddMountPage
