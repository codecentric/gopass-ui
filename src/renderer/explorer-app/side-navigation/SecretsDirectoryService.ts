import { Tree } from '../../components/tree/TreeComponent'

export default class SecretsDirectoryService {
    public static secretPathsToTree(secretPaths: string[], previousTree: Tree): Tree {
        const directory = SecretsDirectoryService.secretPathsToDirectory(secretPaths)
        return SecretsDirectoryService.directoryToTree(directory, previousTree, secretPaths.length)
    }

    /**
     * Convert
     *  from: "xyz/service/someServiceName/db/password"
     *  to: "{ xyz: { service: { someServiceName: { db: { password: {} } } } }  }"
     */
    private static secretPathsToDirectory(secretPaths: string[]): any {
        const directory: { [key: string]: any } = {}

        for (const secretPath of secretPaths) {
            const segments = secretPath.split('/')

            let tempDir = directory
            segments.forEach((segment: string, index: number) => {
                if (!tempDir[segment]) {
                    tempDir[segment] = index + 1 === segments.length ? secretPath : {}
                }

                tempDir = tempDir[segment]
            })
        }

        return directory
    }

    private static getToggledPathsFromTree(tree: Tree): string[] {
        const paths: string[] = []

        for (const child of tree.children || []) {
            if (child.toggled) {
                paths.push(child.path)
            }
            paths.push(...SecretsDirectoryService.getToggledPathsFromTree(child))
        }

        return paths
    }

    /**
     * Convert
     *  from: "{ xyz: { service: { someServiceName: { db: { password: {} } } } }  }"
     *  to Tree interface
     */
    private static directoryToTree(directory: any, previousTree: Tree, totalEntries: number): Tree {
        const openAllEntries = totalEntries <= 15
        const toggledPaths = SecretsDirectoryService.getToggledPathsFromTree(previousTree)
        const children = SecretsDirectoryService.getChildren(directory, toggledPaths, true, openAllEntries)
        const tree: Tree = {
            name: 'Stores',
            toggled: true,
            path: '',
            children
        }

        return tree
    }

    private static getChildren(
        directory: any | string,
        toggledPaths: string[],
        toggled: boolean = false,
        toggleAll: boolean = false,
        parentPath = ''
    ): Tree[] | undefined {
        if (!(directory instanceof Object)) {
            return undefined
        }
        const childDirNames = Object.keys(directory).filter(key => key !== '')

        if (childDirNames.length === 0) {
            return undefined
        }

        return childDirNames.map(name => {
            const path = parentPath.length > 0 ? parentPath + '/' + name : name
            const toggledFromPreviousTree = toggledPaths.includes(path)
            const toggledPathsLeft = toggledFromPreviousTree ? toggledPaths.filter(p => p !== path) : toggledPaths
            const children = SecretsDirectoryService.getChildren(directory[name], toggledPathsLeft, false, toggleAll, path)

            return {
                name,
                path,
                children,
                toggled: toggleAll || toggled || toggledFromPreviousTree
            }
        })
    }
}
