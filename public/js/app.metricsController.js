/**
 * Created by arjunMitraReddy on 7/28/2016.
 */

(function() {
    "use strict";
    angular.module('corpdash')
        .controller('metricsController', metricsController);

    metricsController.$inject = ['$q', 'serviceConnectorFactory', '$state', '$rootScope'];

    function metricsController($q, serviceConnectorFactory, $state, $rootScope) {
        var mCtrl = this;
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
        function lineChart() {
            var defer = $q.defer();
            var newh = $("#lineGraphBox").height();

            $(window).resize(function () {
                newh = $("#lineGraphBox").height();
                chart1.redraw();
                chart1.reflow();
            });
            serviceConnectorFactory.get('/json/customers.json').then(function (data) {
                chart1 = new Highcharts.Chart({
                    chart: {
                        renderTo: 'lineGraph'
                    },
                    title: {
                        text: 'Paying Customers Over the Years (Live)'
                    },
                    xAxis: {
                        categories: data.years
                    },
                    yAxis: {
                        title: {
                            text: 'Customers (In Thousands)'
                        }
                    },

                    series: [{
                        name: 'Customers',
                        data: data.customers
                    }],

                    credits: {
                        enabled: false
                    }
                });
            });
            defer.resolve();
            return defer.promise;
        }

        function barChart() {
            var defer = $q.defer();
            serviceConnectorFactory.get('/json/reportedIssues.json').then(function (data) {
                chart2 = new Highcharts.Chart({
                    chart: {
                        renderTo: 'barGraphBox',
                        type: 'column'
                    },
                    title: {
                        text: 'Reported Issues Status (Live)'
                    },
                    xAxis: {
                        categories: data.years
                    },
                    yAxis: {
                        title: {
                            text: 'Issues Reported (In Hundreds)'
                        }
                    },
                    series: data.issues,
                    credits: {
                        enabled: false
                    }
                });
            });
            defer.resolve();
            return defer.promise;
        }
        $rootScope.socket.on('poll-server', function(data) {
                if (data.metrics && $state.current.name == 'metrics') {
                    serviceConnectorFactory.get('/json/customers.json').then(function (data) {
                        var obj = {
                            name: 'Customers',
                            data: data.customers
                        };
                        chart1.series[0].setData(data.customers,true);
                    });

                    serviceConnectorFactory.get('/json/reportedIssues.json').then(function(data) {
                        console.log(data.issues);
                        for (var i=0; i<chart2.series.length; i++) {
                            chart2.series[i].setData(data.issues[i].data, true)
                        }
                    })
                }
        });
    }
})();