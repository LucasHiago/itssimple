/**
 * Integration file to Gulp
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @license MIT
 */

'use strict';

var argv = require('optimist').argv,
    gulp = require("gulp"),
    nodemon = require("gulp-nodemon"),
    browserSync = require("browser-sync");
    
var portApp = (typeof argv.port == "number") ? argv.port : 9001;
var portBrowserSync = (typeof argv.portsync == "number") ? argv.port : 9002;
    
gulp.task("default", ["browser-sync", "nodemon"], function(){});

gulp.task("browser-sync", function(){
    browserSync({
        open: false,
        proxy: "http://localhost:"+portApp,
        files: ["public/**/*.*"],
        port: portBrowserSync,
        ghostMode: true 
    });
});

gulp.task("nodemon", function(){
    nodemon({
        script: 'app.js',
        ignore: ["public/*"],
        env: { 'NODE_ENV': 'development' },
        args: ["--port="+portApp],
        exec: "node --harmony --expose-gc"
    }).on("start");
});