import * as React from 'react'
import * as m from 'react-materialize'
import { PasswordHealthIndicator } from './PasswordRatingComponent'
import AsyncPasswordCollector, { CollectionStats } from '../secrets/AsyncPasswordCollector'
import { rateMultiplePasswords } from './PasswordRules'

interface PasswordHealthOverviewState {
    collector: AsyncPasswordCollector
    statsChecker?: any
    stats?: CollectionStats
}

export default class PasswordHealthOverview extends React.Component<any, PasswordHealthOverviewState> {
    constructor(props: any) {
        super(props)
        this.state = {
            collector: new AsyncPasswordCollector()
        }
    }

    async componentDidMount() {
        this.state.collector.start()
        
        const statsChecker = setInterval(() => {
            this.setState({ ...this.state, stats: this.state.collector.getCurrentStats() })
        }, 100)
        this.setState({ ...this.state, statsChecker })
    }

    async componentWillUnmount() {
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
                return (
                    <>
                        <p>Your password are currently being collected and analysed, please wait until ready...</p>
                        <div style={{width: '60%', minWidth: '200px', marginTop: '30px'}}>
                            <m.ProgressBar progress={ (stats.passwordsCollected / stats.totalPasswords) * 100 } />
                        </div>
                    </>
                )
            }

            if (!stats.inProgress && !stats.error) {
                return (
                    <div className='row'>
                        <div className='col s12'>
                            <div className='card-panel z-depth-1'>
                            <div className='row valign-wrapper'>
                                <div className='col s2'>
                                    <PasswordHealthIndicator health={ rateMultiplePasswords(stats.passwords).health } />
                                </div>
                                <div className='col s10'>
                                    This is the average health for your passwords. Soon you can get sumarised recommendations here!
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                )
            }

            if (!stats.inProgress && stats.error) {
                return <p>Something went wrong here: { stats.error.message }</p>
            }
        }

        return <m.Preloader size='big'/>
    }
}
