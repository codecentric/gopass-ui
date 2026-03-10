import * as React from 'react'
import * as m from 'react-materialize'
import { useNavigate } from 'react-router-dom'
import AsyncPasswordHealthCollector, { PasswordHealthCollectionStatus, PasswordSecretHealth } from '../../secrets/AsyncPasswordHealthCollector'
import PaginatedTable from '../../components/PaginatedTable'
import { LoadingScreen } from '../../components/loading-screen/LoadingScreen'
import { PasswordHealthIndicator } from '../password-health/PasswordHealthIndicator'
import { PasswordHealthSummary, PasswordRater } from '../password-health/PasswordRater'

function PasswordHealthPage() {
    const navigate = useNavigate()
    const collectorRef = React.useRef(new AsyncPasswordHealthCollector())
    const [status, setStatus] = React.useState<PasswordHealthCollectionStatus | undefined>(undefined)

    React.useEffect(() => {
        const collector = collectorRef.current
        collector.start()

        const statusChecker = window.setInterval(() => {
            const currentStatus = collector.getCurrentStatus()
            setStatus({ ...currentStatus })
            if (!currentStatus.inProgress) {
                clearInterval(statusChecker)
            }
        }, 100)

        return () => {
            clearInterval(statusChecker)
            collector.stopAndReset()
        }
    }, [])

    const onSecretClick = (secretName: string) => () => navigate(`/secret/${btoa(secretName)}`, { replace: true })

    const renderOverallPasswordHealth = (overallPasswordHealth: PasswordHealthSummary, improvablePasswordsAmount: number) => (
        <div className='row'>
            <div className='col s12'>
                <div className='card-panel z-depth-1'>
                    <div className='row valign-wrapper'>
                        <div className='col s2'>
                            <PasswordHealthIndicator health={overallPasswordHealth.health} />
                        </div>
                        <div className='col s10'>
                            This is the average health for your passwords.
                            {improvablePasswordsAmount > 0 ? ` There are ${improvablePasswordsAmount} suggestions available.` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderImprovementPotential = (improvablePasswords: PasswordSecretHealth[]) =>
        improvablePasswords.length > 0 && (
            <>
                <h4 className='m-top'>Improvement Potential</h4>
                <PaginatedTable
                    columns={[
                        { fieldName: 'name', label: 'Name' },
                        { fieldName: 'health', label: 'Health' },
                        { fieldName: 'rulesToImprove', label: 'Rules to improve' }
                    ]}
                    rows={improvablePasswords.map(rated => ({
                        id: rated.name,
                        name: <a onClick={onSecretClick(rated.name)}>{rated.name}</a>,
                        health: `${rated.health}`,
                        rulesToImprove: `${rated.failedRulesCount}`
                    }))}
                />
            </>
        )

    const renderStatus = (currentStatus: PasswordHealthCollectionStatus) => {
        if (!currentStatus.inProgress && currentStatus.passwordsCollected === 0) {
            return (
                <p>
                    It seems you don&apos;t have passwords in your stores yet. A secret is considered a password if it
                    contains words such as: password, pw, pass, secret, key or similar.
                </p>
            )
        }

        if (currentStatus.inProgress && currentStatus.passwordsCollected > 0) {
            const progressPercentage = Math.round((currentStatus.passwordsCollected / currentStatus.totalPasswords) * 100)

            return (
                <>
                    <p>Your passwords are currently being collected and analysed, please wait until ready... {progressPercentage}%</p>
                    <div style={{ width: '60%', minWidth: '200px', marginTop: '30px' }}>
                        <m.ProgressBar progress={progressPercentage} />
                    </div>
                </>
            )
        }

        if (
            !currentStatus.inProgress &&
            currentStatus.passwordsCollected > 0 &&
            currentStatus.passwordsCollected === currentStatus.totalPasswords &&
            !currentStatus.error
        ) {
            const overallPasswordHealth = PasswordRater.buildOverallPasswordHealthSummary(currentStatus.ratedPasswords)
            const improvablePasswords = overallPasswordHealth.ratedPasswordSecrets.filter(rated => rated.health && rated.health < 100)

            return (
                <>
                    {renderOverallPasswordHealth(overallPasswordHealth, improvablePasswords.length)}
                    {renderImprovementPotential(improvablePasswords)}
                </>
            )
        }

        if (!currentStatus.inProgress && currentStatus.error) {
            return <p>Something went wrong here: {currentStatus.error.message}</p>
        }

        return null
    }

    return (
        <>
            <h4>Password Health</h4>
            {status ? renderStatus(status) : <LoadingScreen />}
        </>
    )
}

export default PasswordHealthPage
