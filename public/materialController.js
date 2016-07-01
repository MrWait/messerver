/**
 * Created by ShiQi on 2016/6/15.
 */
var app = angular.module("myApp", []);
 app.controller('MaterialController', function ($scope,$rootScope,$http) {
 //  $rootScope.$on("GetMaterialInformations", function () {
         var url = "http://192.168.199.10:3000/api/v1/mes/getallmeterial";
         var res = $http.get(url);
         res.success(function (data, status, header, config) {
             $scope.material = data;
         });
         res.error(function (data, status, header, config) {
         });
 //});
 });
