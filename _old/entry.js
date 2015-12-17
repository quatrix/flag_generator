paper.install(window);

var R = 15;

var FLAG_WIDTH = R * 44;
var FLAG_HEIGHT = R * 33;
var LINE_WIDTH = 1.1 * R;
var LINE_HEIGHTS = [R * 3, R * 5, R * 11, R * 17];
var COLORS = ["#FFFFFF", "#29489E", "#D0091E", "#017A3D", "000000"];

var possible_colors;
var mode_two_probability;

var ROTATE_OPTIONS = [0, 90, 180, 270];

var last_svg = null;
var mode_two_changes = 0;

function flag_positions(x) {
	var pos_options;

	if (!should_apply_mode_two()) {
		pos_options = [
			x,
			FLAG_WIDTH / 2,
			FLAG_WIDTH - x,
		];
	} else {
		pos_options = [
			x,
			FLAG_WIDTH / 4,
			FLAG_WIDTH / 2,
			FLAG_WIDTH * 0.75,
			FLAG_WIDTH - x,
		];
	}

	return pos_options;
}

function scale_shape_if_needed(path) {
	if (should_apply_mode_two()) {
		path.scale(random_choice([0.7, 1.3]));
	}
}

var TRIANGLE_TYPES = [
	{ 
		"name": "palastine",
		"points": [
			[0, 0],
			[14.7 * R, 16.5 * R],
			[0, 33 * R],
		],
		"offset_inner_x": -3,
		"offset_inner_y": 0,
		on_draw: function(path) {
			var rotate_angle = random_choice(ROTATE_OPTIONS);

			path.rotate(rotate_angle);

			if (rotate_angle == 90 || rotate_angle == 270) {
				path.position.x = FLAG_WIDTH / 2;
				
				if (rotate_angle == 90) {		
					path.position.y = path.position.y + 70;
				}
			} else {
				path.position.x = random_choice(flag_positions(path.position.x));
			}
		},
	},
	{
		"name": "israel",
		"points": [
			[6.1 * R, 9.4 * R],
			[12.25 * R, 19.9 * R],
			[0, 19.9 * R ],
		],
		"offset_inner_x": 0,
		"offset_inner_y": 4,
		on_draw: function(path) {
			var rotate_angle = random_choice(ROTATE_OPTIONS);

			path.position.x = random_choice(flag_positions(path.position.x));

			path.rotate(rotate_angle);
		
			if (rotate_angle == 180) {
				path.position.y = path.position.y + 50;
			}
		},
	}
]



function random_choice(l) {
	return l[Math.floor(Math.random() * l.length)];
}


function draw_line(y, height, color) {
	var line = new Path.Rectangle(0, y, FLAG_WIDTH, height);
	line.fillColor = color;
	line.sendToBack();
}

function draw_triangle() {
    var path = new Path();
	var type = random_choice(TRIANGLE_TYPES);

	for (var i = 0; i < 3; i++) {
		path.add(new Point(type.points[i][0], type.points[i][1]));
	}

	path.closed = true;

	var color

	if (!should_apply_mode_two()) {
		if (possible_colors.length > 0) {
			color = random_choice(possible_colors);
			var index = possible_colors.indexOf(color);
			possible_colors.splice(index, 1);
		} else {
			color = random_choice(COLORS);
		}

	} else {
		color = random_choice(COLORS);
	}

	path.fillColor = color;

	if (random_choice([true, false])) {
		var inner_triangle = path.clone();
		inner_triangle.scale(0.85);
		inner_triangle.position.x = inner_triangle.position.x + type.offset_inner_x;
		inner_triangle.position.y = inner_triangle.position.y + type.offset_inner_y;

		var path = new CompoundPath({
			children: [
				path,
				inner_triangle,
			],
			fillColor: color
		});

		type.on_draw(path);
	} else { 
		type.on_draw(path);
	}

	scale_shape_if_needed(path);

}



function should_apply_mode_two() {
	if (mode_two_probability == 0) {
		return false;
	}

	var r = random_range(1, mode_two_probability) == 1;

	if (r) {
		console.log('mode two changes: ', ++mode_two_changes);
	}

	return r;
}

function draw_lines() {
	var remaning_space = FLAG_HEIGHT;
	var next_line_pos = 0;
	var prev_color = null;

	var tries = 999;

	while (remaning_space > 0) {
		if (tries-- == 0) {
			console.error('infinite loop detected in outer space')
			return;
		}
		var line_height = random_choice(LINE_HEIGHTS);

		if (!flag_can_be_filled(remaning_space - line_height)) {
			continue;	
		}

		var color;
		
		if (should_apply_mode_two()) {
			color = random_choice(possible_colors);
		} else {
			while (true) {
				if (tries-- == 0) {
					console.error('infinite loop detected in selecting color')
					return;
				}

				if (possible_colors.length == 0 || (possible_colors.length == 1 && possible_colors[0] == prev_color)) {
					color = random_choice(COLORS);
					break;
				} else {
					color = random_choice(possible_colors);

					if (color != prev_color) {
						prev_color = color;
						break;
					}
				}
			}
		}

		draw_line(next_line_pos, line_height, color);
		next_line_pos += line_height;
		remaning_space -= line_height;
	}
}

function draw_triangles() {
	var possible_triangles = 2;

	if (should_apply_mode_two()) {
		possible_triangles = 5;
	}
	var how_many_triangles = random_range(1, possible_triangles)

	for (var i = 0; i < how_many_triangles; i++) {
		draw_triangle();
	}
}

function random_range(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create_flag() {
	var flag = $("<canvas id='flag'>");

	flag.height(FLAG_HEIGHT);
	flag.width(FLAG_WIDTH);
	flag.css("background-color", "gray");

	return flag;
}

function generate_flag(probability) { 
	console.log('generating flag');
	mode_two_probability = probability;
	possible_colors = COLORS.slice();
	mode_two_changes = 0;

	last_svg = paper.project.exportSVG();
	paper.project.clear();

	draw_triangles();
	draw_lines();
	view.draw();
}

function export_svg() {
	var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));

   var link = document.createElement("a");
   link.download = "rdpls_" + new Date().toISOString() + ".svg";
   link.href = url;
   link.click();
}

function back() {
	if (last_svg == null) {
		return;
	}
	var temp_svg = paper.project.exportSVG();

	paper.project.clear();
	paper.project.importSVG(last_svg);

	last_svg = temp_svg;

	view.draw();
}

$(function() {
	var flag_id;
	$("#flag_div").append(create_flag());

	var flag = document.getElementById("flag");
	paper.setup(flag);

	generate_flag();
});

function flag_can_be_filled(remaning_space) {
	return countcoins(remaning_space, LINE_HEIGHTS) != 0;
}


function countcoins(t, o) {
	'use strict';
	var targetsLength = t + 1;
	var operandsLength = o.length;
	t = [1];
 
	for (var a = 0; a < operandsLength; a ++) {
		for (var b = 1; b < targetsLength; b ++) {
 
			// initialise undefined target
			t[b] = t[b] ? t[b] : 0;
 
			// accumulate target + operand ways
			t[b] += (b < o[a]) ? 0 : t[b - o[a]];
		}
	}
 
	return t[targetsLength - 1];
}

