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
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(secretPaths, 'codecentric/common/gitlab/password')

        expect(tree).toEqual({
            children: [
                {
                    children: [
                        {
                            children: [
                                {
                                    children: [
                                        {
                                            children: undefined,
                                            path: 'codecentric/common/github/password',
                                            name: 'password',
                                            toggled: true
                                        },
                                        {
                                            children: undefined,
                                            path: 'codecentric/common/github/username',
                                            name: 'username',
                                            toggled: true
                                        }
                                    ],
                                    path: 'codecentric/common/github',
                                    name: 'github',
                                    toggled: true
                                },
                                {
                                    children: [
                                        {
                                            children: undefined,
                                            path: 'codecentric/common/gitlab/password',
                                            name: 'password',
                                            toggled: true
                                        },
                                        {
                                            children: undefined,
                                            path: 'codecentric/common/gitlab/username',
                                            name: 'username',
                                            toggled: true
                                        }
                                    ],
                                    path: 'codecentric/common/gitlab',
                                    name: 'gitlab',
                                    toggled: true
                                }
                            ],
                            path: 'codecentric/common',
                            name: 'common',
                            toggled: true
                        },
                        {
                            children: [
                                {
                                    children: [
                                        {
                                            children: undefined,
                                            path: 'codecentric/customers/some/notes',
                                            name: 'notes',
                                            toggled: true
                                        }
                                    ],
                                    path: 'codecentric/customers/some',
                                    name: 'some',
                                    toggled: true
                                }
                            ],
                            path: 'codecentric/customers',
                            name: 'customers',
                            toggled: true
                        }
                    ],
                    path: 'codecentric',
                    name: 'codecentric',
                    toggled: true
                }
            ],
            name: 'Stores',
            path: '',
            toggled: true
        })
    })
})
