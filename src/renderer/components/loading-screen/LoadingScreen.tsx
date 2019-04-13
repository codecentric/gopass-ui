import * as React from 'react'
import * as m from 'react-materialize'

import './LoadingScreen.css'

const WAITING_TEXTS = [
    'Loading, please wait...',
    'Still doing something...',
    'It seems to takes some time...',
    'Doop di doop di douuu...',
    'I\'m sorry that it takes longer.',
    'Maybe there is a persistent problem. Sorry for that!'
]

export function LoadingScreen() {
    const [ waitingTextIndex, setWaitingTextIndex ] = React.useState(0)

    React.useEffect(() => {
        const timeout = setInterval(() => {
            setWaitingTextIndex(waitingTextIndex + 1)
        }, 2000)

        return () => clearInterval(timeout)
    })

    return (
        <div className='loading-screen-wrapper'>
            <div className='loading-screen-message'>
                <p>{ WAITING_TEXTS[ waitingTextIndex % WAITING_TEXTS.length ] }</p>
                <m.ProgressBar />
            </div>
        </div>
    )
}
