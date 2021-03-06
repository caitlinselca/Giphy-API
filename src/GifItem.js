import React from "react";

const GifItem = image => {
	return (
		<div className="gif-item">
			<iframe
				src={image.gif.embed_url}
				title={image.gif.id}
				rating={image.gif.rating}
				frameBorder="0"
				className="giphy-embed"
			></iframe>
		</div>
	);
};

export default GifItem;
