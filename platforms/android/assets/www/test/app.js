var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

weatherApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'pages/home.html',
    controller: 'homeController'
  })
  
  .when('/forecast', {
    templateUrl: 'pages/forecast.html',
    controller: 'forecastController'
  })
  
  .when('/forecast/:days', {
    templateUrl: 'pages/forecast.html',
    controller: 'forecastController'
  });
});

weatherApp.service('cityService', function() {
  this.city = 'Ha Noi';
});

weatherApp.directive('weatherReport', function() {
  return {
    restrict: 'E',
    templateUrl: 'directives/weatherReport.html',
    replace: true,
    controller: 'forecastController',
    scope: {
      weatherDay: '=',
      convertToDate: '&',
      dateFormat: '@'
    }
  };
});

weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {
  $scope.city = cityService.city;
  
  $scope.$watch('city', function() {
    cityService.city = $scope.city;
  });
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {
  $scope.city = cityService.city;
  $scope.days = $routeParams.days || 2;
  
  $scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily', { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" } })
  
  $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days, lang: 'vi', units: 'metric', APPID: '421612f4c4fd7e87a2399806a781659c' });
  
  $scope.convertToDate = function(dt) {
    return new Date(dt * 1000);
  }
}]);