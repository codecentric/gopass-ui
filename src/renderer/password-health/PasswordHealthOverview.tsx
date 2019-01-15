import * as React from 'react'
import * as m from 'react-materialize'
import { withRouter } from 'react-router'
import { PasswordHealthIndicator } from './PasswordRatingComponent'
import AsyncPasswordCollector, { CollectionStats } from '../secrets/AsyncPasswordCollector'
import { rateMultiplePasswords } from './PasswordRules'
import PaginatedTable from '../explorer-app/common/PaginatedTable'

interface PasswordHealthOverviewState {
    collector: AsyncPasswordCollector
    statsChecker?: any
    stats?: CollectionStats
}

class PasswordHealthOverview extends React.Component<any, PasswordHealthOverviewState> {
    constructor(props: any) {
        super(props)
        this.state = {
            collector: new AsyncPasswordCollector()
        }
    }

    public async componentDidMount() {
        this.state.collector.start()
        
        const statsChecker = setInterval(() => {
            this.setState({ ...this.state, stats: this.state.collector.getCurrentStats() })
        }, 100)
        this.setState({ ...this.state, statsChecker })
    }

    public async componentWillUnmount() {
        this.state.collector.stopAndReset()

        if (this.state.statsChecker) {
            clearInterval(this.state.statsChecker)
        }
    }

    public render() {
        return (
            <>
                <h4>Password Health</h4>
                { this.renderContent() }
            </>
        )
    }

    public renderContent() {
        const { stats } = this.state

        if (stats) {
            if (stats.inProgress) {
                const progressPercentage = Math.round((stats.passwordsCollected / stats.totalPasswords) * 100)

                return (
                    <>
                        <p>Your passwords are currently being collected and analysed, please wait until ready... { progressPercentage }%</p>
                        <div style={{width: '60%', minWidth: '200px', marginTop: '30px'}}>
                            <m.ProgressBar progress={ progressPercentage } />
                        </div>
                    </>
                )
            }

            if (!stats.inProgress && !stats.error) {
                const overallPasswordHealth = rateMultiplePasswords(stats.passwords)

                return (
                    <>
                        <div className='row'>
                            <div className='col s12'>
                                <div className='card-panel z-depth-1'>
                                <div className='row valign-wrapper'>
                                    <div className='col s2'>
                                        <PasswordHealthIndicator health={ overallPasswordHealth.health } />
                                    </div>
                                    <div className='col s10'>
                                        This is the average health for your passwords. Soon you can get sumarised recommendations here!
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        <h4 className='m-top'>Improvement Potential</h4>
                        <PaginatedTable
                            columns={ [
                                { fieldName: 'name', label: 'Name' },
                                { fieldName: 'health', label: 'Health' },
                                { fieldName: 'rulesToImprove', label: 'Rules to improve' }
                            ] }
                            rows={
                                overallPasswordHealth.ratedPasswordSecrets
                                    .filter(rated => rated.health && rated.health < 100)
                                    .map(rated => ({
                                        id: rated.name,
                                        name: <a onClick={ this.onSecretClick(rated.name) }>{ rated.name }</a>,
                                        health: `${rated.health}`,
                                        rulesToImprove: `${rated.failedRulesCount}`
                                    }))
                            }
                        />
                    </>
                )
            }

            if (!stats.inProgress && stats.error) {
                return <p>Something went wrong here: { stats.error.message }</p>
            }
        }

        return <m.Preloader size='big'/>
    }

    private onSecretClick = (secretName: string) => {
        return () => this.props.history!.replace(`/secrets/${btoa(secretName)}/view`)
    }
}

export default withRouter(PasswordHealthOverview as any) as any
