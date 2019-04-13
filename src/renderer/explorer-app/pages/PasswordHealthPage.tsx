import * as React from 'react'
import * as m from 'react-materialize'
import { History } from 'history'
import { withRouter } from 'react-router'
import AsyncPasswordCollector, { PasswordCollectionStatus } from '../../secrets/AsyncPasswordCollector'
import { PasswordRater } from '../../password-health/PasswordRater'
import PaginatedTable from '../../components/PaginatedTable'
import LoadingScreenView from '../../components/loading-screen/LoadingScreenView'
import { PasswordHealthIndicator } from '../../password-health/PasswordHealthIndicator'

interface PasswordHealthPageState {
    collector: AsyncPasswordCollector
    statsChecker?: any
    status?: PasswordCollectionStatus
}

class PasswordHealthPage extends React.Component<{ history: History }, PasswordHealthPageState> {
    constructor(props: any) {
        super(props)
        this.state = {
            collector: new AsyncPasswordCollector()
        }
    }

    public async componentDidMount() {
        const { collector } = this.state
        collector.start()

        const statsChecker = setInterval(() => {
            const status = this.state.collector.getCurrentStatus
            this.setState({ status })
        }, 100)
        this.setState({ statsChecker })
    }

    public async componentWillUnmount() {
        const { collector, statsChecker } = this.state
        collector.stopAndReset()

        if (statsChecker) {
            clearInterval(statsChecker)
        }
    }

    public render() {
        const { status } = this.state

        return (
            <>
                <h4>Password Health</h4>
                {status ? this.renderStats(status) : <LoadingScreenView/>}
            </>
        )
    }

    private renderStats(stats: PasswordCollectionStatus) {
        if (stats.inProgress && stats.passwordsCollected > 0) {
            const progressPercentage = Math.round((stats.passwordsCollected / stats.totalPasswords) * 100)

            return (
                <>
                    <p>Your passwords are currently being collected and analysed, please wait until ready... {progressPercentage}%</p>
                    <div style={{ width: '60%', minWidth: '200px', marginTop: '30px' }}>
                        <m.ProgressBar progress={progressPercentage}/>
                    </div>
                </>
            )
        }

        if (!stats.inProgress && stats.passwordsCollected > 0 && stats.passwordsCollected === stats.totalPasswords && !stats.error) {
            const overallPasswordHealth = PasswordRater.rateMultiplePasswords(stats.passwords)
            const improvablePasswords = overallPasswordHealth.ratedPasswordSecrets.filter(rated => rated.health && rated.health < 100)

            return (
                <>
                    <div className='row'>
                        <div className='col s12'>
                            <div className='card-panel z-depth-1'>
                                <div className='row valign-wrapper'>
                                    <div className='col s2'>
                                        <PasswordHealthIndicator health={overallPasswordHealth.health}/>
                                    </div>
                                    <div className='col s10'>
                                        This is the average health for your passwords.
                                        {improvablePasswords.length > 0 ? ` There are ${improvablePasswords.length} suggestions available.` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h4 className='m-top'>Improvement Potential</h4>
                    <PaginatedTable
                        columns={[
                            { fieldName: 'name', label: 'Name' },
                            { fieldName: 'health', label: 'Health' },
                            { fieldName: 'rulesToImprove', label: 'Rules to improve' }
                        ]}
                        rows={
                            improvablePasswords.map(rated => ({
                                id: rated.name,
                                name: <a onClick={this.onSecretClick(rated.name)}>{rated.name}</a>,
                                health: `${rated.health}`,
                                rulesToImprove: `${rated.failedRulesCount}`
                            }))
                        }
                    />
                </>
            )
        }

        if (!stats.inProgress && stats.error) {
            return <p>Something went wrong here: {stats.error.message}</p>
        }
    }

    private onSecretClick = (secretName: string) => {
        return () => this.props.history.replace(`/secret/${btoa(secretName)}`)
    }
}

export default withRouter(PasswordHealthPage as any) as any
