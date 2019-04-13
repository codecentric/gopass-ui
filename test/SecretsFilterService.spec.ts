import SecretsFilterService from '../src/renderer/explorer-app/side-navigation/SecretsFilterService'

const secretNames = [
    'codecentric/common/github/password',
    'codecentric/common/github/username',
    'codecentric/common/gitlab/password',
    'codecentric/common/gitlab/username',
    'codecentric/customers/some/notes',
    'codecentric/some-project/cassandra/dev/pw',
    'codecentric/some-project/cassandra/dev/user',
    'codecentric/some-project/cassandra/prod/pw',
    'codecentric/some-project/cassandra/prod/user'
]

describe('SecretsFilterService', () => {
    it('should do a simple search on names', () => {
        const results = SecretsFilterService.filterBySearch(secretNames, 'cassandra')
        expect(results.length).toBe(4)
    })

    it('should do a search with two terms on names', () => {
        const results = SecretsFilterService.filterBySearch(secretNames, 'cassandra user')
        expect(results.length).toBe(2)

        const moreResults = SecretsFilterService.filterBySearch(secretNames, 'cassandra user prod')
        expect(moreResults.length).toBe(1)
    })

    it('should do a search with two terms on names without matches', () => {
        const results = SecretsFilterService.filterBySearch(secretNames, 'cassandra user pp')
        expect(results.length).toBe(0)
    })
})
