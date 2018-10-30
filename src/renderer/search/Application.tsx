import * as React from 'react'
import * as m from 'react-materialize'
import SearchResults from './SearchResults'

export default class Application extends React.Component<any, { searchValue: string }> {
    constructor(props: any) {
        super(props)
        this.state = {
            searchValue: ''
        }
    }

    public render() {
        return (
            <div>
                <m.Input placeholder="filter..." onChange={this.onChangeSearch} />
                <SearchResults search={this.state.searchValue} />
            </div>
        )
    }

    private onChangeSearch = (_: any, searchValue: string) => {
        this.setState({ searchValue })
    }
}
