/**
 * Created by arjunMitraReddy on 8/1/2016.
 */
(function() {
    "use strict";
    angular.module('corpdash')
        .directive('lineChart', lineChart);

    function lineChart() {
        return {
            restrict: 'E',
            template: '<div id="lineGraph"></div>',
            scope: {
                options: '@'
            },
            link: function (scope, element, attrs) {
                scope.chart = null;
                scope.data = null;
                attrs.$observe('options', function(value) {
                    if (!scope.chart) {
                            if (value) {
                            scope.data = JSON.parse(value);
                            scope.chart = new Highcharts.Chart(scope.data);
                            }
                    }
                    else {
                        try {
                            scope.data = JSON.parse(value);
                            scope.chart.xAxis[0].setCategories(scope.data.xAxis.categories);
                            scope.chart.series[0].setData(scope.data.series[0].data,true);
                        }
                        catch(e) {}
                    }

                });
            }
        }
    }
})();