import React from "react";
import axios from "axios";
import GifList from "./GifList";

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { term: "", gifs: [] };
	}

	handleChange = e => {
		this.setState({
			term: e.target.value
		});
	};

	handleSubmit = e => {
		console.log("Search Gifs: " + this.state.term);
		axios
			.get(
				`http://api.giphy.com/v1/gifs/search?q=${this.state.term.toUpperCase()}&api_key=mLxD4Hc77uYnY3b5VTGOm64fNtmh3CIA`
			)
			.then(res => {
				let data = res.data.data.map(image => {
                    return {
                        id: image.id,
                        embed_url: image.embed_url
                    };
                });
				this.setState({gifs: data, isError: false});
			})
			.catch(e => {
                // console.log(e);
                this.setState({ isError: true, gifs: [] });
			});
	};

	render() {
		return (
			<div>
				<div className="header">
					<h1> Gif Search Engine </h1>
				</div>
				<div className="search">
					<input
						type="string"
						value={this.state.term}
						name="term"
						className="input-field"
						onChange={this.handleChange}
					></input>
					<button
						className="search-button"
						onClick={this.handleSubmit}
					>
						Search
					</button>
				</div>
                <GifList gifs={this.state.gifs}></GifList>
			</div>
		);
	}
}

export default SearchBar;
