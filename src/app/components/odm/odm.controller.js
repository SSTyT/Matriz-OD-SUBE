
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
        options : {
          chart: {
              type: 'pieChart',
              height:500,
              x: function(d){return d.key;},
              y: function(d){return d.y;},
              showLabels: true,
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
      },
        data : [
          {
              key: "One",
              y: 5
          },
          {
              key: "Two",
              y: 2
          },
          {
              key: "Three",
              y: 9
          },
          {
              key: "Four",
              y: 7
          },
          {
              key: "Five",
              y: 4
          },
          {
              key: "Six",
              y: 3
          },
          {
              key: "Seven",
              y: .5
          }
      ]        
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

                var temp = DataOrigin.record[id];
                

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


                $scope.current.data = [
                  {key : 'tren',
                    y : temp.tren
                  },
                  { key : "colectivo",
                  y : temp.colectivo},
                  { key : "subte",
                  y : temp.subte}
                ];
                console.log( $scope.current);
        //show origin zone at left
        //show destination zones at right panel
        //highlight poligons
      };


      this.close = function (){
                $scope.showDetail = false;
      //hide left pannel content
      //hide right pannel content
      //normalize highlited zones
    };
  }

