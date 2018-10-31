import { Tree } from '../main-app/explorer/TreeComponent'

export default class SecretsDirectoryService {
    public static secretPathsToTree(secretPaths: string[]): Tree {
        const directory = SecretsDirectoryService.secretPathsToDirectory(secretPaths)
        return SecretsDirectoryService.directoryToTree(directory, secretPaths.length)
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
            segments.forEach((segment: string, index: number) => {
                if (!tempDir[segment]) {
                    if (index + 1 === segments.length) {
                        tempDir[segment] = secretPath
                    } else {
                        tempDir[segment] = {}
                    }
                }

                tempDir = tempDir[segment]
            })
        }

        return directory
    }

    /**
     * Convert
     *  from: "{ metro: { service: { ncr: { cassandra: { password: {} } } } }  }"
     *  to Tree interface
     */
    private static directoryToTree(directory: any, totalEntries: number): Tree {
        const openAllEntries = totalEntries <= 15
        const tree: Tree = {
            name: 'Stores',
            toggled: true,
            children: SecretsDirectoryService.getChildren(directory, true, openAllEntries)
        }

        return tree
    }

    private static getChildren(directory: any | string, toggled: boolean = false, toggleAll: boolean = false): Tree[] | undefined {
        if (!(directory instanceof Object)) {
            return undefined
        }
        const keys = Object.keys(directory).filter(key => key !== '')

        if (keys.length === 0) {
            return undefined
        }

        return keys.map(name => {
            const children = SecretsDirectoryService.getChildren(directory[name], false, toggleAll)
            return {
                name,
                children,
                toggled: toggleAll ? true : toggled,
                entryId: children && children.length > 0 ? undefined : directory[name]
            }
        })
    }
}
