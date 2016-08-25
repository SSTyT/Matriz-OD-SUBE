
  'use strict';

  angular
    .module('matrizOdSube')
    .controller('ODMController', ['$scope','$timeout','LeafletServices',ODMController]);

  /** @ngInject */
  function ODMController($scope,$timeout,LeafletServices ) {
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
        } ; 
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

