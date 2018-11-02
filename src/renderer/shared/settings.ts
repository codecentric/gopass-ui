export interface GopassUiHistorySettings {
    searchShortcut: string
    theme: 'dark' | 'light'
    showTray: boolean
    startOnLogin: boolean
}

export const DEFAULT_SETTINGS: GopassUiHistorySettings = {
    searchShortcut: 'CmdOrCtrl+Shift+p',
    theme: 'light',
    showTray: true,
    startOnLogin: true
}
