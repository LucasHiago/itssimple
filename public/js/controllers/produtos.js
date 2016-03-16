/**
 * Home controller
 */

'use strict';

define(['app', 'jquery', 'bootstrap', 'controllers/windows', 'snap'], function (app) {
    app.controller('produtos', function ($rootScope, $scope, $http, ngProgressFactory) {
        $rootScope.inprocess = false;
        $rootScope.priceFilter = {
            range: {min: 0, max: 100},
            minPrice: 0,
            maxPrice: 100
        };
        
        $rootScope.listproducts = {};
        $scope.historicfilter = "";
        $scope.changePriceBool = false;
        $scope.progressbar = ngProgressFactory.createInstance();
        $rootScope.list = [];
        
        $scope.$watch('f', function(newValue, oldValue){
            $scope.autocompleteSearch();
        });
        
        setInterval(function(){ 
            if($scope.changePriceBool){ 
                $scope.changePriceBool = false; 
                $scope.filterProdutos($scope.historicfilter, 0, $scope.priceFilter.minPrice, $scope.priceFilter.maxPrice); 
            }
        }, 3000);
        
        $scope.changeprice = function(){
            $scope.changePriceBool = true;
        };
             
        $scope.autocompleteSearch = function(){
            if($scope.f != undefined && $scope.f != ""){
                $http({
                    method: "GET",
                    url: "get-produtos-auto-complete/"+$scope.f,
                }).then(function(res){                    
                    if(res.data.error)
                        $rootScope.error = res.data.error;
                    else
                        $scope.autocomplete = res.data;
                }, function(res){
                    $rootScope.error = "Fails when trying to get data from the server Please try again or contact support.";
                });
            }
        };
        
        $scope.filterProdutos = function(filter, page, min, max){
            $scope.noresults = false;
            
            if(filter == null)
                filter = $rootScope.historicfilter;
            else
                $rootScope.historicfilter = filter;
            
            if(!$rootScope.inprocess && typeof filter === "string"){                
                if(page == null || page == undefined || page == 0)
                    page = 1

                $rootScope.currentpage = page;
                $rootScope.noresults = false;

                if(filter != "" && filter != undefined && filter != null){
                    $rootScope.inprocess = true;
                    var url = "get-produtos/"+filter;
                    
                    if(typeof page == "number")
                        url += "/"+page

                    if(typeof min == "number" && typeof max == "number")
                        url += "/"+min+"/"+max;

                    //$rootScope.results = {};
                    $scope.progressbar.start();

                    $http({
                        method: "GET",
                        url: url,
                    }).then(function(res){    
                        $rootScope.inprocess = false;
                        $scope.progressbar.complete();

                        if(res.data.error)
                            $rootScope.error = res.data.error;
                        else
                            $rootScope.results = res.data;

                        if(res.data.total == 0)
                            $scope.noresults = true;
                    }, function(res){
                        $rootScope.error = "Fails when trying to get data from the server Please try again or contact support.";
                    });
                }
                else{
                    $rootScope.inprocess = false;
                    $rootScope.error = "Por favor informe um consulta válida";
                }
            }
            
        };
        
        //menu();
    });
    
    app.directive('browseContent', function($window) {
        return {
            restrict: 'E',
            link: function(scope) {

                $window.onresize = function() {
                    changeTemplate();
                    scope.$apply();
                };
                
                changeTemplate();

                function changeTemplate() {
                    var screenWidth = $window.innerWidth;
                    if (screenWidth < 992) 
                        scope.mobile = true
                    else 
                        scope.mobile = false
                }
            }
        }
    });
    
    function menu(){
    var bodyEl = document.body,
        content = document.querySelector( '.content-wrap' ),
        openbtn = document.getElementById( 'open-button' ),
        closebtn = document.getElementById( 'close-button' ),
        isOpen = false,

    morphEl = document.getElementById( 'morph-shape' ),
        s = Snap( morphEl.querySelector( 'svg' ) );
        var path = s.select( 'path' );
        var initialPath = path.attr('d');
        var pathOpen = morphEl.getAttribute( 'data-morph-open' ),
        isAnimating = false;

        function init() {
                initEvents();
        }

        function initEvents() {
            openbtn.addEventListener( 'click', toggleMenu );
            if( closebtn ) {
                    closebtn.addEventListener( 'click', toggleMenu );
            }

            // close the menu element if the target it´s not the menu element or one of its descendants..
            content.addEventListener( 'click', function(ev) {
                    var target = ev.target;
                    if( isOpen && target !== openbtn ) {
                            toggleMenu();
                    }
            } );
        }

        function toggleMenu() {
            if( isAnimating ) return false;
            isAnimating = true;
            if( isOpen ) {
                    $(bodyEl).removeClass("show-menu");

                    // animate path
                    setTimeout( function() {
                            // reset path
                            path.attr( 'd', initialPath );
                            isAnimating = false; 
                    }, 300 );
            }
            else {
                $(bodyEl).addClass("show-menu");
                    // animate path
                    path.animate( { 'path' : pathOpen }, 400, mina.easeinout, function() { isAnimating = false; } );
            }
            isOpen = !isOpen;
        }

        init();
    }
});