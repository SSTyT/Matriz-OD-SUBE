'use strict';
angular.module('matrizOdSube').factory('Tools', ['$http', '$q',Tools]);

function Tools($http, $q) {

    //helpers
    function getID(prov,depto){
        function pad(num, size) {
            var s = "000000000" + parseInt(num);
            return s.substr(s.length-size);
        }
        var id  = ""+parseInt(prov)+pad(depto,3);

        //console.log(id); 
        return  id ;
    }

    this.model ={} ;


    function setModel(model){
       this. model = model;
    }
  function getModel(){
    return this.model;
  }

    var colors = {
        white:{
            r:255,
            g:255,
            b:255
        },
        max : {
            r:245,
            g:85,
            b:54
        },
        med : {
            r:255,
            g:163,
            b:74
        },
        min : {
            r:250,
            g:218,
            b:156
        },
        tren: {
            r:120,
            g:120,
            b:10
        },
        colectivo: {
            r:104,
            g:216,
            b:214
        },
        subte: {
            r:156,
            g:234,
            b:60
        },
        transbordo:{
            r:194,
            g:148,
            b:138
        },
        atributo:{
            r:188,
            g:124,
            b:156
        }
        
    };

 

    return  {
        setModel:setModel,
        getModel:getModel,

        colors:colors,
        getID : getID
        };
}
