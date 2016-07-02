/**
 * Created by ShiQi on 2016/6/15.
 */
var app = angular.module("myApp", []);
 app.controller('MaterialController', function ($scope,$rootScope,$http) {
     $rootScope.$on("GetMaterialInformations", function () {
         var url = "";
         var res = $http.get(url);
         res.success(function (data, status, header, config) {
             $scope.material = data;
         });
         res.error(function (data, status, header, config) {
         });
     });
 });
// var app = angular.module("myApp", []);
// app.controller("MaterialController", function($scope) {
//     $scope.material = [
//         {"mid":"0001","number":"1000"},
//     ]
// });