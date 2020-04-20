import { IpcMainEvent } from 'electron'
import Gopass from '../src/renderer/secrets/Gopass'
import { ipcMain, ipcRenderer } from './mock/electron-mock'

const mockGopassResponse = (payload: string) => {
    ipcMain.once('gopass', (event: IpcMainEvent) => {
        event.sender.send('gopass-answer-1', {
            status: 'OK',
            executionId: 1,
            payload
        })
    })
    Gopass.executionId = 1
}

describe('Gopass', () => {
    const ipcRendererSendSpy = jest.spyOn(ipcRenderer, 'send')
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('show', () => {
        it('should call Gopass correctly', async () => {
            mockGopassResponse('someValue')
            await Gopass.show('some-secret-name')

            expect(ipcRendererSendSpy).toHaveBeenCalledWith('gopass', {
                args: undefined,
                command: 'show -f "some-secret-name"',
                executionId: 1,
                pipeTextInto: undefined
            })
        })

        it('should call Gopass with escaped $,",\',` and \\ in secret names', async () => {
            mockGopassResponse('someValue')
            await Gopass.show('not nice $ " \' ` secret name"')

            expect(ipcRendererSendSpy).toHaveBeenCalledWith('gopass', {
                args: undefined,
                command: 'show -f "not nice \\$ \\" \\\' \\` secret name\\""',
                executionId: 1,
                pipeTextInto: undefined
            })
        })

        it('should deliver the secret value', async () => {
            mockGopassResponse('someValue')
            const secretValue = await Gopass.show('some-secret-name')
            expect(secretValue).toBe('someValue')
        })
    })

    describe('copy', () => {
        it('should call Gopass correctly', async () => {
            mockGopassResponse('someValue')
            await Gopass.copy('some-secret-name')

            expect(ipcRendererSendSpy).toHaveBeenCalledWith('gopass', {
                args: undefined,
                command: 'show "some-secret-name" -c',
                executionId: 1,
                pipeTextInto: undefined
            })
        })

        it('should deliver the secret value', async () => {
            mockGopassResponse('someValue')
            const secretValue = await Gopass.copy('some-secret-name')
            expect(secretValue).toBe('someValue')
        })
    })
})
