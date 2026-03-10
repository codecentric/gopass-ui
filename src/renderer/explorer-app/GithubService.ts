export interface GithubTag {
    url: string
    ref: string
}

export default class GithubService {
    public static async getTagsOfRepository(owner: string, repositoryName: string): Promise<GithubTag[]> {
        const url = `https://api.github.com/repos/${owner}/${repositoryName}/git/refs/tags`
        const response = await fetch(url)

        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }

        return (await response.json()) as GithubTag[]
    }
}
