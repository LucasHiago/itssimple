/**
 * App controller
 */
'use strict';

define(['angularAMD', 'angular-routes', 'angular-ngprogress', 'angular-rangerslider', "angular-dirpagination", "angular-autocomplete", "ui-bootstrap", "angular-animate", "angular-ui-switch"], function (angularAMD) {
    var app = angular.module("itssimple", ["ui-rangeSlider", "ngRoute", "ngProgress", "ui.bootstrap",  "ngAnimate", "angularUtils.directives.dirPagination", "autocomplete", "uiSwitch"]);
    
    app.config(function ($routeProvider) {
        $routeProvider
        .when("", angularAMD.route({templateUrl: 'home.html', controller: 'windows', controllerUrl: 'controllers/produtos'}))
        .when("/", angularAMD.route({templateUrl: 'home.html', controller: 'windows', controllerUrl: 'controllers/produtos'}))
        .when("/home", angularAMD.route({templateUrl: 'home.html', controller: 'windows', controllerUrl: 'controllers/produtos'}))
        .otherwise({redirectTo: "/home"});        
    });
    
    app.filter('yesNo', function() {
        return function(input) {
            return input ? 'Sim' : 'Não';
        };
    });
    
    app.filter('returnBoolean', function() {
        return function(input) {
            return (input);
        };
    });
    
    app.filter('htmlentities', function() { 
        return function(input) {
            return input.replace(/&#x(.*?);/g, function(match, dec) {
                return String.fromCharCode(parseInt(dec.toLowerCase(), 16));
            });
        };
    });
    
    app.filter('returnlink', function() {
        return function(input) {
            if(input.store == 244069079 || input.store == 461377411 || input.store == 1929911150)
                var link = input.link + "?opn=AFLACOM&epar=b2wafiliados&loja=02&chave=AFL-160307-94049&franq=AFL-03-162383"
            else
                var link = input.link;
                        
            return (input.link_zanox) ? input.link_zanox : link;
        }
    });
    
    //window.onerror = function(){ return true; }    
    return angularAMD.bootstrap(app);
});