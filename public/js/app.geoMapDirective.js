/**
 * Created by arjunMitraReddy on 8/1/2016.
 */
(function() {
    "use strict";
    angular.module('corpdash')
        .directive('geoMap', geoMap);

    function geoMap() {
        return {
            restrict: 'E',
            template: '<div id="container" class="mapContainer"></div>',
            scope: {
                options: '@',
                circles: '@',
                resize: '@'
            },
            link: function(scope, elem, attrs) {
                attrs.$observe('options', function(value) {
                    scope.data = JSON.parse(value);
                    scope.data.element = elem[0].childNodes[0];
                    scope.map = new Datamap(scope.data);

                });
                attrs.$observe('circles', function(value) {
                    try {
                        scope.bubbles = JSON.parse(value);
                        scope.map.bubbles(scope.bubbles, {
                            popupTemplate: function (geo, data) {
                                return ['<div class="hoverinfo">' +  data.name + " </br> " + data.size + " Thousand Employees" + '</div>'];
                            }
                        })
                    }
                    catch(e) {}
                });
                attrs.$observe('resize', function(value) {
                    scope.map.resize();
                })
            }
        }
    }
})();