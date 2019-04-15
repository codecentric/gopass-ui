import * as React from 'react'
import * as m from 'react-materialize'
import { withRouter, RouteComponentProps } from 'react-router'
import AsyncPasswordHealthCollector, { PasswordHealthCollectionStatus } from '../../secrets/AsyncPasswordHealthCollector'
import PaginatedTable from '../../components/PaginatedTable'
import { LoadingScreen } from '../../components/loading-screen/LoadingScreen'
import { PasswordHealthIndicator } from '../password-health/PasswordHealthIndicator'
import { PasswordRater } from '../password-health/PasswordRater'

interface PasswordHealthPageState {
    collector: AsyncPasswordHealthCollector
    statusChecker?: number
    status?: PasswordHealthCollectionStatus
}

class PasswordHealthPage extends React.Component<RouteComponentProps, PasswordHealthPageState> {
    constructor(props: any) {
        super(props)
        this.state = {
            collector: new AsyncPasswordHealthCollector()
        }
    }

    public async componentDidMount() {
        const { collector } = this.state
        collector.start()

        const statusChecker = window.setInterval(async () => {
            const status = this.state.collector.getCurrentStatus()
            this.setState({ status })
            if (!status.inProgress) {
                await this.stopStatusChecker()
            }
        }, 100)
        this.setState({ statusChecker })
    }

    public async componentWillUnmount() {
        await this.stopStatusChecker()
    }

    public render() {
        const { status } = this.state

        return (
            <>
                <h4>Password Health</h4>
                {status ? this.renderStatus(status) : <LoadingScreen />}
            </>
        )
    }

    private async stopStatusChecker() {
        const { collector, statusChecker } = this.state
        await collector.stopAndReset()

        if (statusChecker) {
            clearInterval(statusChecker)
        }
    }

    private renderStatus(status: PasswordHealthCollectionStatus) {
        if (status.inProgress && status.passwordsCollected > 0) {
            const progressPercentage = Math.round((status.passwordsCollected / status.totalPasswords) * 100)

            return (
                <>
                    <p>Your passwords are currently being collected and analysed, please wait until ready... {progressPercentage}%</p>
                    <div style={{ width: '60%', minWidth: '200px', marginTop: '30px' }}>
                        <m.ProgressBar progress={progressPercentage}/>
                    </div>
                </>
            )
        }

        if (!status.inProgress && status.passwordsCollected > 0 && status.passwordsCollected === status.totalPasswords && !status.error) {
            const overallPasswordHealth = PasswordRater.buildOverallPasswordHealthSummary(status.ratedPasswords)
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

        if (!status.inProgress && status.error) {
            return <p>Something went wrong here: {status.error.message}</p>
        }
    }

    private onSecretClick = (secretName: string) => {
        return () => this.props.history.replace(`/secret/${btoa(secretName)}`)
    }
}

export default withRouter(PasswordHealthPage)
