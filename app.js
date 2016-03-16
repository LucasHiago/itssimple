/**
 * Main File Application
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @license MIT
 */

'use strict';

var fs = require("fs"),
    argv = require('optimist').argv,
    requireDirectory = require('require-directory'),
    cluster = require("cluster"),//Usage Cluster of Node.js
    uuid = require("uuid"),
    express = require("express"),//Starting Express
    session = require('express-session'),
    MongoDBStore = require("connect-mongodb-session")(session),
    app = express(),//Creating Application
    morgan = require('morgan'),//Managed logs
    http = require("http").Server(app),//Creating HTTP Server
    cookieParser = require("cookie-parser"),//Module for cookie management in Express
    bodyParser = require("body-parser"),//Module for processing HTTP requests in Express
    compression = require("compression"),//Gzip compression module for Express
    async = require("async"),
    io = require("socket.io")(http),
    MongoServer = require("mongodb").MongoClient,
    mongodb = null;
    
/*process.on('uncaughtException', function(err){ 
    console.log(err); 
});*/
    
/*if(cluster.isMaster){
    var cpuCount = require('os').cpus().length;

    for(var i = 0; i < cpuCount; i += 1)
        cluster.fork();
    
    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });
}
else{*/
    var settings = JSON.parse(fs.readFileSync(__dirname + "/settings.json"));
    //app.use(morgan('dev'));//Enabling Express logs
    app.use(compression());//Enabling compression
    app.use(cookieParser("MyApp"));//Cookies Management
    app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));
    app.use(bodyParser.json());
    app.use(express.static("public"));
    
    //Controle de sessão via MongoDB
    var sessionStore = new MongoDBStore(settings.session);
    app.use(session({
        name: "itssimple",
        secret: 'itssimple',
        saveUninitialized: true,
        resave: true,
        genid: function(req){
            return uuid.v4();
        },
        cookie: {
          path: '/',
          domain: '',
          httpOnly: true,
          maxAge: 60 * 60 * 1000
        },
        store: sessionStore
    }));

    async.series([
        function(cb){
            //Conectando serviço MongoDB
            MongoServer.connect(settings.mongodb, function(err, db){
                mongodb = db;

                if(err) console.log("MongoDB: "+err);
                else cb();
            });
        }
    ], function(){
        requireDirectory(module, "scripts/", {
            visit: function(obj){ 
                new obj(__dirname, settings, app, io, mongodb, function(err){
                    console.log(err);
                });
            } 
        });
        
        var port = (typeof argv.port === "number") ? argv.port : settings.port;

        http.listen(port, function(){
            console.log("http://localhost:"+port);
            //console.log("http://localhost:5800 (cluster "+cluster.worker.id+")");
        });
    });
//}