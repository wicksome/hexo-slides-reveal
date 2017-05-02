'use strict'
const _ = require('lodash');
var pathFn = require('path');
// var config = require('config');
const util = require('util');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
const fs = require('hexo-fs');
var pagination = require('hexo-pagination');

hexo.on('generateBefore', function() {
    if (!fs.existsSync(pathFn.join(hexo.public_dir, 'reveal.js'))) {
        return;
    }

    var libPath = pathFn.join(hexo.base_dir, 'node_modules', 'hexo-slides-reveal', 'bower_components', 'reveal.js');
    var revealPath = pathFn.join(hexo.public_dir, 'reveal.js');

    fs.copyDir(libPath, revealPath);
});

hexo.locals.set('slides', function() {
    return [];
});
