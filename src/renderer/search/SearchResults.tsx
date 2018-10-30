import * as React from 'react'
import * as m from 'react-materialize'
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
                searchValues: props.search.split(' ')
            })
        }
    }

    public render() {
        const filteredSecretNames = this.state.secretNames
            .filter(this.filterMatchingSecrets)
            .slice(0, 20)

        return (
            <m.Collection>
                {filteredSecretNames.map((secretName, i) => (
                    <m.CollectionItem key={`secret-${i}`}>
                        {secretName.split('/').join(' > ')}
                    </m.CollectionItem>
                ))}
            </m.Collection>
        )
    }

    private getHighlighted = () => {}

    private filterMatchingSecrets = (secretName: string) => {
        if (this.state.searchValues.length > 0) {
            return this.state.searchValues.every(searchValue => secretName.includes(searchValue))
        }

        return true
    }
}
