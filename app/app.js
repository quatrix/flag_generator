import ReactDOM from "react-dom";
import React from "react";
import FlagContainer from "./flag";

require("./style.css");


var R = 15;
var FLAG_WIDTH = R * 44;
var FLAG_HEIGHT = R * 33;

ReactDOM.render(
	<FlagContainer
		height={FLAG_HEIGHT}
		width={FLAG_WIDTH}
		scale={R}
		mode_two_probability={0}
	 />,
    document.getElementById("main")
);
