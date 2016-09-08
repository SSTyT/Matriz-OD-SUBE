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
           $scope.loadingApp = true ;
            var promises = [
                LeafletServices.initMap(),
                DataOrigin.getZonas(),
                DataOrigin.getODData(),
                DataOrigin.getColectivos(),
                DataOrigin.getSubtes(),
                DataOrigin.getTrenes()
            ];

            $q.all(promises).then(function(values){
                console.log(values);

                // $timeout(function(){
                //     mapHandler(values[0]);
                // },500);
                // $timeout(function(){
                //     drawMatrix(values[2]);  
                // },500);
                // $timeout(function(){
                //     drawPolygons(values[1]);
                // },500);



               // drawTransport(values[3],values[4],values[5])

               $q.all(
                    $timeout(function(){
                        mapHandler(values[0]);
                    },
                    500),
                    $timeout(function(){
                        drawMatrix(values[2]);  
                    },
                    500),
                    $timeout(function(){
                        drawPolygons(values[1]);
                    },
                    500)
                ).then(function(){
                    $scope.loadingApp = false ;
                });

            });


            function drawTransport(coles,subtes,trenes){


                console.log(coles);
                console.log(subtes);
                console.log(trenes);

                  coles.forEach(pintar);
                  //subtes.forEach(pintar);
                  //trenes.forEach(pintar);

                function pintar(e,i){
                    LeafletServices.drawPath({
                        geometry:e,
                    });
                }


                $timeout(function(){
                    $('.departamento.animated')
                },3000);


            }

            function mapHandler(leMap){
                $scope.map = {
                    model: leMap,
                    center:  {lat:-34.69759025633039 , lng: -58.627166748046875},
                    caba: {
                        center: {lat: -34.628264216994054, lng: -58.450870513916016},
                        zoom:12
                    },
                    amba:{
                        center:  {lat:-34.69759025633039 , lng: -58.627166748046875},
                        zoom:9
                    },
                    active: false,
                    reCenter: function() {
                        $scope.map.model.setCenter($scope.map.center);
                    },
                    focus:function (on){
                        $scope.map.model.setView($scope.map[on].center,$scope.map[on].zoom,{animate:true});
                        //$scope.map.model.setZoom($scope.map[on].zoom);
                    }
                };                

                //$scope.map.model.setView({ 'lat': parseFloat('-34.628767838201036'), 'lng': parseFloat('-58.542341058691335') }, 12);
            }

            function drawPolygons(data){


                data.forEach(pintar);
                function pintar(e,i){

                    $timeout(function(){
                        LeafletServices.drawPoly({
                            geometry:e,
                            style : DataOrigin.record[parseInt(e.properties.depto)].style
                        },function(id){
                            $scope.vm.open(id);
                            $scope.$apply();
                        });
                    },50*i);




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
