# The Mustache Express

Mustache Express lets you use Mustache and Express 3 together, including auto-loading partials.

## Usage

    var mustacheExpress = require('mustache-express');
    app.engine('mustache', mustacheExpress(__dirname + '/views', '.mustache'));
    app.set('view engine', 'mustache');
    app.set('views', __dirname + '/views');

## Parameters

The mustacheExpress method takes two parameters: the directory of the partials and the extension of the partials. When a partial is requested by a template, the file will be loaded from `path.resolve(directory, partialName + extension)`.

## Properties

The return function has a `cache` parameter that is an [LRU Cache](https://github.com/isaacs/node-lru-cache).
