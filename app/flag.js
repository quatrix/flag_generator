import React from "react";

var Flag = React.createClass({
  render: function() {
    return <canvas
		 className="flag"
		 height={this.props.height}
		 width={this.props.width}
	/>;

  },
});

module.exports = Flag
