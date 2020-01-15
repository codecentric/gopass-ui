import { deriveIconFromSecretName } from '../src/renderer/secrets/deriveIconFromSecretName'

describe('deriveIconFromSecretName', () => {
    it('should derive "comment" icon on unclassifiable secret names', () => {
        expect(deriveIconFromSecretName('blablabla')).toBe('comment')
    })

    describe('"lock" icon', () => {
        const testCases = [
            { secretName: 'some/random/password' },
            { secretName: 'some/random/secret' },
            { secretName: 'some/random/phraseapp-key' },
            { secretName: 'some/random/passphrase' },
            { secretName: 'some/random/certificate' }
        ]

        testCases.forEach(testCase => {
            it(`should derive icon "lock" from secret name "${testCase.secretName}" which is indicating a password`, () => {
                const result = deriveIconFromSecretName(testCase.secretName)
                expect(result).toBe('lock')
            })
        })
    })

    describe('"person" icon', () => {
        const testCases = [{ secretName: 'some/random/user' }, { secretName: 'some/random/name' }, { secretName: 'some/random/id' }]

        testCases.forEach(testCase => {
            it(`should derive icon "person" from secret name "${testCase.secretName}"`, () => {
                const result = deriveIconFromSecretName(testCase.secretName)
                expect(result).toBe('person')
            })
        })
    })

    describe('"comment" icon', () => {
        const testCases = [
            { secretName: 'some/random/something-without-pattern' },
            { secretName: 'some/random/note' },
            { secretName: 'some/random/comment' },
            { secretName: 'some/random/misc' }
        ]

        testCases.forEach(testCase => {
            it(`should derive icon "comment" from secret name "${testCase.secretName}"`, () => {
                const result = deriveIconFromSecretName(testCase.secretName)
                expect(result).toBe('comment')
            })
        })
    })

    describe('"filter_center_focus" icon', () => {
        const testCases = [
            { secretName: 'some/random/uri' },
            { secretName: 'some/random/url' },
            { secretName: 'some/random/link' },
            { secretName: 'some/random/connection' }
        ]

        testCases.forEach(testCase => {
            it(`should derive icon "filter_center_focus" from secret name "${testCase.secretName}"`, () => {
                const result = deriveIconFromSecretName(testCase.secretName)
                expect(result).toBe('filter_center_focus')
            })
        })
    })
})
