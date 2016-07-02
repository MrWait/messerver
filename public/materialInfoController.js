/**
 * Created by ShiQi on 2016/6/15.
 */
var app = angular.module('myApp', []);
app.controller('MaterialInfoController',function($scope,$rootScope,$http){
    $scope.submitForm=function(){
        var url = "";
        var credentials = btoa($scope.mid + ':' + $scope.number);
        var authorization = {'Authorization': 'Basic ' + credentials};
        var headers = {headers: authorization};
        var res = $http.post(url, null, headers);
        res.success(function (data, status, header, config) {
            $rootScope.materialSession = {
                mid:data.id,
                number:data.number,
            }
            $rootScope.$emit("GetMaterialInformations", {});
        });
        res.error(function (data, status, header, config) {

        });
    };

});