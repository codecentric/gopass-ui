import * as React from 'react'
import * as m from 'react-materialize'
import './LoadingScreenView.css'

export interface LoadingScreenViewProps {
    waitingTexts?: string[]
}

const defaultWaitingTexts = [
    'Loading, please wait...',
    'Still doing something...',
    'It seems to takes some time...',
    'Doop di doop di douuu...',
    'I\'m sorry that it takes longer.',
    'Maybe there is a persistent problem. Sorry for that!'
]

export default class LoadingScreenView extends React.Component<LoadingScreenViewProps, { waitingTextIndex: number }> {
    constructor(props: LoadingScreenViewProps) {
        super(props)
        this.state = {
            waitingTextIndex: 0
        }
    }

    public componentDidMount() {
        const waitingTexts = this.props.waitingTexts || defaultWaitingTexts

        if (waitingTexts && waitingTexts.length > 0) {
            setInterval(() => {
                const waitingTextIndex = waitingTexts.length > this.state.waitingTextIndex + 1 ? this.state.waitingTextIndex + 1 : 0

                this.setState({
                    ...this.state,
                    waitingTextIndex
                })
            }, 2000)
        }
    }

    public render() {
        const { waitingTextIndex } = this.state
        const waitingTexts = this.props.waitingTexts || defaultWaitingTexts

        return (
            <div className='loading-screen-wrapper'>
                <div className='loading-screen-message'>
                    <p>{ waitingTexts[ waitingTextIndex ] }</p>
                    <m.ProgressBar />
                </div>
            </div>
        )
    }
}
