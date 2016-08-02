/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
(function() {
    "use strict";
    angular.module('corpdash')
        .run(run);

    run.$inject = ['$state', '$rootScope'];
    /* @ngInject */
    function run($state, $rootScope) {
        $state.go('geoview');
        $rootScope.geoSet = true;
        $rootScope.socket = io.connect(location.protocol + "//" + location.host);
        $rootScope.socket.emit('poll-client-issues');
        var backup;
        $rootScope.socket.on('poll-server', function(data) {
            if (data.issues && data.changes) {
                var dataC = data.changes;
                var arr = dataC.map(function(issue) {
                    var strArr = issue.description.split(" ");
                    var sub = [strArr[0], strArr[1], strArr[2]].join(" ");
                    issue.description = sub.toUpperCase();
                    return issue;
                });
                backup = angular.copy($rootScope.issues);
                $rootScope.issues = arr;
            }
        });

        $rootScope.clear = function() {
            $rootScope.issues = angular.copy(backup);
        };
    }


})();