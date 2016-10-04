
  'use strict';

  angular
    .module('matrizOdSube')
    .controller('ODMController', ['$scope','$timeout','$q','LeafletServices','DataOrigin','Tools',ODMController]);

  /** @ngInject */
  function ODMController($scope,$timeout,$q,LeafletServices ,DataOrigin , Tools) {
      var vm = this;
      var getID = Tools.getID;
      $scope.model = {
        matriz : {},
          media : {
            transbordos : 1000,
            salidas : 1000,
            trens : 1000,
            subtes : 1000,
            colectivos: 1000
          }
        };

      $scope.current = {
          options :{},
          data : {}
      };

      $scope.showDetail = false;
      
      $scope.loadingApp = true ;
            var promises = [
                LeafletServices.initMap(),
                DataOrigin.getZonas(),
                DataOrigin.getODData()
                //DataOrigin.getColectivos(),
                //DataOrigin.getSubtes(),
                //DataOrigin.getTrenes()
            ];

            $q.all(promises).then(function(values){
                console.log(values);


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
                subtes.forEach(pintar);
                trenes.forEach(pintar);
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
                            style : DataOrigin.record[getID(e.properties.prov,e.properties.depto)].style
                        },function(id){
                            $scope.vm.open(id);
                            $scope.$apply();
                        });
                    },20*i);

                }
            }

            function drawMatrix(data){
                console.log(data);
                $scope.model = data ; 
            }




















      this.open = function (id){
        console.log("Open the mother fucker !!!" + id);
        $scope.showDetail = true;
        $scope.current.record = DataOrigin.record[id];
        $scope.leftPanel.setDetail(DataOrigin.record[id]);
        $scope.rightPanel.setList();
        console.log( $scope.current);
        $scope.current.record.highlight();
        //show origin zone at left
        //show destination zones at right panel
        //highlight poligons
      };

      this.close = function (){
        $scope.showDetail = false;
        $scope.current.record.unHighlight();
      //hide left pannel content
      //hide right pannel content
      //normalize highlited zones
    };


    $scope.odm = {
      open : this.open,
      close : this.close
    } ;
  }

