export interface CredentialIconMapping {
    regex: RegExp
    icon: string
}

const credentialIconMappings: CredentialIconMapping[] = [
    {
        regex: /(password|secret|key|passphrase|certificate)/,
        icon: 'lock'
    },
    {
        regex: /(user|name|id)/,
        icon: 'person'
    },
    {
        regex: /(note|comment|misc)/,
        icon: 'comment'
    },
    {
        regex: /(uri|url|link|connection)/,
        icon: 'filter_center_focus'
    }
]

export default credentialIconMappings
