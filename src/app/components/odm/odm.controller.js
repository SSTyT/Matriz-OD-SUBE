
  'use strict';

  angular
    .module('matrizOdSube')
    .controller('ODMController', ['$timeout','LeafletServices',ODMController]);

  /** @ngInject */
  function ODMController($timeout,LeafletServices ) {
      var vm = this;

      //load leaflet map centered on ba
      //load od matrix
      //load zones geometry
      // on tile load
      //paint geomtry 
      ///bind geometry

      this.open = function (id){
        //show origin zone at left
        //show destination zones at right panel
        //highlight poligons
      };


      this.close = function (){
      //hide left pannel content
      //hide right pannel content
      //normalize highlited zones
    };
  }

