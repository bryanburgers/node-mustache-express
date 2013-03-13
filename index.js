"use strict";

var async = require('async');
var findPartials = require('./find-partials');
var fs = require('fs');
var mustache = require('mustache');
var path = require('path');

// Load a single file, and return the data.
function loadFile(fullFilePath, callback) {
	fs.readFile(fullFilePath, "utf-8", function(err, data) {
		if (err) {
			return callback(err);
		}

		return callback(null, data);
	});
}

// Load a file, find it's partials, and return the relevant data.
function handleFile(name, file, callback) {
	loadFile(file, function(err, fileData) {
		if (err) {
			return callback(err);
		}

		var partials = findPartials(fileData);
		return callback(null, {
			name: name,
			data: fileData,
			partials: partials
		});
	});
}

// Using the return data from all of the files, consolidate the partials into
// a single list
function consolidatePartials(arr) {
	var partialsSet = {};
	arr.forEach(function(item) {
		item.partials.forEach(function(partial) {
			partialsSet[partial] = true;
		});
	});
	return Object.keys(partialsSet);
}

// Of the partials given, which haven't been loaded yet?
function findUnloadedPartials(partialNames, loadedPartials) {
	return partialNames.filter(function(partialName) {
		return !(partialName in loadedPartials);
	});
}

// Load all of the partials recursively
function loadAllPartials(unparsedPartials, partialsDirectory, partialsExtension, partials, callback) {
	if (!partials) {
		partials = {};
	}

	// This function is called recursively. This is our base case: the point where we
	// don't call recursively anymore.
	// That point is when there are no partials that need to be parsed.
	if (unparsedPartials.length === 0) {
		return callback(null, partials);
	}

	async.map(unparsedPartials, function(partial, next) {
		var fullFilePath = path.resolve(partialsDirectory, partial + partialsExtension);
		return handleFile(partial, fullFilePath, next);
	}, function(err, data) {
		if (err) {
			return callback(err);
		}

		// Add all of the data to the 'partials' object
		data.forEach(function(partialData) {
			partials[partialData.name] = partialData.data;
		});

		// Get all of the partials that are referenced by the data we've loaded
		var consolidatedPartials = consolidatePartials(data);

		// Get all of the partials that we haven't loaded yet.
		var partialsToLoad = findUnloadedPartials(consolidatedPartials, partials);

		// Recursive call.
		return loadAllPartials(partialsToLoad, partialsDirectory, partialsExtension, partials, callback);
	});
}

// Load the root template, and all of the partials that go with it
function loadTemplateAndPartials(templateFile, partialsDirectory, partialsExtension, callback) {
	handleFile(null, templateFile, function(err, partialData) {
		if (err) {
			return callback(err);
		}

		return loadAllPartials(partialData.partials, partialsDirectory, partialsExtension, null, function(err, partials) {
			if (err) {
				return callback(err);
			}

			return callback(null, partialData.data, partials);
		});
	});
}

function render(templatePath, viewDirectory, extension, options, callback) {

	loadTemplateAndPartials(templatePath, viewDirectory, extension, function(err, template, partials) {
		if (err) {
			return callback(err);
		}

		var data = mustache.render(template, options, partials);
		return callback(null, data);
	});
}

// Create a renderer.
// This is the entry point of the module.
function create(directory, extension) {
	return function(templatePath, options, callback) {
		render(templatePath, directory, extension, options, callback);
	};
}

module.exports = create;
