"use strict";

angular.module('matrizOdSube').directive('originDetail', ['$timeout', originDetail]);

function originDetail($timeout) {
    // Runs during compile
    console.log("directive originDetail compiled");
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        //template: '<ng-map class="filtre--l"  disable-default-u-i="true" center="-34.628767838201036,-58.542341058691335" zoom="12" styles=\'[{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]\'> </ng-map>',
        templateUrl: 'app/components/odm/detail/detail.tpl.html',
        replace: true,

        link: function($scope, iElm, iAttrs) {

            function init (){


            $scope.current.options.viajes =  {
                chart: {
                    color: ['rgb(22,186,197)','rgb(104,216,214)','rgb(156,234,60)'],
                    type: 'pieChart',
                    height:150,
                    width:300,
                    x: function(d){return d.key;},
                    y: function(d){return d.y ;},
                    showLabels: false,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

            $scope.current.options.transbordo =  {
                chart: {
                    type: 'bulletChart',
                    height:50,
                    width:400,
                    x: function(d){return d.key;},
                    y: function(d){return d.y ;},
                    showLabels: false,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

            $scope.current.options.atributo =  {
                chart: {
                    type: 'bulletChart',
                    height:50,
                    width:400,
                    x: function(d){return d.key;},
                    y: function(d){return d.y ;},
                    showLabels: false,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

            $scope.current.options.horas = {
                chart: {
                        color: ['rgb(255,10,10)','rgb(22,186,197)','rgb(104,216,214)','rgb(156,234,60)'],
                    type: 'multiBarChart',
                    height: 150,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 45,
                        left: 45
                    },
                    clipEdge: true,
                    //staggerLabels: true,
                    duration: 500,
                    stacked: true,
                    xAxis: {
                        axisLabel: 'Horas ()',
                        showMaxMin: false,
                        tickFormat: function(d){
                            return d3.format(',f')(d);
                        }
                    },
                    yAxis: {
                        axisLabel: 'Viajes',
                        axisLabelDistance: -20,
                        tickFormat: function(d){
                            return d3.format(',.1f')(d);
                        }
                    }
                }
            };

            $scope.current.data.viajes = [
                  {
                      key: "One",
                      y: 5
                  },
                  {
                      key: "Two",
                      y: 2
                  }
            ];

            $scope.current.data.transbordo = [
                  {
                      key: "One",
                      y: 5
                  },
                  {
                      key: "Two",
                      y: 2
                  }
            ];

            $scope.current.data.atributo = [
                  {
                      key: "One",
                      y: 5
                  },
                  {
                      key: "Two",
                      y: 2
                  }
            ];

            $scope.current.data.horas = [
                {
                    key:'total',
                    values:[
                        {x:'00:00',y:1},
                        {x:1,y:15},
                        {x:2,y:2},
                        {x:3,y:15},
                        {x:4,y:3},
                        {x:5,y:20},
                        {x:6,y:100},
                        {x:7,y:150},
                        {x:8,y:200},
                        {x:9,y:150},
                        {x:10,y:17},
                        {x:11,y:3},
                        {x:12,y:3},
                        {x:13,y:3},
                        {x:14,y:12},
                        {x:15,y:3},
                        {x:16,y:3},
                        {x:17,y:30},
                        {x:18,y:200},
                        {x:19,y:150},
                        {x:20,y:30},
                        {x:21,y:3},
                        {x:22,y:3},
                        {x:23,y:3}
                    ]
                },
                {
                    key:'tren',
                    values:[
                        {x:0,y:1},
                        {x:1,y:15},
                        {x:2,y:2},
                        {x:3,y:15},
                        {x:4,y:3},
                        {x:5,y:20},
                        {x:6,y:100},
                        {x:7,y:150},
                        {x:8,y:200},
                        {x:9,y:150},
                        {x:10,y:17},
                        {x:11,y:3},
                        {x:12,y:3},
                        {x:13,y:3},
                        {x:14,y:12},
                        {x:15,y:3},
                        {x:16,y:3},
                        {x:17,y:30},
                        {x:18,y:200},
                        {x:19,y:150},
                        {x:20,y:30},
                        {x:21,y:3},
                        {x:22,y:3},
                        {x:23,y:3}
                    ]
                },
                {
                    key:'colectivo',
                    values:[
                        {x:0,y:1},
                        {x:1,y:15},
                        {x:2,y:2},
                        {x:3,y:15},
                        {x:4,y:3},
                        {x:5,y:20},
                        {x:6,y:100},
                        {x:7,y:150},
                        {x:8,y:200},
                        {x:9,y:150},
                        {x:10,y:17},
                        {x:11,y:3},
                        {x:12,y:3},
                        {x:13,y:3},
                        {x:14,y:12},
                        {x:15,y:3},
                        {x:16,y:3},
                        {x:17,y:30},
                        {x:18,y:200},
                        {x:19,y:150},
                        {x:20,y:30},
                        {x:21,y:3},
                        {x:22,y:3},
                        {x:23,y:3}
                    ]
                },
                {
                    key:'subte',
                    values:[
                        {x:0,y:1},
                        {x:1,y:15},
                        {x:2,y:2},
                        {x:3,y:15},
                        {x:4,y:3},
                        {x:5,y:20},
                        {x:6,y:100},
                        {x:7,y:150},
                        {x:8,y:200},
                        {x:9,y:150},
                        {x:10,y:17},
                        {x:11,y:3},
                        {x:12,y:3},
                        {x:13,y:3},
                        {x:14,y:12},
                        {x:15,y:3},
                        {x:16,y:3},
                        {x:17,y:30},
                        {x:18,y:200},
                        {x:19,y:150},
                        {x:20,y:30},
                        {x:21,y:3},
                        {x:22,y:3},
                        {x:23,y:3}
                    ]
                }
            ];
        }

        init();

        }
    };
}
