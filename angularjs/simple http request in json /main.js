var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $http) {
    $http.get("customers.json").success(function(response) {
        for (obj in response.records) {
            //console.log(obj, response.records[obj]["City"]);
        }
        $scope.names = response.records;
    });
});