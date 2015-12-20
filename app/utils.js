exports.random_choice = function(l) {
	return l[Math.floor(Math.random() * l.length)];
}

exports.random_range = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.countcoins = function(t, o) {
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


