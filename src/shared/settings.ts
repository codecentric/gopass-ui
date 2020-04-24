export interface UserSettings {
    secretValueLength: number
    searchShortcut: string
    showTray: boolean
    startOnLogin: boolean
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    secretValueLength: 50,
    searchShortcut: 'CmdOrCtrl+Shift+p',
    showTray: true,
    startOnLogin: true
}

export interface SystemSettings {
    environmentTestSuccessful: boolean
    releaseCheckedTimestamp?: number
    releaseCheck: {
        lastCheckTimestamp?: number
        results?: any
    }
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
    environmentTestSuccessful: false,
    releaseCheck: {}
}
