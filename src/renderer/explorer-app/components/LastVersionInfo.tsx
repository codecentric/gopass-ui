import * as React from 'react'
import GithubService, { GithubTag } from '../GithubService'
import { ExternalLink } from '../../components/ExternalLink'

export function LatestVersionInfo() {
    const [ tags, setTags ] = React.useState<GithubTag[]>([])

    React.useEffect(() => {
        GithubService.getTagsOfRepository('codecentric', 'gopass-ui').then(newTags => {
            setTags(newTags)
        })
    }, [ 'once' ])

    const lastTag = tags[tags.length - 1]
    const lastTagName = lastTag ? lastTag.ref.slice(10, lastTag.ref.length) : ''

    return lastTagName ? <>
        <hr/>
        Make sure you got the latest version of Gopass UI so you don't miss any update:&nbsp;
        <ExternalLink url='https://github.com/codecentric/gopass-ui/releases/latest'>{`${lastTagName} on Github`}</ExternalLink>
    </> : null
}
