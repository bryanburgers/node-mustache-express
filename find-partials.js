var mustache = require('mustache');

function findPartials(template) {
	var parsed = mustache.parse(template);
	var partialSet = {};
	parsed.filter(function (i) {
		return i[0] == ">";
	}).map(function (i) {
		return i[1];
	}).forEach(function (i) {
		partialSet[i] = true;
	});

	return Object.keys(partialSet);
}

module.exports = findPartials;
