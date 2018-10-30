import * as React from 'react'
import * as m from 'react-materialize'
import * as replace from 'string-replace-to-array'
import Gopass from '../service/Gopass'

interface SearchResultsState {
    results: string[]
    secretNames: string[]
    searchValues: string[]
}
interface SearchResultsProps {
    search?: string
}

export default class SearchResults extends React.Component<SearchResultsProps, SearchResultsState> {
    constructor(props: any) {
        super(props)
        this.state = {
            results: [],
            secretNames: [],
            searchValues: []
        }
    }

    public async componentDidMount() {
        const secretNames = await Gopass.getAllSecretNames()

        this.setState({
            secretNames
        })
    }

    public componentWillReceiveProps(props: SearchResultsProps) {
        if (props.search) {
            this.setState({
                searchValues: props.search
                    .split(' ')
                    .map(searchValue => searchValue.trim())
                    .filter(searchValue => searchValue !== '')
            })
        }
    }

    public render() {
        const filteredSecretNames = this.state.secretNames
            .filter(this.filterMatchingSecrets)
            .slice(0, 30)
        const highlightRegExp =
            this.state.searchValues.length > 0
                ? new RegExp(`(${this.state.searchValues.join('|')})`, 'g')
                : undefined

        return (
            <m.Collection>
                {filteredSecretNames.map((secretName, i) => {
                    const splittedSecretName = secretName.split('/')

                    return (
                        <m.CollectionItem key={`secret-${i}`}>
                            {splittedSecretName.reduce(
                                (result: string[], segment, currentIndex) => {
                                    const extendedResult = result.concat(
                                        this.getHighlightedSegment(segment, highlightRegExp)
                                    )

                                    if (currentIndex < splittedSecretName.length - 1) {
                                        extendedResult.push(' > ')
                                    }

                                    return extendedResult
                                },
                                []
                            )}
                        </m.CollectionItem>
                    )
                })}
            </m.Collection>
        )
    }

    private getHighlightedSegment = (segment: string, highlightRegExp?: RegExp) => {
        if (!highlightRegExp) {
            return segment
        }

        return replace(segment, highlightRegExp, (_: any, match: string, offset: number) => {
            return <mark key={`highlight-${segment}-${offset}`}>{match}</mark>
        })
    }

    private filterMatchingSecrets = (secretName: string) => {
        if (this.state.searchValues.length > 0) {
            return this.state.searchValues.every(searchValue => secretName.includes(searchValue))
        }

        return true
    }
}
