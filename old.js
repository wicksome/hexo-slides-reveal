'use strict'
const _ = require('lodash');
var pathFn = require('path');
// var config = require('config');
const util = require('util');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
const fs = require('hexo-fs');
var pagination = require('hexo-pagination');

function generateFile(path) {
    // Skip if the file is generating
    if (generatingFiles[path]) return Promise.resolve();

    // Lock the file
    generatingFiles[path] = true;

    var dest = join(publicDir, path);

    return fs.exists(dest).then(function(exist) {
        if (force || !exist) return writeFile(path, true);
        if (route.isModified(path)) return writeFile(path);
    }).finally(function() {
        // Unlock the file
        generatingFiles[path] = false;
    });
}

function firstGernerate1() {
    var slideDir = pathFn.join(hexo.config.source_dir, '_slides');
    var route = hexo.route;
    var Cache = hexo.model('Cache');

    // Check the slides folder
    return fs.stat(slideDir).then(function(stats) {
        if (!stats.isDirectory()) {
            throw new Error('%s is not a directory', chalk.magenta(tildify(slideDir)));
        }
    }).catch(function() {
        // Create slides folder if not exists
        if (err.cause && err.cause.code === 'ENOENT') {
            return fs.mkdirs(slideDir);
        }

        throw err;
    }).then(function() {
        var routeList = route.list();
        // console.log(routeList)
        var slideFiles = Cache.filter(function(item) {
            return item._id.substring(0, 7) === 'slides/';
        }).map(function(item) {
            return item._id.substring(7);
        });

        console.log(slideFiles);

        return Promise.all([
            // Generate files
            Promise.map(routeList, generateFile),
            // Clean files
            Promise.filter(slideFiles, function(path) {
                return !~routeList.indexOf(path);
            }).map(deleteFile)
        ]);
    }).spread(function(result) {
        var interval = prettyHrtime(process.hrtime(start));
        var count = result.filter(Boolean).length;

        log.info('%d files generated in %s', count, chalk.cyan(interval));
    });
}



hexo.extend.generator.register('slides', function(locals) {
    const slideDir = pathFn.join(hexo.config.source_dir, '_slides');

    function firstGernerate() {
        return fs.stat(slideDir).then(function(stats) {
            if (!stats.isDirectory()) {
                throw new Error('%s is not a directory', chalk.magenta(tildify(slideDir)));
            }
        }).catch(function(err) {
            // Create slides folder if not exists
            if (err.cause && err.cause.code === 'ENOENT') {
                return fs.mkdirs(slideDir);
            }

            throw err;
        });
    }

    firstGernerate().done(function() {
        fs.listDir(slideDir).done(function(list) {
            console.log(list);
        })
    })

    if (!fs.existsSync(pathFn.join(hexo.public_dir, 'tags'))) {
        return;
    }
    var libPath = pathFn.join(pathFn.join(pathFn.join(hexo.base_dir, 'node_modules'), 'hexo-tag-cloud'), 'lib');

    var tagcanvasPubPath = pathFn.join(pathFn.join(hexo.public_dir, 'js'), 'tagcanvas.js');
    var tagcloudPubPath = pathFn.join(pathFn.join(hexo.public_dir, 'js'), 'tagcloud.js');

    fs.copyFile(pathFn.join(libPath, 'tagcanvas.js'), tagcanvasPubPath);


    // });

    return {
        path: 'slides',
        data: 'slide test'
        // layout: ['slides', 'index']
    }
})

hexo.locals.set('slides', function() {
    return [];
});
