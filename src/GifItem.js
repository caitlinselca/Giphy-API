import React from "react";

const GifItem = (image) => {
  return (
    <div className="gif-item">
      	<iframe
				src={image.gif.embed_url}
				width="480"
        height="255"
				frameBorder="0"
				class="giphy-embed"
				allowFullScreen
			></iframe>
    </div>
  )
};

export default GifItem;
