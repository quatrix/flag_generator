paper.install(window);

var R = 15;

var FLAG_WIDTH = R * 44;
var FLAG_HEIGHT = R * 33;
var LINE_WIDTH = 1.1 * R;
var LINE_HEIGHTS = [R * 3, R * 5, R * 11, R * 17];
var COLORS = ["#FFFFFF", "#29489E", "#D0091E", "#017A3D", "000000"];

var possible_colors;

var ROTATE_OPTIONS = [0, 90, 180, 270];

var last_svg = null;

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
				var pos_options = [
					path.position.x, 
					FLAG_WIDTH / 2,
					FLAG_WIDTH - path.position.x
				];

				path.position.x = random_choice(pos_options);
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

			var pos_options = [
				path.position.x, 
				FLAG_WIDTH / 2,
				FLAG_WIDTH - path.position.x
			];

			path.position.x = random_choice(pos_options);


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
    var triangle = new Path();
	var type = random_choice(TRIANGLE_TYPES);

	for (var i = 0; i < 3; i++) {
		triangle.add(new Point(type.points[i][0], type.points[i][1]));
	}

	triangle.closed = true;

	var color = random_choice(possible_colors);
	var index = possible_colors.indexOf(color);
	console.log("BEFORE", possible_colors);
	possible_colors.splice(index, 1);
	console.log("AFTER", possible_colors);

	triangle.fillColor = color;

	if (random_choice([true, false])) {
		var inner_triangle = triangle.clone();
		inner_triangle.scale(0.85);
		inner_triangle.position.x = inner_triangle.position.x + type.offset_inner_x;
		inner_triangle.position.y = inner_triangle.position.y + type.offset_inner_y;

		var path = new CompoundPath({
			children: [
				triangle,
				inner_triangle,
			],
			fillColor: color
		});

		type.on_draw(path);
	} else { 
		type.on_draw(triangle);
	}
}

function draw_lines() {
	var remaning_space = FLAG_HEIGHT;
	var next_line_pos = 0;
	var prev_color = null;

	while (remaning_space > 0) {
		var line_height = random_choice(LINE_HEIGHTS);

		if (!flag_can_be_filled(remaning_space - line_height)) {
			console.log("nope!");
			continue;	
		}

		var color;
		
		while (true) {
			color = random_choice(possible_colors);

			if (color != prev_color) {
				prev_color = color;
				break;
			}
		}

		draw_line(next_line_pos, line_height, color);
		next_line_pos += line_height;
		remaning_space -= line_height;
	}
}

function draw_triangles() {
	var how_many_triangles = random_choice([1, 2]);

	for (var i = 0; i < how_many_triangles; i++) {
		draw_triangle();
	}
}

function create_flag() {
	var flag = $("<canvas id='flag'>");

	flag.height(FLAG_HEIGHT);
	flag.width(FLAG_WIDTH);
	flag.css("background-color", "gray");


	return flag;
}

function generate_flag() { 
	possible_colors = COLORS.slice();

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

