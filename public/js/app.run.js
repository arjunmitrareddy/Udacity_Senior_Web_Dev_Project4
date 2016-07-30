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
        function showIssues() {
            serviceConnectorFactory.get('/json/issues.json').then(function(data) {
                data.map(function(issue) {
                    issue.ino = issue.ino.substring(issue.ino.length-5, issue.ino.length).toUpperCase();
                    var strArr = issue.description.split(" ");
                    var sub = [strArr[0], strArr[1], strArr[2]].join(" ");
                    issue.description = sub.toUpperCase();
                    return issue;
                });
                $rootScope.issues = data;
                console.log(data);
            })
        }
        showIssues();
    }

})();