import React from "react";
import axios from "axios";
import GifItem from "./GifItem";

const API_KEY = "mLxD4Hc77uYnY3b5VTGOm64fNtmh3CIA";

const GifList = props => {
	const gifItems = props.gifs.map(image => {
		return <GifItem key={image.id} gif={image} />;
	});

	return <div className="gif-list">{gifItems}</div>;
};

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			term: "",
			gifs: [],
			isError: false,
			mode: "trending",
			pageNumber: 0,
			gifsPerPage: 15
		};
	}

	componentDidMount() {
		this.callGiphyAPI();
	}

	callGiphyAPI = (direction = 1) => {
		const { mode, pageNumber, gifsPerPage } = this.state;
		let url;
		let params = {
			limit: gifsPerPage,
			offset: (pageNumber + direction) * gifsPerPage
		};

		if (mode === "trending") {
			url = `http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`;
		} else if (mode === "search") {
			url = `http://api.giphy.com/v1/gifs/search?q=${this.state.term.toUpperCase()}&api_key=${API_KEY}`;
		}

		axios
			.get(url, { params: params })
			.then(res => {
				if (mode === "trending") {
					this.setState({
						gifs: res.data.data,
						pageNumber: pageNumber + direction,
						isError: false
					});
				} else if (mode === "search") {
					let data = res.data.data.map(image => {
						return {
							id: image.id,
							embed_url: image.embed_url
						};
					});
					this.setState({
						gifs: data,
						pageNumber: pageNumber + direction,
						isError: false
					});
				}
			})
			.catch(e => {
				this.setState({ isError: true, gifs: [] });
			});
	};

	handleChange = e => {
		this.setState({
			term: e.target.value
		});
	};

	handleEnter = e => {
		if (e.keyCode === 13) {
			this.setState({ mode: "search", pageNumber: 0 }, () =>
				this.callGiphyAPI()
			);
		}
	};

	handleSubmit = mode => {
		this.setState({ mode: "search", pageNumber: 0 }, () =>
			this.callGiphyAPI()
		);
	};

	handleHeaderClick = e => {
		this.setState({ mode: "trending", pageNumber: 0, term: "" }, () =>
			this.callGiphyAPI()
		);
	};

	handleNextPage = e => {
		this.callGiphyAPI();
	};
	handlePrevPage = e => {
		if (this.state.pageNumber > 1) {
			this.callGiphyAPI(-1);
		}
	};

	render() {
		return (
			<div className="container">
				<div className="header">
					<h1 onClick={this.handleHeaderClick}>Gif Search Engine</h1>
				</div>
				<div className="info-container">
					<div className="search-container">
						<input
							type="string"
							value={this.state.term}
							name="term"
							className="input-field"
							onChange={this.handleChange}
							onKeyDown={this.handleEnter}
						></input>
						<button
							className="search-button"
							onClick={this.handleSubmit}
						>
							Search
						</button>
					</div>
					<div className="pagination-container">
						<button
							onClick={this.handlePrevPage}
							className="pagination-buttons"
						>
							Prev
						</button>
						<h3>{this.state.pageNumber}</h3>
						<button
							onClick={this.handleNextPage}
							className="pagination-buttons"
						>
							Next
						</button>
					</div>
				</div>
				<GifList gifs={this.state.gifs}></GifList>
			</div>
		);
	}
}

export default SearchBar;
