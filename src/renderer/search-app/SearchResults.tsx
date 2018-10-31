import * as React from 'react'
import * as m from 'react-materialize'
import * as replace from 'string-replace-to-array'
import Gopass from '../secrets/Gopass'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

const NUMBER_OF_SEARCH_RESULTS = 15

interface SearchResultsState {
    results: string[]
    secretNames: string[]
    searchValues: string[]
    selectedItemIndex: number
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
            searchValues: [],
            selectedItemIndex: 0
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
                    .filter(searchValue => searchValue !== ''),
                selectedItemIndex: 0
            })
        }
    }

    public render() {
        const filteredSecretNames = this.state.secretNames.filter(this.filterMatchingSecrets).slice(0, NUMBER_OF_SEARCH_RESULTS)
        const highlightRegExp = this.state.searchValues.length > 0 ? new RegExp(`(${this.state.searchValues.join('|')})`, 'g') : undefined

        return (
            <div>
                <KeyboardEventHandler handleKeys={ [ 'up', 'shift+tab', 'down', 'tab', 'enter' ] } onKeyEvent={ this.onKeyEvent } />
                <m.Collection>
                    {filteredSecretNames.map((secretName, i) => {
                        const splittedSecretName = secretName.split('/')
                        const isSelected = i === this.state.selectedItemIndex ? 'selected' : undefined

                        return (
                            <m.CollectionItem key={`secret-${i}`} className={ isSelected }>
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
            </div>
        )
    }

    private onKeyEvent = (key: string) => {
        switch (key) {
            case 'shift+tab':
            case 'up':
                if (this.state.selectedItemIndex > 0) {
                    this.setState({
                        selectedItemIndex: this.state.selectedItemIndex - 1
                    })
                }
                break
            case 'down':
            case 'tab':
                if (this.state.selectedItemIndex < this.state.secretNames.length) {
                    this.setState({
                        selectedItemIndex: this.state.selectedItemIndex + 1
                    })
                }
                break
            case 'enter':

                break
        }
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
