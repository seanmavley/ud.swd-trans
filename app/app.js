angular.module('trans', ['ui.router'])
  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'controllers/home/home.html',
          controller: 'HomeController'
        })

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
    }
  ])
