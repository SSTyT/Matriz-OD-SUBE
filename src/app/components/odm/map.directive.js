"use strict";

angular.module('matrizOdSube').directive('odMap', ['$timeout','$q','LeafletServices','DataOrigin', odMap]);

function odMap($timeout,$q,LeafletServices,DataOrigin) {
    // Runs during compile
    console.log("directive odMap compiled");
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        //template: '<ng-map class="filtre--l"  disable-default-u-i="true" center="-34.628767838201036,-58.542341058691335" zoom="12" styles=\'[{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]\'> </ng-map>',
        template: '<div id="map"></div>',
        replace: true,

        link: function($scope, iElm, iAttrs) {

           // LeafletServices.initMap().then(mapHandler);

            var promises = [
                LeafletServices.initMap(),
                DataOrigin.getZonas(),
                DataOrigin.getODData()
            ];

            $q.all(promises).then(function(values){
                console.log(values);
                mapHandler(values[0]);
                drawPolygons(values[1]);
                drawMatrix(values[2]);

            });

            function mapHandler(leMap){
                $scope.map = {
                    model: leMap,
                    center: "-34.628767838201036,-58.542341058691335",
                    active: false,
                    reCenter: function() {
                        $scope.map.model.setCenter($scope.map.center);
                    }
                };                
                $scope.map.model.setView({ 'lat': parseFloat('-34.628767838201036'), 'lng': parseFloat('-58.542341058691335') }, 12);
            }

            function drawPolygons(data){
                data.forEach(pintar);
                function pintar(e,i){
                    LeafletServices.drawPoly({
                        geometry:e,
                        style : DataOrigin.record[parseInt(e.properties.depto)].style
                    });
                }
            }

            function drawMatrix(data){
                console.log(data);
                $scope.model = data ; 
            }



            //$scope.map.setup();



            console.log("directive odMap linked");
        }
    };
}
