/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
(function() {
    "use strict";
    angular.module('corpdash')
        .config(config);

    config.$inject = ['$stateProvider', '$locationProvider'];
    /* @ngInject */
    function config($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state('geoview', {
                url: '/geo',
                controller: 'geoController',
                controllerAs: 'gCtrl',
                templateUrl: '/templates/geo-map.html'
            })
            .state('metrics', {
                url: '/metrics',
                controller: 'metricsController',
                controllerAs: 'mCtrl',
                templateUrl: '/templates/metrics.html'
            })
            .state('issues', {
                url: '/issues',
                controller: 'issuesController',
                controllerAs: 'iCtrl',
                templateUrl: '/templates/issues.html'
            });
    }
})();