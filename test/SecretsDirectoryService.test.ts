import { Tree } from '../src/renderer/components/tree/TreeComponent'
import SecretsDirectoryService from '../src/renderer/explorer-app/side-navigation/SecretsDirectoryService'

describe('SecretsDirectoryService', () => {
    it('should transform a list of secret names into tree structure', () => {
        const secretPaths = [
            'codecentric/common/github/password',
            'codecentric/common/github/username',
            'codecentric/common/gitlab/password',
            'codecentric/common/gitlab/username',
            'codecentric/customers/some/notes'
        ]
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(secretPaths, { name: 'someName', path: '' }, false)
        expect(tree).toMatchSnapshot()
    })

    it('should automatically toggle all nodes', () => {
        const secretPaths = [
            'codecentric/some-secret',
            'codecentric/common/something',
            'codecentric/common/another-thing',
            'codecentric/db/user',
            'codecentric/db/password'
        ]
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(secretPaths, { name: 'someName', path: '' }, true)
        expect(tree).toMatchSnapshot()
    })

    it('should preserve previously toggled nodes when building a new tree', () => {
        const secretPaths = [
            'codecentric/some-secret',
            'codecentric/common/something',
            'codecentric/common/another-thing',
            'codecentric/db/user',
            'codecentric/db/password'
        ]
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(
            secretPaths,
            {
                name: '',
                path: '',
                children: [
                    {
                        name: 'codecentric',
                        path: 'codecentric',
                        toggled: true,
                        children: [{ name: 'some-secret', path: 'codecentric/some-secret' }, { name: 'common', path: 'codecentric/common', toggled: true }]
                    }
                ]
            },
            false
        )
        expect(tree).toMatchSnapshot()
    })
})
