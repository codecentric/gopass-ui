import { Tree } from '../components/explorer/TreeComponent'

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
    private static directoryToTree(directory: any): Tree {
        const children: Tree[] = []
        const tree: Tree = {
            name: 'Stores',
            toggled: true,
            children: SecretsDirectoryService.getChildren(directory, true)
        }

        return tree
    }

    private static getChildren(
        directory: any | string,
        toggled: boolean = false
    ): Tree[] | undefined {
        if (!(directory instanceof Object)) {
            return undefined
        }
        const keys = Object.keys(directory).filter(key => key !== '')

        if (keys.length === 0) {
            return undefined
        }

        return keys.map(name => {
            const children = SecretsDirectoryService.getChildren(directory[name])
            return {
                name,
                children,
                toggled,
                entryId: children && children.length > 0 ? undefined : directory[name]
            }
        })
    }
}
