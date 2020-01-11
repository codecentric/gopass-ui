import { Tree } from '../../components/tree/TreeComponent'

export default class SecretsDirectoryService {
    public static secretPathsToTree(secretPaths: string[], selectedSecretName: string | undefined): Tree {
        const directory = SecretsDirectoryService.secretPathsToDirectory(secretPaths)
        return SecretsDirectoryService.directoryToTree(directory, selectedSecretName, secretPaths.length)
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

    /**
     * Convert
     *  from: "{ xyz: { service: { someServiceName: { db: { password: {} } } } }  }"
     *  to Tree interface
     */
    private static directoryToTree(directory: any, selectedPath: string | undefined, totalEntries: number): Tree {
        const openAllEntries = totalEntries <= 15
        const children = SecretsDirectoryService.getChildren(directory, selectedPath, true, openAllEntries)
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
        selectedPath: string | undefined,
        toggled: boolean = false,
        toggleAll: boolean = false,
        parentPath = ''
    ): Tree[] | undefined {
        if (!(directory instanceof Object)) {
            return undefined
        }
        const keys = Object.keys(directory).filter(key => key !== '')

        if (keys.length === 0) {
            return undefined
        }

        return keys.map(name => {
            const path = parentPath.length > 0 ? parentPath + '/' + name : name
            const children = SecretsDirectoryService.getChildren(directory[name], selectedPath, false, toggleAll, path)
            const isToggledBecauseChildSelected =
                !!selectedPath && selectedPath.length > 0 && !!path && path.length > 0 && !!children && children.length > 0 && selectedPath.startsWith(path)

            return {
                name,
                path,
                children,
                toggled: toggleAll || toggled || isToggledBecauseChildSelected
            }
        })
    }
}
