import React from "react";
import axios from "axios";
import GifList from "./GifList";
import GifItem from "./GifItem";
import InfiniteScroll from "react-infinite-scroll-component";

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			term: "",
            gifs: [],
            rating: "",
			isError: false,
			pageNumber: 0,
			itemsPerPage: 15
		};
	}

	componentDidMount() {
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
					gifs: trendinggifs.data.data,
					pageNumber: this.state.pageNumber + 1
				});
			})
			.catch(err => {
				this.setState({ isError: true, gifs: [] });
			});
	}

	handleChange = e => {
		this.setState({
			term: e.target.value
		});
	};

	handleRandomChange = j => {
		this.setState({
			rating: j.target.value
		});
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
					<select name="rating" class="filter-by-rating" onChange={this.handleRandomChange} >
                        <option value="" select></option>
                        <option value="g" select>G</option>
                        <option value="pg" select>PG</option>
                        <option value="pg-13" select>PG-13</option>
                        <option value="r" select>R</option>
                    </select>
					<button
						className="search-button"
						onClick={this.handleSubmit}
					>
						Search
					</button>
				</div>
				{console.log(this.state.pageNumber, this.state.itemsPerPage)}
				<InfiniteScroll
					dataLength={this.state.gifs.length}
					next={this.handleBottom}
					hasMore={true}
					loader={<h4>Loading...</h4>}
				>
					<div className="gif-list">
						{this.state.gifs.map(image => {
							return <GifItem gif={image} />;
						})}
					</div>
				</InfiniteScroll>
			</div>
		);
	}
}

export default SearchBar;