import * as React from 'react'
import * as m from 'react-materialize'
import SearchResults from './SearchResults'

import './SearchApplication.css'
import Notification from '../notifications/Notification'
import NotificationProvider from '../notifications/NotificationProvider'

const NAVIGATION_KEYS = [ 'ArrowUp', 'ArrowDown', 'Enter', 'Tab' ]

const preventNavigationKeys = (event: any) => {
    if (NAVIGATION_KEYS.includes(event.key)) {
        event.preventDefault()
    }
}

export function SearchApplication() {
    const [ searchValue, setSearchValue ] = React.useState('')

    React.useEffect(() => {
        const element = document.getElementById('search')

        if (element) {
            element.focus()
            element.click()
        }
    }, [ ])

    const onChange = (_: any, newValue: string) => {
        setSearchValue(newValue)
    }

    return <NotificationProvider>
        <Notification dismissTimeout={ 3000 } />
        <m.Row>
            <m.Col s={ 12 }>
                <m.Input id='search' placeholder='Search...' onChange={ onChange} onKeyDown={preventNavigationKeys } s={ 12 } />
            </m.Col>
        </m.Row>
        <m.Row>
            <m.Col s={ 12 }>
                <SearchResults search={ searchValue } />
            </m.Col>
        </m.Row>
    </NotificationProvider>
}
