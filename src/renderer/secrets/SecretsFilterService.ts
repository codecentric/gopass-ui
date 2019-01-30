export default class SecretsFilterService {
    public static filterBySearch(secretNames: string[], searchValue: string): string[] {
        const searchValues = searchValue
            .split(' ')
            .map(_ => _.trim())
            .filter(_ => _ !== '')

        return secretNames.filter(SecretsFilterService.filterMatchingSecrets(searchValues))
    }

    private static filterMatchingSecrets = (searchValues: string[]) => (secretName: string) => {
        if (searchValues.length > 0) {
            return searchValues.every(_ => secretName.includes(_))
        }

        return true
    }
}
