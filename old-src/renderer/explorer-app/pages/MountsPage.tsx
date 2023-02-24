import * as React from 'react'
import * as m from 'react-materialize'
import { useNavigate } from 'react-router-dom'

import Gopass, { Mount } from '../../secrets/Gopass'
import PaginatedTable from '../../components/PaginatedTable'
import { LoadingScreen } from '../../components/loading-screen/LoadingScreen'
import { RoundActionButton } from '../../components/RoundActionButton'
import { useSecretsContext } from '../SecretsProvider'

const MountsPage = () => {
    const secretsContext = useSecretsContext()
    const [mounts, setMounts] = React.useState<Mount[] | undefined>(undefined)
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()

    const loadMounts = async () => {
        setLoading(true)
        const allMounts = await Gopass.getAllMounts()
        setMounts(allMounts)
        setLoading(false)
    }
    const deleteMount = async (name: string) => {
        await Gopass.deleteMount(name)
        await secretsContext.reloadSecretNames()
        await loadMounts()
    }

    React.useEffect(() => {
        loadMounts()
    }, [])

    return (
        <>
            <div style={{ paddingTop: '0.75rem' }}>
                <RoundActionButton icon='arrow_back' onClick={() => navigate('/')} />
                <RoundActionButton icon='add' onClick={() => navigate('/add-mount')} />
            </div>

            <h4>Mounts</h4>
            {loading && <LoadingScreen />}
            {!loading && mounts && mounts.length === 0 && <m.CardPanel>No mounts available.</m.CardPanel>}
            {!loading && mounts && mounts.length > 0 && <MountsTable entries={mounts} deleteRow={deleteMount} />}
        </>
    )
}

const MountsTable = ({ entries, deleteRow }: { entries: Mount[]; deleteRow: (name: string) => Promise<void> }) => {
    const rows = entries.map(entry => ({
        ...entry,
        id: entry.name,
        actions: (
            <>
                <a className='btn-flat' onClick={() => deleteRow(entry.name)}>
                    <m.Icon>delete_forever</m.Icon>
                </a>
            </>
        )
    }))
    const columns = [
        { fieldName: 'name', label: 'Name' },
        { fieldName: 'path', label: 'Directory path' },
        { fieldName: 'actions', label: 'Actions' }
    ]

    return <PaginatedTable columns={columns} rows={rows} />
}

export default MountsPage
