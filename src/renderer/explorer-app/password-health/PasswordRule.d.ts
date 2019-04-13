export interface PasswordHealthRuleInfo {
    name: string
    description: string
}

export interface PasswordHealthRule extends PasswordHealthRuleInfo {
    matcher: (password: string) => boolean
}
