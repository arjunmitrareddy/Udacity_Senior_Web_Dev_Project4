/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
(function() {
    "use strict";
    angular.module('corpdash')
        .run(run);

    run.$inject = ['$state', '$rootScope', 'serviceConnectorFactory'];
    /* @ngInject */
    function run($state, $rootScope, serviceConnectorFactory) {
        $state.go('geoview');
        $rootScope.geoSet = true;
        $rootScope.socket = io.connect(location.protocol + "//" + location.host);
    }


})();