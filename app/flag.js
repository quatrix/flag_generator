import React from "react";
import Utils from "./utils"

var ROTATE_OPTIONS = [0, 90, 180, 270];

var TriangleTypes = [
	{ 
		"name": "palastine",
		"points": [
			[0, 0],
			[14.7, 16.5],
			[0, 33],
		],
		"offset_inner_x": -3,
		"offset_inner_y": 0,
		on_draw: function(path, flag) {
			var rotate_angle = Utils.random_choice(ROTATE_OPTIONS);

			path.rotate(rotate_angle);

			if (rotate_angle == 90 || rotate_angle == 270) {
				path.position.x = flag.props.width / 2;
				
				if (rotate_angle == 90) {		
					path.position.y = path.position.y + 70;
				}
			} else {
				path.position.x = Utils.random_choice(flag.triangle_positions(path.position.x));
			}
		},
	},
	{
		"name": "israel",
		"points": [
			[6.1, 9.4],
			[12.25, 19.9],
			[0, 19.9],
		],
		"offset_inner_x": 0,
		"offset_inner_y": 4,
		on_draw: function(path, flag) {
			var rotate_angle = Utils.random_choice(ROTATE_OPTIONS);

			path.position.x = Utils.random_choice(flag.triangle_positions(path.position.x));

			path.rotate(rotate_angle);
		
			if (rotate_angle == 180) {
				path.position.y = path.position.y + 50;
			}
		},
	}
]


var Flag = React.createClass({
	componentDidMount: function() {
		this.paper = paper.setup(this.refs.flag);
	},

	draw_line: function(y, height, color) {
		var line = new this.paper.Path.Rectangle(0, y, this.props.width, height);
		line.fillColor = color;
		line.sendToBack();
	},

	get_random_line_height: function() {
		return Utils.random_choice(this.line_heights);
	},

	flag_can_be_filled: function(remaning_space) {
		return Utils.countcoins(remaning_space, this.line_heights) != 0;
	},

	triangle_positions: function(x) {
		if (!this.should_apply_mode_two()) {
			return [
				x,
				this.props.width / 2,
				this.props.width - x,
			];
		}

		return [
			x,
			this.props.width / 4,
			this.props.width / 2,
			this.props.width * 0.75,
			this.props.width - x,
		];
	},

	should_apply_mode_two: function() {
		if (this.props.mode_two_probability == 0) {
			return false;
		}

		return Utils.random_range(1, this.props.mode_two_probability) == 1;
	},

	get_line_color: function(prev_color) {
		if (this.should_apply_mode_two()) {
			return Utils.random_choice(this.colors);
		} 

		var colors = this.possible_colors.slice();

		if (prev_color != null) {
			colors.splice(colors.indexOf(prev_color), 1)
		}

		if (colors.length == 0) {
			return Utils.random_choice(this.colors);
		} 

		return Utils.random_choice(colors);
	},

	draw_lines: function() {
		var remaning_space = this.props.height;
		var next_line_pos = 0;
		var prev_color = null;

		while (remaning_space > 0) {
			var line_height = this.get_random_line_height()

			if (!this.flag_can_be_filled(remaning_space - line_height)) {
				continue;	
			}

			var color = this.get_line_color(prev_color);
			prev_color = color;

			this.draw_line(next_line_pos, line_height, color);
			next_line_pos += line_height;
			remaning_space -= line_height;
		}
	},

	draw_triangle: function() {
		var path = new this.paper.Path();
		var type = Utils.random_choice(TriangleTypes);

		for (var i = 0; i < 3; i++) {

			path.add(new this.paper.Point(
				(type.points[i][0] * this.props.scale),
				(type.points[i][1] * this.props.scale)
			));
		}

		path.closed = true;

		var color;

		if (!this.should_apply_mode_two()) {
			if (this.possible_colors.length > 0) {
				color = Utils.random_choice(this.possible_colors);
				var index = this.possible_colors.indexOf(color);
				this.possible_colors.splice(index, 1);
			} else {
				color = Utils.random_choice(this.colors);
			}

		} else {
			color = Utils.random_choice(this.colors);
		}

		path.fillColor = color;

		if (Utils.random_choice([true, false])) {
			var inner_triangle = path.clone();
			inner_triangle.scale(0.85);
			inner_triangle.position.x = inner_triangle.position.x + type.offset_inner_x;
			inner_triangle.position.y = inner_triangle.position.y + type.offset_inner_y;

			var path = new this.paper.CompoundPath({
				children: [
					path,
					inner_triangle,
				],
				fillColor: color
			});

		}

		type.on_draw(path, this);

		if (this.should_apply_mode_two()) {
			path.scale(Utils.random_choice([0.7, 1.3]));
		}
	},

	draw_triangles: function() {
		var possible_triangles = 2;

		if (this.should_apply_mode_two()) {
			possible_triangles = 5;
		}

		var how_many_triangles = Utils.random_range(1, possible_triangles)

		for (var i = 0; i < how_many_triangles; i++) {
			this.draw_triangle();
		}
	},

	back: function() {
		if (this.last_svg == null) {
			return;
		}

		var temp_svg = this.paper.project.exportSVG();

		this.paper.project.clear();
		this.paper.project.importSVG(this.last_svg);

		this.last_svg = temp_svg;

		this.paper.view.draw();
	},

	generate: function() {
		this.last_svg = this.paper.project.exportSVG();

		this.line_heights = [
			this.props.scale * 3,
			this.props.scale * 5, 
			this.props.scale * 11,
			this.props.scale * 17
		];

		this.colors = ["#FFFFFF", "#29489E", "#D0091E", "#017A3D", "000000"];
		this.possible_colors = this.colors.slice();

		this.paper.project.clear();
		this.draw_triangles();
		this.draw_lines();

		this.paper.view.draw();
	},

	exportSVG: function() {
		var url = "data:image/svg+xml;utf8," + encodeURIComponent(
			this.paper.project.exportSVG({asString:true})
		);

		var link = document.createElement("a");
		link.download = "rdpls_" + new Date().toISOString() + ".svg";
		link.href = url;
		link.click();
	},

	render: function() {
		return <canvas
			className="flag"
			height={this.props.height}
			width={this.props.width}
			ref="flag"
		/>;
	},
});

var FlagContainer = React.createClass({
	back: function() {
		this.refs.flag.back();
	},

	generate: function() {
		this.refs.flag.generate();
	},

	exportSVG: function() {
		this.refs.flag.exportSVG();
	},

	render: function() {
		var flag = <Flag
			height={this.props.height}
			width={this.props.width}
	 		scale={this.props.scale}
			mode_two_probability={this.props.mode_two_probability}
			ref="flag"
		 />

		return (
			<div>
				<div>{flag}</div>
				<div>
					<button onClick={this.back}>Last</button>
					<button onClick={this.generate}>Generate</button>
					<button onClick={this.exportSVG}>Export SVG</button>
				</div>
			</div>
		)
	}
});

module.exports = FlagContainer
