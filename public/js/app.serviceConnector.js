(function () {
    'use strict';

    angular.module('corpdash')
        .factory('serviceConnectorFactory', serviceConnectorFactory);
    /* @ngInject */
    serviceConnectorFactory.$inject = [
        '$http'
    ];
    /* @ngInject */
    function serviceConnectorFactory($http) {
        return {
            get: getHandler,
            post: postHandler
        };
        function getHandler(url, config) {
            return $http.get(url, config)
                .then(function(response) { return response.data})
                .catch(function(err) {
                    throw err;
                });
        }
        function postHandler(url, payload) {
            return $http.post(url, payload)
                .then(function(response) { return response.data})
                .catch(function (err) {
                    throw err;
                });
        }
    }
})();