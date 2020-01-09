import React from "react";

const GifItem = (image) => {
  return (
    <li>
      {/* <img src={image.gif.embed_url} /> */}
      	<iframe
				src={image.gif.embed_url}
				width="480"
				height="255"
				frameBorder="0"
				class="giphy-embed"
				allowFullScreen
			></iframe>
    </li>
  )
};

export default GifItem;
