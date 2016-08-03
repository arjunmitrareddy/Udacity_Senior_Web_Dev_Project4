/**
 * Created by arjunMitraReddy on 7/28/2016.
 */

(function() {
    "use strict";
    angular.module('corpdash')
        .controller('metricsController', metricsController);

    metricsController.$inject = ['$q', '$state', '$rootScope', '$scope', '$timeout'];

    function metricsController($q, $state, $rootScope, $scope, $timeout) {
        $rootScope.clear();
        var mCtrl = this;
        $rootScope.socket.emit('poll-client-metrics');
        mCtrl.switchToIssues = function() {
            $state.go('issues');
        };
        var chart1;
        var chart2;
        function adjustView() {
            var defer = $q.defer();
            var $viewField = $('#viewField');
            $viewField.hasClass('container') ? $viewField.removeClass('container') : (($viewField).hasClass('container-fluid') ? '' : $viewField.addClass('container-fluid'));
            $('.navstate').each(function(index, a) {
                if (a.innerHTML == 'Metrics') {
                    $(a).parent().addClass('active');
                }
                else {
                    $(a).parent().removeClass('active');
                }
            });
            defer.resolve();
            return defer.promise;
        }

        adjustView();
        var backup;
        function lineChart(data) {
                mCtrl.lineChartData = data;
                backup = data;

                    mCtrl.lineChart = {
                        options: {
                            chart: {
                                renderTo: 'lineGraph'
                            },
                            title: {
                                text: 'Paying Customers Over the Years (Live)'
                            },
                            xAxis: {
                                categories: mCtrl.lineChartData ? mCtrl.lineChartData.years : []
                            },
                            yAxis: {
                                title: {
                                    text: 'Customers (In Thousands)'
                                }
                            },
                            series: [{
                                name: 'Customers',
                                data: (mCtrl.lineChartData) ? mCtrl.lineChartData.customers.slice(0, mCtrl.lineChartData.years.length) : []
                            }],

                            credits: {
                                enabled: false
                            }
                        }
                    };


            $scope.$apply();
        }

        function barChart(data) {
                mCtrl.barChartData = data;
                if (mCtrl.barChartData) {
                    mCtrl.barChartData.issues = mCtrl.barChartData.issues.map(function(issue) {
                        var arr = issue.data.slice(0, mCtrl.barChartData.years.length);
                        var obj = {
                            name: issue.name,
                            data: arr
                        };
                        return obj;
                    })
                }

                    mCtrl.barChart = {
                        options: {
                            chart: {
                                renderTo: 'barGraphBox',
                                type: 'column'
                            },
                            title: {
                                text: 'Reported Issues Status (Live)'
                            },
                            xAxis: {
                                categories: mCtrl.barChartData ? mCtrl.barChartData.years : []
                            },
                            yAxis: {
                                title: {
                                    text: 'Issues Reported (In Hundreds)'
                                }
                            },
                            series: mCtrl.barChartData ? mCtrl.barChartData.issues.slice(0, mCtrl.barChartData.years.length) : [],
                            credits: {
                                enabled: false
                            }
                        }
                    };


                $scope.$apply();

        }
        $rootScope.socket.on('poll-server', function(data) {
                if (data.metrics && $state.current.name == 'metrics') {
                    lineChart(data.changesCustomer);
                    barChart(data.changesReport);
                }
        });
    }
})();