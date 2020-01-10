import React from "react";

const GifItem = image => {
	return (
		<div className="gif-item">
			<iframe
				src={image.gif.embed_url}
				title={image.gif.id}
				frameBorder="0"
				class="giphy-embed"
			></iframe>
		</div>
	);
};

export default GifItem;
