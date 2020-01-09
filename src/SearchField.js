import React from 'react';
import axios from "axios";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { term: '' };
    }

    handleChange = e => {
        this.setState({
            term: e.target.value
        });
    };

    handleSubmit = e => {
        console.log("Search Gifs: " + this.state.term);
        axios
        .get('http://api.giphy.com/v1/gifs/search?q=SEARCH+TERM+GOES+HERE&api_key=mLxD4Hc77uYnY3b5VTGOm64fNtmh3CIA')
        .then(gif => {

        })
    }

    // onInputChange(term) {
    //     this.setState({term});
    //     this.props.onTermChange(term);
    // }

    render() {
        return (
            <div>
            <div className="header">
            <h1> Gifs! </h1>
            </div>
            <div className="search">
                <input
                    type="string"
                    value={this.state.term}
                    name="term"
                    className="input-field"
                    onChange={this.handleChange}
                ></input>
                <button className="search-button" onClick={this.handleSubmit}>
                Search
                </button>
            </div>
            </div>
        );
    }
}

export default SearchBar;