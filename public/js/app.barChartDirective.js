/**
 * Created by arjunMitraReddy on 8/1/2016.
 */
(function() {
    "use strict";
    angular.module('corpdash')
        .directive('barChart', barChart);

    function barChart() {
        return {
            restrict: 'E',
            template: '<div id="barGraphBox" class="col-xs-12 col-sm-12 col-md-5 col-lg-5"></div>',
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
                            for (var i=0; i<scope.chart.series.length; i++) {
                                scope.chart.xAxis[i].setCategories(scope.data.xAxis.categories);
                                scope.chart.series[i].setData(scope.data.series[i].data, true)
                            }
                        }
                        catch(e) {}
                    }
                });
            }
        }
    }
})();