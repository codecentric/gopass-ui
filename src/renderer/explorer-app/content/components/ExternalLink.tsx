import * as React from 'react'
import { shell } from 'electron'

export function ExternalLink(props: { url: string, children: any }) {
    const { url, children } = props

    return <a className='link' onClick={() => shell.openExternal(url)}>{ children }</a>
}
