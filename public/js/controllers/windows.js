/**
 * Home controller
 */

'use strict';

define(['app', 'jquery', 'bootstrap'], function (app) {        
    app.controller('windows', function ($rootScope, $scope, $http, $uibModal, ngProgressFactory) {        
        $rootScope.addDialog = function(urlTemplate, urlSave){
            $rootScope.data = {};
            
            $uibModal.open({
                animation: true,
                templateUrl: urlTemplate,
                controller: 'modal',
                size: "lg",
                resolve: {
                    urlSave: function(){ return urlSave; },
                    data: function () { return {}; }
                }
            });
        };
        
        $rootScope.editDialog = function(urlTemplate, urlData, urlSave){
            $http({
                method: "GET",
                url: urlData,
            }).then(function(res){    
                $rootScope.data = res.data;
                
                $uibModal.open({
                    animation: true,
                    templateUrl: urlTemplate,
                    controller: 'modal',
                    size: "lg",
                    resolve: {
                        urlSave: function(){ return urlSave; },
                        data: function () { return $rootScope.data; }
                    }
                });
            }, function(res){
                $rootScope.error = "Fails when trying to get data from the server Please try again or contact support.";
            });
        };
        
        $rootScope.loadData = function(url, namespace, list){
            $rootScope.urldata = url;
            
            $http({
                method: "GET",
                url: url,
            }).then(function(res){                
                if(res.data.error){
                    $rootScope.error = res.data.error;
                }
                else{
                    if(namespace == undefined || namespace == "" || namespace == null)
                        $rootScope.results = res.data;
                    else if(list != undefined && list != "" && list != null)
                        $rootScope[list][namespace] = res.data;
                    else
                        $rootScope[namespace] = res.data;
                }
            }, function(res){
                $rootScope.error = "Fails when trying to get data from the server Please try again or contact support.";
            });
        };
        
        $rootScope.changeActive = function(url, id, field, status){
            if(status === undefined)
                status = false;
            
            $http({
                method: "POST",
                url: url,
                data: {id: id, field: field, status: status}
            }).then(function(res){                
                if(res.data.error)
                    $rootScope.error = res.data.error;
            }, function(res){
                $rootScope.error = "Fails when trying to get data from the server Please try again or contact support.";
            });
        };
        
        $rootScope.getintodatabase = function(collection, filters, page){
            $scope.showdatabasecollection = collection;
            $scope.showdatabasefilters = filters;
            $scope.page = page;

            $http({
                method: "POST",
                url: "get-to-database",
                data: {collection: collection, filters: filters, page: page}
            }).then(function(res){                
                if(res.data.error)
                    $scope.error = res.data.error;
                else
                    $scope.getdatabase = res.data;

                $scope.pagination.total = res.data.total;
            }, function(res){
                $scope.error = "Fails when trying to get data from the server Please try again or contact support.";
            });
        }
        
        $rootScope.pageChanged = function(newPage) {
            $rootScope.getintodatabase($scope.showdatabasecollection, $scope.showdatabasefilters, newPage);
        };
    });
    
    app.controller('modal', function ($rootScope, $http, $uibModalInstance, urlSave, data) {
        $rootScope.data = data;
        
        $rootScope.ok = function () {
            $http({
                method: "POST",
                url: urlSave,
                data: $rootScope.data
            }).then(function(res){  
                $rootScope.loadData($rootScope.urldata);
                $rootScope.data = {}
                $uibModalInstance.close($rootScope.data);
            }, function(res){
                $rootScope.error = "Fails when trying to get data from the server Please try again or contact support.";
            });
        };

        $rootScope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
});