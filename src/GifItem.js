import React from "react";

const GifItem = props => {
	return (
		<li>
			<img src={props.gif.embed_url} />
			{/* <iframe
				src={props.gif.embed_url}
				width="480"
				height="255"
				frameBorder="0"
				class="giphy-embed"
				allowFullScreen
			></iframe> */}
		</li>
	);
};

export default GifItem;
