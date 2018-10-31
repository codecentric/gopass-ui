import SecretsDirectoryService from '../src/renderer/secrets/SecretsDirectoryService'
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
                                            entryId: 'codecentric/common/github/password',
                                            name: 'password',
                                            toggled: false
                                        },
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/common/github/username',
                                            name: 'username',
                                            toggled: false
                                        }
                                    ],
                                    entryId: undefined,
                                    name: 'github',
                                    toggled: false
                                },
                                {
                                    children: [
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/common/gitlab/password',
                                            name: 'password',
                                            toggled: false
                                        },
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/common/gitlab/username',
                                            name: 'username',
                                            toggled: false
                                        }
                                    ],
                                    entryId: undefined,
                                    name: 'gitlab',
                                    toggled: false
                                }
                            ],
                            entryId: undefined,
                            name: 'common',
                            toggled: false
                        },
                        {
                            children: [
                                {
                                    children: [
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/customers/some/notes',
                                            name: 'notes',
                                            toggled: false
                                        }
                                    ],
                                    entryId: undefined,
                                    name: 'some',
                                    toggled: false
                                }
                            ],
                            entryId: undefined,
                            name: 'customers',
                            toggled: false
                        }
                    ],
                    entryId: undefined,
                    name: 'codecentric',
                    toggled: true
                }
            ],
            name: 'Stores',
            toggled: true
        })
    })
})
