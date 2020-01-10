import React from "react";
import axios from "axios";
import GifList from "./GifList";

const API_KEY = "mLxD4Hc77uYnY3b5VTGOm64fNtmh3CIA";

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			term: "",
			gifs: [],
			isError: false,
			pageNumber: 0,
			gifsPerPage: 9
		};
	}

	componentDidMount() {
		const { pageNumber, gifsPerPage } = this.state;
		axios
			.get(`http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`, {
				params: {
					limit: gifsPerPage,
					offset: pageNumber * gifsPerPage
				}
			})
			.then(trendinggifs => {
				this.setState({
					gifs: trendinggifs.data.data,
					pageNumber: pageNumber + 1
				});
			})
			.catch(err => {
				this.setState({ isError: true, gifs: [] });
			});
	}

	call;

	handleChange = e => {
		this.setState({
			term: e.target.value
		});
	};

	handleSubmit = e => {
		axios
			.get(
				`http://api.giphy.com/v1/gifs/search?q=${this.state.term.toUpperCase()}&api_key=${API_KEY}`
			)
			.then(res => {
				let data = res.data.data.map(image => {
					return {
						id: image.id,
						embed_url: image.embed_url
					};
				});
				this.setState({ gifs: data, isError: false });
			})
			.catch(e => {
				this.setState({ isError: true, gifs: [] });
			});
	};

	handleNextPage = e => {};

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
				<div className="pagination-container">
					<button>Prev</button>
					<p>{this.state.pageNumber}</p>
					<button>Next</button>
				</div>
				<GifList gifs={this.state.gifs}></GifList>
			</div>
		);
	}
}

export default SearchBar;
