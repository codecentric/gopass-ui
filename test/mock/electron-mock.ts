import { EventEmitter } from 'events'

const createIPCMock = () => {
    const emitter = new EventEmitter()

    const ipcRenderer = {
        on: (channel: string, listener: (...args: any[]) => void) => { emitter.on(channel, listener); return ipcRenderer },
        once: (channel: string, listener: (...args: any[]) => void) => { emitter.once(channel, listener); return ipcRenderer },
        send: (channel: string, ...args: any[]) => {
            const senderEvent = { sender: { send: (ch: string, ...a: any[]) => emitter.emit(ch, {}, ...a) } }
            emitter.emit(channel, senderEvent, ...args)
        },
        sendSync: (channel: string, ...args: any[]) => { emitter.emit(channel, {}, ...args) },
        invoke: async (channel: string, ...args: any[]) => { emitter.emit(channel, {}, ...args) },
        removeAllListeners: (channel?: string) => emitter.removeAllListeners(channel)
    }

    const ipcMain = {
        on: (channel: string, listener: (...args: any[]) => void) => { emitter.on(channel, listener); return ipcMain },
        once: (channel: string, listener: (...args: any[]) => void) => { emitter.once(channel, listener); return ipcMain },
        handle: (channel: string, listener: (...args: any[]) => void) => { emitter.on(channel, listener); return ipcMain },
        removeAllListeners: (channel?: string) => emitter.removeAllListeners(channel)
    }

    return { ipcMain, ipcRenderer }
}

const mocked = createIPCMock()
const ipcMain = mocked.ipcMain
const ipcRenderer = mocked.ipcRenderer

export { ipcMain, ipcRenderer }
