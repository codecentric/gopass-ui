import SecretsDirectoryService from '../src/renderer/service/SecretsDirectoryService'
import { Tree } from '../src/renderer/components/explorer/TreeComponent'

describe('SecretsDirectoryService', () => {
    it('should transform a list of secret names into tree structure', () => {
        const secretPaths = [
            'codecentric/common/github/password',
            'codecentric/common/github/username',
            'codecentric/common/gitlab/password',
            'codecentric/common/gitlab/username',
            'codecentric/customers/some/notes'
        ]
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(secretPaths)

        // tslint:disable-next-line
        expect(tree).toEqual({
            children: [
                {
                    children: [
                        {
                            children: [
                                {
                                    children: [
                                        { children: undefined, name: 'password' },
                                        { children: undefined, name: 'username' }
                                    ],
                                    name: 'github'
                                },
                                {
                                    children: [
                                        { children: undefined, name: 'password' },
                                        { children: undefined, name: 'username' }
                                    ],
                                    name: 'gitlab'
                                }
                            ],
                            name: 'common'
                        },
                        {
                            children: [
                                { children: [{ children: undefined, name: 'notes' }], name: 'some' }
                            ],
                            name: 'customers'
                        }
                    ],
                    name: 'codecentric'
                }
            ],
            name: 'Stores',
            toggled: true
        })
    })
})
