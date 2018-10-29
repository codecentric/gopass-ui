import Gopass from '../../src/Gopass'

describe('Gopass', () => {
    it('should successfully return a password', () => {
        return expect(Gopass.show('metro/services/ncr/client/pp/username')).resolves.toBe('test')
    })

    it('should fail on missing key', () => {
        return expect(Gopass.show('some/unknown/key')).rejects.toThrow()
    })
})
