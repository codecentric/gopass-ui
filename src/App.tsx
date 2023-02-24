import React from 'react'
import { Input, notification } from 'antd'
import { SettingOutlined, SearchOutlined } from '@ant-design/icons'

import { SecretsList } from './SecretsList'
import { SettingsModal } from './SettingsModal'

function App() {
    const [search, setSearch] = React.useState('')
    const [settingsModalShown, setSettingsModalShown] = React.useState(false)
    const [_, contextHolder] = notification.useNotification()
    const showSettings = React.useCallback(() => {
        setSettingsModalShown(true)
    }, [])
    const closeSettings = React.useCallback(() => {
        setSettingsModalShown(false)
    }, [])

    return (
        <>
            {contextHolder}
            <div className='app'>
                <SettingsModal shown={settingsModalShown} closeModal={closeSettings} />
                <div className='header'>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder='enter your key...'
                        addonAfter={<SettingOutlined onClick={showSettings} />}
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                </div>
                <SecretsList search={search} />
            </div>
        </>
    )
}

export default App
