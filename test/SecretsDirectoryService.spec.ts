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
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/common/github/password',
                                            name: 'password'
                                        },
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/common/github/username',
                                            name: 'username'
                                        }
                                    ],
                                    entryId: undefined,
                                    name: 'github'
                                },
                                {
                                    children: [
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/common/gitlab/password',
                                            name: 'password'
                                        },
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/common/gitlab/username',
                                            name: 'username'
                                        }
                                    ],
                                    entryId: undefined,
                                    name: 'gitlab'
                                }
                            ],
                            entryId: undefined,
                            name: 'common'
                        },
                        {
                            children: [
                                {
                                    children: [
                                        {
                                            children: undefined,
                                            entryId: 'codecentric/customers/some/notes',
                                            name: 'notes'
                                        }
                                    ],
                                    entryId: undefined,
                                    name: 'some'
                                }
                            ],
                            entryId: undefined,
                            name: 'customers'
                        }
                    ],
                    entryId: undefined,
                    name: 'codecentric'
                }
            ],
            name: 'Stores',
            toggled: true
        })
    })
})
