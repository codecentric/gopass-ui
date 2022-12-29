import * as React from 'react'
import * as m from 'react-materialize'
import AsyncPasswordHealthCollector, { PasswordHealthCollectionStatus, PasswordSecretHealth } from '../../secrets/AsyncPasswordHealthCollector'
import PaginatedTable from '../../components/PaginatedTable'
import { LoadingScreen } from '../../components/loading-screen/LoadingScreen'
import { PasswordHealthIndicator } from '../password-health/PasswordHealthIndicator'
import { PasswordHealthSummary, PasswordRater } from '../password-health/PasswordRater'

interface PasswordHealthPageState {
    collector: AsyncPasswordHealthCollector
    statusChecker?: number
    status?: PasswordHealthCollectionStatus
}

class PasswordHealthPage extends React.Component<any, PasswordHealthPageState> {
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

    // tslint:disable-next-line
    private renderStatus(status: PasswordHealthCollectionStatus) {
        if (!status.inProgress && status.passwordsCollected === 0) {
            return (
                <p>
                    It seems you don't have passwords in your stores yet. A secret is considered a password if it contains words such as: password, pw, pass,
                    secret, key or similar.
                </p>
            )
        }

        if (status.inProgress && status.passwordsCollected > 0) {
            const progressPercentage = Math.round((status.passwordsCollected / status.totalPasswords) * 100)

            return (
                <>
                    <p>Your passwords are currently being collected and analysed, please wait until ready... {progressPercentage}%</p>
                    <div style={{ width: '60%', minWidth: '200px', marginTop: '30px' }}>
                        <m.ProgressBar progress={progressPercentage} />
                    </div>
                </>
            )
        }

        if (!status.inProgress && status.passwordsCollected > 0 && status.passwordsCollected === status.totalPasswords && !status.error) {
            const overallPasswordHealth = PasswordRater.buildOverallPasswordHealthSummary(status.ratedPasswords)
            const improvablePasswords = overallPasswordHealth.ratedPasswordSecrets.filter(rated => rated.health && rated.health < 100)

            return (
                <>
                    {this.renderOverallPasswordHealth(overallPasswordHealth, improvablePasswords.length)}
                    {this.renderImprovementPotential(improvablePasswords)}
                </>
            )
        }

        if (!status.inProgress && status.error) {
            return <p>Something went wrong here: {status.error.message}</p>
        }
    }

    private renderOverallPasswordHealth(overallPasswordHealth: PasswordHealthSummary, improvablePasswordsAmount: number) {
        return (
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
    }

    private renderImprovementPotential(improvablePasswords: PasswordSecretHealth[]) {
        return (
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
                            name: <a onClick={this.onSecretClick(rated.name)}>{rated.name}</a>,
                            health: `${rated.health}`,
                            rulesToImprove: `${rated.failedRulesCount}`
                        }))}
                    />
                </>
            )
        )
    }

    private onSecretClick = (secretName: string) => () => { /*no-op*/ } // this.props.history.replace(`/secret/${btoa(secretName)}`) TODO!!!
}

export default PasswordHealthPage
