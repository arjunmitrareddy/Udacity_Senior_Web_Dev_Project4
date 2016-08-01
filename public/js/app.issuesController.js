(function() {
    "use strict";
    angular.module('corpdash')
        .controller('issuesController', issuesController);

    issuesController.$inject = ['$state', '$rootScope', 'serviceConnectorFactory', '$timeout', '$scope', '$window'];

    function issuesController($state, $rootScope, serviceConnectorFactory, $timeout, $scope, $window) {
        var iCtrl = this;
        $timeout(function() {
            $rootScope.socket.emit('poll-client-issues');
        }, 4000);
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        iCtrl.brkpt = (width <= 992);
        angular.element($window).bind('resize', function() {
            var w = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            iCtrl.brkpt = (w <= 992);
            console.log(iCtrl.brkpt);
            $scope.$apply();
        });

        function adjustView() {
            var $viewField = $('#viewField');
            $viewField.hasClass('container') ? $viewField.removeClass('container') : (($viewField).hasClass('container-fluid') ? '' : $viewField.addClass('container-fluid'));
            $('.navstate').each(function(index, a) {
                if (a.innerHTML == 'Issues') {
                    $(a).parent().addClass('active');
                }
                else {
                    $(a).parent().removeClass('active');
                }
            });
        }
        adjustView();
        $rootScope.socket.on('poll-server', function(data) {
            if (data.issues && $state.current.name == 'issues') {
                serviceConnectorFactory.get('/json/issues.json').then(function (data) {
                    var arr = data.map(function(issue) {
                        var strArr = issue.description.split(" ");
                        var sub = [strArr[0], strArr[1], strArr[2]].join(" ");
                        issue.description = sub.toUpperCase();
                        return issue;
                    });
                    iCtrl.backup = angular.copy(arr);
                    if (iCtrl.sortSet && !iCtrl.filterSet) {
                        $rootScope.issues = iCtrl.sort(iCtrl.sortSet, arr, false)
                    }
                    else if (!iCtrl.sortSet && iCtrl.filterSet) {
                        $rootScope.issues = iCtrl.filter(iCtrl.filterSet, arr)
                    }
                    else if (iCtrl.sortSet && iCtrl.filterSet) {
                        $rootScope.issues = iCtrl.sort(iCtrl.sortSet, iCtrl.filter(iCtrl.filterSet, arr), false);
                    }
                    else {
                        $rootScope.setIssues(arr);
                    }
                });
            }
        });
        iCtrl.a = false;
        iCtrl.b = false;
        iCtrl.c = false;
        iCtrl.d = false;
        iCtrl.e = false;
        iCtrl.f = false;
        iCtrl.g = false;
        iCtrl.filter = function(filter, issues) {
            switch (filter) {
                case "a":
                    iCtrl.filterSet = "a";
                    $rootScope.issues = _.filter(issues, function(issue) {return issue.status == false});
                    return $rootScope.issues;
                case "b":
                    iCtrl.filterSet = "b";
                    $rootScope.issues = _.filter(issues, function(issue) {return issue.status == true});
                    return $rootScope.issues;
                case "c":
                    iCtrl.filterSet = "c";
                    $rootScope.issues = _.filter(issues, function(issue) {
                        var yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).getTime();
                        return issue.stimestamp > (yesterday);
                    });
                    return $rootScope.issues;
            }
        };
        iCtrl.sort = function(sort, issues, toggler) {
            switch (sort) {
                case "a":
                    iCtrl.a = !iCtrl.a;
                    iCtrl.sortSet = "a";
                    $rootScope.issues = (iCtrl.a) ? _.sortBy(issues, function(issue) {return issue.stimestamp})
                        : _.sortBy($rootScope.issues, function(issue) {return issue.stimestamp}).reverse();
                    return $rootScope.issues;
                case "b":
                    if (toggler)
                    iCtrl.b = !iCtrl.b;
                    iCtrl.sortSet = "b";
                    $rootScope.issues = (iCtrl.b) ? _.sortBy(issues, function(issue) {return issue.customername})
                        : _.sortBy($rootScope.issues, function(issue) {return issue.customername}).reverse();
                    return $rootScope.issues;
                case "c":
                    if (toggler)
                    iCtrl.c = !iCtrl.c;
                    iCtrl.sortSet = "c";
                    $rootScope.issues = (iCtrl.c) ? _.sortBy(issues, function(issue) {return issue.customeremail})
                        : _.sortBy($rootScope.issues, function(issue) {return issue.customeremail}).reverse();
                    return $rootScope.issues;
                case "d":
                    if (toggler)
                    iCtrl.d = !iCtrl.d;
                    iCtrl.sortSet = "d";
                    $rootScope.issues = (iCtrl.d) ? _.sortBy(issues, function(issue) {return issue.description})
                        : _.sortBy($rootScope.issues, function(issue) {return issue.description}).reverse();
                    return $rootScope.issues;
                case "e":
                    if (toggler)
                    iCtrl.e = !iCtrl.e;
                    iCtrl.sortSet = "e";
                    $rootScope.issues = (iCtrl.e) ? _.sortBy(issues, function(issue) {return issue.status})
                        : _.sortBy($rootScope.issues, function(issue) {return issue.status}).reverse();
                    return $rootScope.issues;
                case "f":
                    if (toggler)
                    iCtrl.f = !iCtrl.f;
                    iCtrl.sortSet = "f";
                    $rootScope.issues = (iCtrl.f) ? _.sortBy(issues, function(issue) {return issue.closedtimestamp})
                        : _.sortBy($rootScope.issues, function(issue) {return issue.closedtimestamp}).reverse();
                    return $rootScope.issues;
                case "g":
                    if (toggler)
                    iCtrl.g = !iCtrl.g;
                    iCtrl.sortSet = "g";
                    $rootScope.issues = (iCtrl.g) ? _.sortBy(issues, function(issue) {return issue.employeename})
                        : _.sortBy($rootScope.issues, function(issue) {return issue.employeename}).reverse();
                    return $rootScope.issues;

            }
        };
        iCtrl.clearFilter = function() {
            iCtrl.sortSet = null;
            iCtrl.a = false;
            iCtrl.b = false;
            iCtrl.c = false;
            iCtrl.d = false;
            iCtrl.e = false;
            iCtrl.f = false;
            iCtrl.g = false;
            $rootScope.issues = angular.copy(iCtrl.backup);
        };
        iCtrl.clearF = function() {
            iCtrl.filterSet = null;
            $rootScope.issues = angular.copy(iCtrl.backup);
        }
    }
})();