import React from "react";
import axios from "axios";
import GifItem from "./GifItem";

const API_KEY = "mLxD4Hc77uYnY3b5VTGOm64fNtmh3CIA";

class GifList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gifs: props.gifs,
			mode: props.mode,
			sortByDate: props.sortByDate
		};
	}

	// componentDidMount() {
	// 	const { gifs, sortByDate, mode } = this.state;
	// 	if (mode === "search" && sortByDate) {
	// 		let sortedGifs = Array.from(gifs).sort((a, b) => {
	// 			return new Date(b.date) - new Date(a.date);
	// 		});
	// 		this.setState({ gifs: sortedGifs });
	// 	}
	// }

	render() {
		// let gifItems;
		// if (this.state.gifs) {
		// 	gifItems = this.state.gifs.map(image => {
		// 		return <GifItem key={image.id} gif={image} />;
		// 	});
		// } else {
		// 	gifItems = "";
		// }

		let gifItems = this.props.gifs.map(image => {
			return <GifItem key={image.id} gif={image} />;
		});

		return <div className="gif-list">{gifItems}</div>;
	}
}

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			term: "",
			gifs: [],
			rating: "",
			lang: "",
			isError: false,
			pageNumber: 0,
			gifsPerPage: 15,
			sortByDate: false,
			noResults: false
		};
	}

	componentDidMount() {
		this.callGiphyAPI();
	}

	callGiphyAPI = (direction = 1) => {
		const { rating, mode, pageNumber, gifsPerPage, lang } = this.state;
		let url;
		let params = {
			limit: gifsPerPage,
			offset:
				direction === 1
					? pageNumber * gifsPerPage
					: (pageNumber - 2) * gifsPerPage
		};

		if (rating !== "") {
			params["rating"] = rating;
		}
		if (lang !== "") {
			params["lang"] = lang;
		}

		if (mode === "trending") {
			url = `http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`;
		} else if (mode === "search") {
			url = `http://api.giphy.com/v1/gifs/search?q=${this.state.term.toUpperCase()}&api_key=${API_KEY}`;
		}

		axios
			.get(url, { params: params })
			.then(res => {
				if (mode === "search" && !res.data.data.length) {
					this.setState({
						noResults: true
					});
				} else {
					this.setState({
						noResults: false
					});
				}

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
							embed_url: image.embed_url,
							date: image.import_datetime
						};
					});
					this.setState({
						gifs: data,
						pageNumber: pageNumber + direction,
						isError: false
					});
			.catch(err => {
				this.setState({ isError: true, gifs: [] });
			});
	}

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
		if (this.state.term) {
			this.setState({ mode: "search", pageNumber: 0 }, () =>
				this.callGiphyAPI()
			);
		} else {
			alert("Please enter a search term!");
		}
	};

	handleSubmit = e => {
		axios
			.get(
				`http://api.giphy.com/v1/gifs/search?q=${this.state.term.toUpperCase()}&rating=${this.state.rating}&api_key=mLxD4Hc77uYnY3b5VTGOm64fNtmh3CIA`
			)
			.then(res => {
				let data = res.data.data.map(image => {
					return {
						id: image.id,
						embed_url: image.embed_url,
						rating: image.rating
					};
				});
				this.setState({ gifs: data, isError: false });
			})
			.catch(e => {
				this.setState({ isError: true, gifs: [] });
			});
	};

	handleBottom = e => {
		axios
			.get(
				"http://api.giphy.com/v1/gifs/trending?api_key=mLxD4Hc77uYnY3b5VTGOm64fNtmh3CIA",
				{
					params: {
						limit: this.state.itemsPerPage,
						offset: this.state.pageNumber * this.state.itemsPerPage
					}
				}
			)
			.then(trendinggifs => {
				this.setState({
					gifs: this.state.gifs.concat(trendinggifs.data.data),
					pageNumber: this.state.pageNumber + 1
				});
			})
			.catch(err => {
				this.setState({ isError: true, gifs: [] });
			});
	};

	handleRatingChange = j => {
		this.setState({
			rating: j.target.value
		});
	};

	handleLanguageChange = e => {
		this.setState({
			lang: e.target.value
		});
	};

	handleReset = () => {
		this.setState(
			{
				gifs: [],
				noResults: false,
				isError: false,
				term: "",
				pageNumber: 0,
				rating: "",
				lang: "",
				mode: "trending"
			},
			() => this.callGiphyAPI()
		);
	};

	// handleCheckboxChange = e => {
	// 	this.setState({
	// 		sortByDate: !this.state.sortByDate
	// 	});
	// };

	render() {
		const { gifs, sortByDate, pageNumber, mode } = this.state;

		return (
			<div className="container">
				<div className="header">
					<h1> Gif Search Engine </h1>
				</div>
				<div className="info-container">
					<div className="search-container">
						<input
							type="string"
							value={this.state.term}
							placeholder="Enter search terms"
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
						<h3>Page: {pageNumber}</h3>
						<button
							onClick={this.handleNextPage}
							className="pagination-buttons"
						>
							Next
						</button>
					</div>
					<div className="filter-sort-container">
						<div className="filter-container">
							<div className="filter-header">
								<h2 style={{ margin: 0 }}>Filters:</h2>
							</div>
							<div className="filter-content">
								<div className="filter">
									<h3 className="filter-label">Rating: </h3>
									<select
										name="rating"
										className="filter-select"
										onChange={this.handleRatingChange}
									>
										<option disabled selected value>
											-- select rating --
										</option>
										<option value="g">G</option>
										<option value="pg">PG</option>
										<option value="pg-13">PG-13</option>
										<option value="r">R</option>
									</select>
								</div>
								<div className="filter">
									<h3 className="filter-label">Language: </h3>
									<select
										name="lang"
										className="filter-select"
										onChange={this.handleLanguageChange}
									>
										<option disabled selected value>
											-- select language --
										</option>
										<option value="en">English</option>
										<option value="es">Spanish</option>
										<option value="pt">Portugese</option>
										<option value="id">Indonesian</option>
										<option value="fr">French</option>
										<option value="ar">Arabic</option>
										<option value="tr">Turkish</option>
										<option value="th">Thai</option>
										<option value="vi">Vietnamese</option>
										<option value="de">German</option>
										<option value="it">Italian</option>
										<option value="jp">Japanese</option>
										<option value="zh-CN">
											Chinese Simplified
										</option>
										<option value="zh-TW">
											Chinese Traditional
										</option>
										<option value="ru">Russian</option>
										<option value="ko">Korean</option>
										<option value="pl">Polish</option>
										<option value="nl">Dutch</option>
										<option value="ro">Romanian</option>
										<option value="hu">Hungarian</option>
										<option value="sv">Swedish</option>
										<option value="cs">Czech</option>
										<option value="hi">Hindi</option>
										<option value="bn">Bengali</option>
										<option value="da">Danish</option>
										<option value="fa">Farsi</option>
										<option value="tl">Filipino</option>
										<option value="fi">Finnish</option>
										<option value="iw">Hebrew</option>
										<option value="ms">Malay</option>
										<option value="no">Norweigan</option>
										<option value="uk">Ukrainian</option>
									</select>
								</div>
							</div>
						</div>

						{/* <h3 className="sort-label">Sort By: </h3>
						<input
							name="sort"
							className="sort-checkbox"
							type="checkbox"
							checked={sortByDate}
							onChange={this.handleCheckboxChange}
						></input> */}
					</div>
					<div className="reset-container">
						<button
							onClick={this.handleReset}
							className="reset-button"
						>
							Reset
						</button>
					</div>
				</div>
				{this.state.noResults ? <h2>No Results</h2> : ""}
				<GifList
					gifs={gifs}
					mode={mode}
					sortByDate={sortByDate}
				></GifList>
			</div>
		);
	}
}

export default SearchBar;