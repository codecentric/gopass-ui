export default class SecretsFilterService {
    public static filterBySearch(secretNames: string[], searchValue: string): string[] {
        const searchValues = searchValue
            .split(' ')
            .map(value => value.trim())
            .filter(value => value !== '')

        return secretNames.filter(SecretsFilterService.filterMatchingSecrets(searchValues))
    }

    private static filterMatchingSecrets = (searchValues: string[]) => (secretName: string) => {
        if (searchValues.length > 0) {
            return searchValues.every(value => secretName.includes(value))
        }

        return true
    }
}
