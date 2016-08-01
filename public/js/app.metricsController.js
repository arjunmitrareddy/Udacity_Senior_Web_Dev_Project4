/**
 * Created by arjunMitraReddy on 7/28/2016.
 */

(function() {
    "use strict";
    angular.module('corpdash')
        .controller('metricsController', metricsController);

    metricsController.$inject = ['$q', 'serviceConnectorFactory', '$state', '$rootScope', '$timeout', '$scope'];

    function metricsController($q, serviceConnectorFactory, $state, $rootScope, $timeout, $scope) {
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

        adjustView().then(lineChart).then(barChart);

        function lineChart(data) {
            var defer = $q.defer();
                mCtrl.lineChartData = data;
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
                            data: mCtrl.lineChartData ? mCtrl.lineChartData.customers : []
                        }],

                        credits: {
                            enabled: false
                        }
                    }
                };
            $scope.$apply();
            defer.resolve();
            return defer.promise;
        }

        function barChart(data) {
            var defer = $q.defer();
                mCtrl.barChartData = data;
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
                        series: mCtrl.barChartData ? mCtrl.barChartData.issues : [],
                        credits: {
                            enabled: false
                        }
                    }
                };
            $scope.$apply();
            defer.resolve();
            return defer.promise;
        }
        $rootScope.socket.on('poll-server', function(data) {
                if (data.metrics && $state.current.name == 'metrics') {
                    console.log(data);
                    lineChart(data.changesCustomer);
                    barChart(data.changesReport);
                }
        });
    }
})();