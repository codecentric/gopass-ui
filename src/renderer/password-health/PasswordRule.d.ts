export interface PasswordRuleMeta {
    name: string
    description: string
}

export interface PasswordRule extends PasswordRuleMeta {
    matcher: (password: string) => boolean
}
