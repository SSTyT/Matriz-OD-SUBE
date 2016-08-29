
  'use strict';

  angular
    .module('matrizOdSube')
    .controller('ODMController', ['$scope','$timeout','LeafletServices','DataOrigin',ODMController]);

  /** @ngInject */
  function ODMController($scope,$timeout,LeafletServices ,DataOrigin) {
      var vm = this;

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
      //load leaflet map centered on ba
      //load od matrix
      //load zones geometry
      // on tile load
      //paint geomtry 
      ///bind geometry

      this.open = function (id){
        console.log("Open the mother fucker !!!" + id);
                $scope.showDetail = true;

                //$scope.current.record = DataOrigin.record[id];
                $scope.leftPanel.setDetail(DataOrigin.record[id]);

                   // $scope.current.options = {
                   //        chart: {
                   //            type: 'pieChart',
                   //            height: 200,
                   //            x: function(d){return d.key;},
                   //            y: function(d){return d.y;},
                   //            showLabels: true,
                   //            duration: 500,
                   //            labelThreshold: 0.01,
                   //            labelSunbeamLayout: true,
                   //            legend: {
                   //                margin: {
                   //                    top: 5,
                   //                    right: 35,
                   //                    bottom: 5,
                   //                    left: 0
                   //                }
                   //            }
                   //        }
                   //    };







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
  }

