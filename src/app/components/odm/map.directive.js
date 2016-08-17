"use strict";

angular.module('matrizOdSube').directive('odMap', ['$timeout','DataOrigin', odMap]);

function odMap($timeout,DataOrigin) {
    // Runs during compile
    console.log("directive odMap compiled");
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        //template: '<ng-map class="filtre--l"  disable-default-u-i="true" center="-34.628767838201036,-58.542341058691335" zoom="12" styles=\'[{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]\'> </ng-map>',
        template: '<div id="map"></div>',
        replace: true,

        link: function($scope, iElm, iAttrs) {



			//$scope.preloader.show();

            var OSM = L.tileLayer.provider('OpenStreetMap.HOT');

            var map = L.map('map', {
                zoomControl: false,
                center: [-34.6192103, -58.429606],
                layers: OSM,
                zoom: 12
            });

            $scope.map = {
                model: map,
                center: "-34.628767838201036,-58.542341058691335",
                active: false,
                reCenter: function() {
                    $scope.map.model.setCenter($scope.map.center);
                }
            };
            $scope.map.model.setView({ 'lat': parseFloat('-34.628767838201036'), 'lng': parseFloat('-58.542341058691335') }, 12);
            $scope.map.setup = function(callBack) {
                OSM.on("load", function callmeOnce() {
                    //console.log("all visible tiles have been loaded");
                    callBack();
                    OSM.off("load", callmeOnce);
                });


				//$scope.preloader.hide();
            };



var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
}
            $scope.map.setup(function (){

				DataOrigin.getZonas().then(succesZonas,failZonas);
				function succesZonas(data){
					console.log(data.features)
					L.geoJson(data.features,{style:myStyle}).addTo(map);
				}
				function failZonas(data){
					console.log(data)
				}


            });



            console.log("directive odMap linked");
        }
    };
}
