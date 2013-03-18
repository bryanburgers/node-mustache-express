var fs = require('fs');
var mustacheExpress = require('../mustache-express.js');
var should = require('should');

describe('mustacheExpress', function() {
	it('should render a normal template', function(done) {
		var renderer = mustacheExpress('test/test01', '.mustache');
		renderer('test/test01/index.mustache',
		{
			value: "World"
		}, function(err, result) {
			should.not.exist(err);
			should.exist(result);
			result.should.eql("World");

			done();
		});
	});

	it('should render a template with a partial', function(done) {
		var renderer = mustacheExpress('test/test02', '.mustache');
		renderer('test/test02/index.mustache',
		{
			name: "World"
		}, function(err, result) {
			should.not.exist(err);
			should.exist(result);
			result.should.eql("Hey, World");

			done();
		});
	});

	it('should render a template with a partial, where the partial has templatable stuff', function(done) {
		var renderer = mustacheExpress('test/test03', '.mustache');
		renderer('test/test03/index.mustache',
		{
			salutation: "Hey",
			name: "World"
		}, function(err, result) {
			should.not.exist(err);
			should.exist(result);
			result.should.eql("Hey, World");

			done();
		});
	});

	it('should render a template that includes the same partial twice', function(done) {
		var renderer = mustacheExpress('test/test04', '.mustache');
		renderer('test/test04/index.mustache',
		{
			salutation: "Hey",
			name: "World"
		}, function(err, result) {
			should.not.exist(err);
			should.exist(result);
			result.should.eql("Hey, World, Hey");

			done();
		});
	});

	it('should render a template that includes two partials', function(done) {
		var renderer = mustacheExpress('test/test05', '.mustache');
		renderer('test/test05/index.mustache',
		{
			salutation: "Hey",
			name: "World"
		}, function(err, result) {
			should.not.exist(err);
			should.exist(result);
			result.should.eql("Hey, World, Hello");

			done();
		});
	});

	it('should render a template that has a partial that includes another partial', function(done) {
		var renderer = mustacheExpress('test/test06', '.mustache');
		renderer('test/test06/index.mustache',
		{
			salutation: "Hey",
			name: "World"
		}, function(err, result) {
			should.not.exist(err);
			should.exist(result);
			result.should.eql("Hey, World");

			done();
		});
	});

	it('should cache the partials that it loads', function(done) {
		var renderer = mustacheExpress('test/test07', '.mustache');

		fs.writeFileSync('test/test07/p1.mustache', 'Version 1', 'utf-8');

		renderer('test/test07/index.mustache', {}, function(err, result) {
			should.not.exist(err);
			should.exist(result);

			fs.writeFileSync('test/test07/p1.mustache', 'Version 2', 'utf-8');

			renderer('test/test07/index.mustache', {}, function(err, result) {
				should.not.exist(err);
				should.exist(result);

				result.should.eql("Version 1");
				done();
			});
		});
	});

	it('should allow access to the partial cache', function(done) {
		var renderer = mustacheExpress('test/test07', '.mustache');
		renderer.should.have.property('cache');

		fs.writeFileSync('test/test07/p1.mustache', 'Version 1', 'utf-8');

		renderer('test/test07/index.mustache', {}, function(err, result) {
			should.not.exist(err);
			should.exist(result);

			// Clear the partial cache!
			renderer.cache.reset();

			fs.writeFileSync('test/test07/p1.mustache', 'Version 2', 'utf-8');

			renderer('test/test07/index.mustache', {}, function(err, result) {
				should.not.exist(err);
				should.exist(result);

				result.should.eql("Version 2");
				done();
			});
		});
	});

	it('should allow correctly handle a removed cache', function(done) {
		var renderer = mustacheExpress('test/test01', '.mustache');
		renderer.should.have.property('cache');
		delete renderer.cache;

		renderer('test/test01/index.mustache',
		{
			value: "World"
		}, function(err, result) {
			should.not.exist(err);
			should.exist(result);
			result.should.eql("World");

			done();
		});
	});
});