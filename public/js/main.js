'use strict';

require.config({
    baseUrl:"js",
    paths:{
        "text":"plugins/requirejs/text",
        "domReady": "plugins/requirejs/domReady",
        "jquery":"plugins/jquery-2.2.0.min",
        "chosen":"plugins/chosen.jquery",
        "bootstrap": "plugins/bootstrap.min",
        "angular":"plugins/angular/angular.min",
        "angularAMD":"plugins/angular/angularAMD.min",
        "angular-routes": "plugins/angular/angular-route.min",
        "angular-ngprogress":"plugins/angular/angular-ngprogress",
        "angular-rangerslider":"plugins/angular/angular.rangeSlider",
        "angular-dirpagination":"plugins/angular/dirPagination",
        "angular-autocomplete":"plugins/angular/autocomplete",
        "angular-animate": "plugins/angular/angular-animate.min",
        "ng-device-detector.min": "plugins/angular/ng-device-detector.min",
        "ui-bootstrap": "plugins/ui-bootstrap-1.1.2.min", 
        "angular-ui-switch": "plugins/angular/angular-ui-switch.min",
        "snap": "plugins/snap.svg-min"
    },
    shim:{
        "angular":{exports:"angular"},
        "angularAMD": ["angular"],
        "bootstrap": ["jquery"],
        "angular-routes": ["angular"],
        "angular-ngprogress": ["angular"],
        "angular-rangerslider": ["angular"],
        "angular-dirpagination": ["angular"],
        "angular-autocomplete": ["angular"],
        "angular-animate": ["angular"],
        "ui-bootstrap": ["angular"],
        "bootstrap-taginput": ["jquery"],
        "angular-ui-switch": ["angular"],
        "ng-device-detector.min": ["angular"]
    },
    priority:[
        "angular", "angular-rangerslider"
    ],
    deps: ["app"]
});