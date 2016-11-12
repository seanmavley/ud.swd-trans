angular.module('trans')
  .factory('TrainService', ['$http', function($http){
    // From Local
    return $http.get('../data/json/caltrain.json');

    // from remote
    // return $http.get('https://khophi.co/caltrain.json');
  }])