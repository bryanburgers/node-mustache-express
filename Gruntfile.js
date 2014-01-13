"use strict";

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: ['index.js', 'findPartials.js', 'test/*.js'],
			options: {
				jshintrc: ".jshintrc"
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'jshint');
};
