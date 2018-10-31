export default class SecretsFilterService {
    public static filterBySearch(secretNames: string[], searchValue: string): string[] {
        const searchValues = searchValue
            .split(' ')
            .map(searchValue => searchValue.trim())
            .filter(searchValue => searchValue !== '')

        return secretNames.filter(SecretsFilterService.filterMatchingSecrets(searchValues))
    }

    private static filterMatchingSecrets = (searchValues: string[]) => (secretName: string) => {
        if (searchValues.length > 0) {
            return searchValues.every(searchValue => secretName.includes(searchValue))
        }

        return true
    }
}