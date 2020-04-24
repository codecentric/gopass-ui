import * as React from 'react'
import GithubService, { GithubTag } from '../GithubService'
import { remote } from 'electron'
import { ExternalLink } from '../../components/ExternalLink'
import { Settings } from '../../common/Settings'

const ONE_HOUR_IN_MILLIS = 3600000
const VERSION_CHECK_INTERVAL = ONE_HOUR_IN_MILLIS

export const LatestVersionInfo = () => {
    const { releaseCheck } = Settings.getSystemSettings()
    const [tags, setTags] = React.useState<GithubTag[]>([])

    React.useEffect(() => {
        const millisNow = new Date().getTime()
        const shouldFetchTags = !releaseCheck || !releaseCheck.lastCheckTimestamp || millisNow - VERSION_CHECK_INTERVAL > releaseCheck.lastCheckTimestamp

        if (shouldFetchTags) {
            GithubService.getTagsOfRepository('codecentric', 'gopass-ui').then(newTags => {
                setTags(newTags)
                Settings.updateSystemSettings({ releaseCheck: { lastCheckTimestamp: millisNow, results: newTags } })
            })
        } else {
            setTags(releaseCheck.results)
        }
    })

    const lastTag = tags[tags.length - 1]
    const lastTagName = lastTag ? lastTag.ref.slice(10, lastTag.ref.length) : ''
    const appVersion = remote.app.getVersion()

    if (lastTagName) {
        return lastTagName.includes(appVersion) ? (
            <>
                You have the latest version <strong>{appVersion}</strong> of Gopass UI installed 🎉
            </>
        ) :  (
            <>
                Your Gopass UI version({appVersion}) is out of date 😕 Make sure you got the latest version of Gopass UI:&nbsp;
                <ExternalLink url='https://github.com/codecentric/gopass-ui/releases/latest'>{`${lastTagName} on Github`}</ExternalLink>
            </>
        )
    }

    return null
}
