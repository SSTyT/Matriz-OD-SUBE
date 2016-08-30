"use strict";

angular.module('matrizOdSube').directive('odLeftPanel', ['$timeout', odLeftPanel]);

function odLeftPanel($timeout) {
    // Runs during compile
    console.log("directive odLeftPanel compiled");
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        //template: '<ng-map class="filtre--l"  disable-default-u-i="true" center="-34.628767838201036,-58.542341058691335" zoom="12" styles=\'[{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]\'> </ng-map>',
        templateUrl: 'app/components/odm/panel.left/panel.left.tpl.html',
        replace: true,

        link: function($scope, iElm, iAttrs) {


            $scope.leftPanel = {
                setDetail : function (data){
                    console.log('SET DETAIL !!!')
                    $scope.current.data.viajes = [
                      {
                        key : 'tren',
                        y : data.porcentaje.tren
                      },
                      { 
                        key : "colectivo",
                        y : data.porcentaje.colectivo},
                      { 
                        key : "subte",
                        y : data.porcentaje.subte}
                    ];

                    $scope.current.data.transbordo =  {
                        "ranges":[$scope.model.min.transbordo,$scope.model.medias.transbordo,$scope.model.max.transbordo],  //Minimum, mean and maximum values.
                        "measures":[data.transbordo],        //Value representing current measurement (the thick blue line in the example)
                        "markers":[data.transbordo]          //Place a marker on the chart (the white triangle marker)
                      };
                    $scope.current.data.atributo ={
                        "ranges":[$scope.model.min.atributo,$scope.model.medias.atributo,$scope.model.max.atributo],  //Minimum, mean and maximum values.
                        "measures":[data.atributo],        //Value representing current measurement (the thick blue line in the example)
                        "markers":[data.atributo]          //Place a marker on the chart (the white triangle marker)
                      };




                    function getTimeDataFor(key,label,data){
                        var timeData = {key:label,values:[]};
                        for (var i = 0; i <= 23; i++) {timeData.values.push({x:i,y:data.hour.get(i)[key]});}
                        return timeData;
                    }

                    $scope.current.data.horas = [
                        getTimeDataFor('tren','Tren',data),
                        getTimeDataFor('colectivo','Colectivo',data),
                        getTimeDataFor('subte','Subte',data),
                    ];


                }
            };







            console.log("directive odLeftPanel linked");
        }
    };
}

