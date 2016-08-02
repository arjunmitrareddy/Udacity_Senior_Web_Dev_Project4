/**
 * Created by arjunMitraReddy on 7/28/2016.
 */

(function() {
    "use strict";
    angular.module('corpdash')
        .controller('geoController', geoController);

    geoController.$inject = ['$q', '$state', '$rootScope', '$window', '$scope'];

    function geoController($q, $state, $rootScope, $window, $scope) {
        $rootScope.clear();
        var gCtrl = this;
        $rootScope.socket.emit('poll-client-geo');
        function adjustView() {
            var defer = $q.defer();
            var $viewField =  $('#viewField');
            $viewField.hasClass('container-fluid') ? $viewField.removeClass('container-fluid') : (($viewField).hasClass('container') ? '' : $viewField.addClass('container'));
            $('.navstate').each(function(index, a) {
                if (a.innerHTML == 'Geospatial View') {
                    $(a).parent().addClass('active');
                }
                else {
                    $(a).parent().removeClass('active');
                }
            });
            defer.resolve();
            return defer.promise;
        }
        adjustView().then(setGeoData());
        gCtrl.circles = null;
        function setGeoData(fromSocket) {
            gCtrl.geoMapOptions = {
                element: null,
                scope: 'world',
                responsive: true,
                geographyConfig: {
                    popupOnHover: true,
                    highlightOnHover: true
                },
                fills: {
                    'USA': '#d9534f',
                    'IND': '#5cb85c',
                    'CHN': '#5bc0de',
                    'CAN': '#428bca',
                    'JPN': '#783838',
                    'AUS': '#2bd0c3',
                    'BRA': '#9db22e',
                    'SWE': '#6673d6',
                    'ARG': '#63a10b',
                    'DEU': '#274358',
                    'FRA': '#a14bd2',
                    'ZAF': '#81473d',
                    'ESP': '#1f80a5',
                    'MDG': '#511446',
                    defaultFill: '#d3d3d3'
                },
                data: {
                    'CAN': {fillKey: 'CAN'},
                    'IND': {fillKey: 'IND'},
                    'USA': {fillKey: 'USA'},
                    'CHN': {fillKey: 'CHN'},
                    'JPN': {fillKey: 'JPN'},
                    'AUS': {fillKey: 'AUS'},
                    'BRA': {fillKey: 'BRA'},
                    'SWE': {fillKey: 'SWE'},
                    'ARG': {fillKey: 'ARG'},
                    'DEU': {fillKey: 'DEU'},
                    'FRA': {fillKey: 'FRA'},
                    'ZAF': {fillKey: 'ZAF'},
                    'ESP': {fillKey: 'ESP'},
                    'MDG': {fillKey: 'MDG'}

                }
            };
            if (fromSocket) { //data from socket
                if (!gCtrl.circles) {  // if circles is null
                    gCtrl.circles = fromSocket;
                    $scope.$apply();
                }
                if (gCtrl.circles) { //if circles not null
                    for (var i=0; i<fromSocket.length; i++) {
                        if (!_.isEqual(gCtrl.circles[i], fromSocket[i])) {  //checking for changes in data and update if changes found
                            gCtrl.circles = fromSocket;
                            $scope.$apply();
                        }
                    }

                }
            }
        }
        gCtrl.resize = false;
        angular.element($window).bind('resize', function() {
            gCtrl.resize = !gCtrl.resize;
            $scope.$apply();
        });
        $rootScope.socket.on('poll-server', function(data) {
            if (data.geo && $state.current.name == 'geoview' && data.changes) {
                setGeoData(data.changes);
            }
        });
    }
})();