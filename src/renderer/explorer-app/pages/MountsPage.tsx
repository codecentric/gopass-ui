import * as React from 'react'
import * as m from 'react-materialize'
import Gopass, { Mount } from '../../secrets/Gopass'
import PaginatedTable from '../../components/PaginatedTable'
import { LoadingScreen } from '../../components/loading-screen/LoadingScreen'

const MountsPage = () => {
    const [mounts, setMounts] = React.useState<Mount[] | undefined>(undefined)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(true)

        Gopass.getAllMounts().then(allMounts => {
            setMounts(allMounts)
            setLoading(false)
        })
    }, [])

    return (
        <>
            <h4>Mounts</h4>
            {loading && <LoadingScreen />}
            {!loading && mounts !== undefined && <MountsTable entries={mounts} />}
        </>
    )
}

const MountsTable = ({ entries }: { entries: Mount[] }) => {
    const rows = entries.map(entry => ({
        ...entry,
        id: entry.name
    }))
    const columns = [
        { fieldName: 'name', label: 'Name' },
        { fieldName: 'path', label: 'Directory path' }
    ]

    return <PaginatedTable columns={columns} rows={rows} />
}

export default MountsPage
