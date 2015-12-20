import ReactDOM from "react-dom";
import React from "react";
import FlagContainer from "./flag";

require("./style.css");


var R = 15;
var FLAG_WIDTH = R * 44;
var FLAG_HEIGHT = R * 33;

ReactDOM.render(
	<div>
		<h2>Phase 1</h2>
		<FlagContainer
			height={FLAG_HEIGHT}
			width={FLAG_WIDTH}
			scale={R}
			name="mode_a"
			mode_two_probability={0}
		 />

		<h2>Phase 2</h2>
		<FlagContainer
			height={FLAG_HEIGHT}
			width={FLAG_WIDTH}
			scale={R}
			name="mode_b"
			mode_two_probability={15}
		 />

		<h2>Phase 3</h2>
		<FlagContainer
			height={FLAG_HEIGHT}
			width={FLAG_WIDTH}
			scale={R}
			name="mode_c"
			mode="c"
		 />
	</div>,
    document.getElementById("main")
);
