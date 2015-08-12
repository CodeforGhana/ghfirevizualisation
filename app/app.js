(function () {
    'use strict';

    angular.module('fireApp', [
        'ngResource',
        'ui.router',
        'googlechart',
        'fireApp.controllers', 'fireApp.services'
    ]).config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }
    ]);
})();