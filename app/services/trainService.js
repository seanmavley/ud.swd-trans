angular.module('trans')
  .factory('TrainService', ['$http', function($http){
    return $http.get('../data/json/caltrain.json');
  }])