export interface GithubTag {
    url: string
    ref: string
}

export default class GithubService {
    public static getTagsOfRepository(owner: string, repositoryName: string): Promise<GithubTag[]> {
        return new Promise((resolve, reject) => {
            const httpRequest = new XMLHttpRequest()
            const url = `https://api.github.com/repos/${owner}/${repositoryName}/git/refs/tags`

            httpRequest.open('GET', url)
            httpRequest.onload = e => {
                if (httpRequest.status >= 200 && httpRequest.status < 300) {
                    resolve(JSON.parse(httpRequest.response) as GithubTag[])
                } else {
                    reject({
                        status: httpRequest.status,
                        statusText: httpRequest.statusText
                    })
                }
            }
            httpRequest.send()
        })
    }
}
