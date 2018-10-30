import { Tree, Child } from '../components/explorer/TreeComponent'

export default class SecretsDirectoryService {
    public static secretPathsToTree(secretPaths: string[]): Tree {
        const directory = SecretsDirectoryService.secretPathsToDirectory(secretPaths)
        const tree = SecretsDirectoryService.directoryToTree(directory)
        return tree
    }

    /**
     * Convert
     *  from: "metro/service/ncr/cassandra/password"
     *  to: "{ metro: { service: { ncr: { cassandra: { password: {} } } } }  }"
     */
    private static secretPathsToDirectory(secretPaths: string[]): any {
        const directory: any = {}

        for (const secretPath of secretPaths) {
            const segments = secretPath.split('/')

            let tempDir = directory
            for (const segment of segments) {
                if (!tempDir[segment]) {
                    tempDir[segment] = {}
                }
                tempDir = tempDir[segment]
            }
        }

        return directory
    }

    /**
     * Convert
     *  from: "{ metro: { service: { ncr: { cassandra: { password: {} } } } }  }"
     *  to Tree interface
     */
    private static directoryToTree(directory: any): Tree {
        const children: Child[] = []
        const tree: Tree = {
            name: 'Stores',
            toggled: true,
            children: SecretsDirectoryService.getChildren(directory)
        }

        return tree
    }

    private static getChildren(directory: any): Child[] | undefined {
        const keys = Object.keys(directory)

        if (keys.length === 0) {
            return undefined
        }

        return keys.map(name => ({
            name,
            children: SecretsDirectoryService.getChildren(directory[name])
        }))
    }
}
