import ReactDOM from "react-dom";
import React from "react";
import Flag from "./flag";

require("./style.css");


var R = 15;
var FLAG_WIDTH = R * 44;
var FLAG_HEIGHT = R * 33;

ReactDOM.render(
	<Flag height={FLAG_HEIGHT} width={FLAG_WIDTH} />,
    document.getElementById("main")
);
