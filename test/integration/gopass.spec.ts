describe.skip('Gopass', () => {
    const Gopass = require('../../src/renderer/secrets/Gopass')

    it('should successfully return a password', () => {
        return expect(Gopass.show('metro/services/ncr/client/pp/username')).resolves.toBe('test')
    })

    it('should fail on missing key', () => {
        return expect(Gopass.show('some/unknown/key')).rejects.toThrow()
    })

    it('should list some secret names', () => {
        return expect(Gopass.getAllSecretNames()).resolves.toBeInstanceOf(Array)
    })
})
