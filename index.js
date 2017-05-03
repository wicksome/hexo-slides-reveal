'use strict'

const _ = require('lodash');
var join = require('path').join;
const util = require('util');
var Promise = require('bluebird');
var log = require('hexo-log')(hexo.env);
var prettyHrtime = require('pretty-hrtime');
const fs = require('hexo-fs');
var pagination = require('hexo-pagination');
var chalk = require('chalk');
var assign = require('object-assign');

hexo.config.slide = assign({
    dir: "slides",
    separator: "^\n---\n$",
    separator_vertical: "^\n--\n$",
    charset: "utf-8"
}, hexo.config.slide);

function copyRevealLib() {
    var libPath = join(hexo.base_dir, 'node_modules', 'hexo-slides-reveal', 'bower_components', 'reveal.js');
    var revealPath = join(hexo.public_dir, 'reveal.js');

    return fs.exists(revealPath).then(function(exist) {
        if (exist) return;

        return fs.copyDir(libPath, revealPath);
    })
}

function createSlideDir() {
    // create slide dir
    const slidesDir = join(hexo.public_dir, hexo.config.slide.dir);
    const slidePath = join(hexo.config.slide.dir, 'index.html');
    const index = join(slidesDir, 'index.html');

    return fs.stat(slidesDir).then(function(stats) {
        if (!stats.isDirectory()) {
            throw new Error('%s is not a directory', chalk.magenta(tildify(slidesDir)));
        }
    }).catch(function(err) {
        // Create slides folder if not exists
        if (err.cause && err.cause.code === 'ENOENT') {
            return fs.mkdirs(slidesDir);
        }

        throw err;
    }).then(function() {
        var markup = '';
        return fs.writeFile(join(hexo.public_dir, slidePath), markup);
    }).then(function() {
        log.info('Generated: %s', chalk.magenta(slidePath));
    })
}

hexo.on('generateBefore', function() {
    // copy lib
    copyRevealLib()
        // .then(createSlideDir)
        .then(function() {
        })
});

hexo.extend.tag.register('reveal', function(args){
  // const htmlTmlSrc = path.join(__dirname, 'render.ejs');
  // const htmlTml = ejs.compile(fs.readFileSync(htmlTmlSrc, 'utf-8'));
  //
  // const width = args[1] || 800;
  // const height = args[2] || 600;
  //
  // return htmlTml({
  //   'src': args[0],
  //   'width': width,
  //   'height': height
  // });
})
