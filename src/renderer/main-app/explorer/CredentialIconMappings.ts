export interface CredentialIconMapping {
    mustIncludeOnOf: string[]
    icon: string
}

const credentialIconMappings: CredentialIconMapping[] = [
    {
        mustIncludeOnOf: ['password', 'secret', 'key', 'certificate'],
        icon: 'lock'
    },
    {
        mustIncludeOnOf: ['user', 'name', 'id'],
        icon: 'person'
    },
    {
        mustIncludeOnOf: ['note', 'comment', 'misc'],
        icon: 'comment'
    },
    {
        mustIncludeOnOf: ['uri', 'url', 'connection'],
        icon: 'filter_center_focus'
    }
]

export default credentialIconMappings
