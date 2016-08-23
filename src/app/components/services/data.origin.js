angular.module('matrizOdSube').factory('DataOrigin', ['$http', '$q','LeafletServices',DataOrigin])


function DataOrigin($http, $q,LeafletServices) {

    $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //var urlZones  = 'assets/zonas.geojson';
    //var urlZones  = 'assets/disolve_by_locate_depart.geojson';
    var urlZones  = 'assets/zonas.g.geojson';
    var urlMatriz = 'assets/subedatos.json';

    function sortTheMotherfuckers(data,by){
        var sorted = [];
            for (var i = data.features.length - 1; i >= 0; i--) {
                var clave = data.features[i].properties[by];
                if ( sorted[clave] == undefined){
                    sorted[clave] = [] ; 
                }
                sorted[clave].push(data.features[i])
            }
        return sorted;
    }



    var ODRegister = function (data){
        this.cantidad_as = data.cantidad_as ;
        this.cantidad_bus = data.cantidad_bus ;
        this.cantidad_subte = data.cantidad_subte ;
        this.cantidad_transbordo = data.cantidad_transbordo ;
        this.cantidad_tren = data.cantidad_tren ;
        this.depto_destino = data.depto_destino ;
        this.depto_origen = data.depto_origen ;
        this.hora_incio = data.hora_incio ;
        this.pobl2010_destino = data.pobl2010_destino ;
        this.pobl2010_origen = data.pobl2010_origen ;
        this.prov_destino = data.prov_destino ;
        this.prov_origen = data.prov_origen ;
        this.total =  this.cantidad_bus +this.cantidad_subte+this.cantidad_tren ;
        this.detail = [] ; 
        this.detail.push(data);
        this. originalStyle = {};
        this.destinations = [] ;
        
        this.add = function (data){
            this.cantidad_as += data.cantidad_as ;
            this.cantidad_bus += data.cantidad_bus ;
            this.cantidad_subte += data.cantidad_subte ;
            this.cantidad_transbordo += data.cantidad_transbordo ;
            this.cantidad_tren += data.cantidad_tren ;
            this.detail.push(data);
            this.total +=  data.cantidad_bus + data.cantidad_subte+ data.cantidad_tren ;
            

            this.destinations[data.depto_destino] =  0 ;
        }


        this.highlight = function () {
            console.log("highlight" + this.depto_origen);

              this.destinations.forEach( function( index,element) {
                   LeafletServices.polygons[element].highlight('destination');
              });

              LeafletServices.polygons[this.depto_origen].highlight('origin');
        }
        this.unHighlight = function () {
                          this.destinations.forEach( function( index,element) {
                   LeafletServices.polygons[element].unHighlight();
              });
            LeafletServices.polygons[this.depto_origen].unHighlight();
        }

    }


    function cookOD(data){
        var bigTable = [] ; 
        var bigArray = [] ;
        data.forEach( function(element, index) {
             if (bigTable[element.depto_origen] ==  undefined)
                { bigTable[element.depto_origen] = new ODRegister(element);}
            else {
                bigTable[element.depto_origen].add(element)
            }

            console.log("record: "+element.depto_origen+"    added")
        });
        bigTable.forEach(function(element,index){
        bigArray.push(element);
        })

        console.log("departamentos: "+bigTable.length);
        return bigArray ; 
    }

    function getODData() {
        var promise = $q(function(success, reject) {
                $http.get(urlMatriz).success(function(res) {
                        success(cookOD(res));
                });
        });
        return promise;
    }

    function getZonas(){
        var promise = $q(function(success, reject) {
                $http.get(urlZones).success(function(res) {
                    success(res.features);
                    //success(sortTheMotherfuckers(res,'depto'));
                });
        });
        return promise;
    }

    return {
        getODData : getODData,
        getZonas : getZonas 
    };
}

/*
cantidad_as
cantidad_bus
cantidad_subte
cantidad_transbordo
cantidad_tren
depto_destino
depto_origen
hora_incio
pobl2010_destino
pobl2010_origen
prov_destino
prov_origen
*/
