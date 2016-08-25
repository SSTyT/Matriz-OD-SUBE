angular.module('matrizOdSube').factory('DataOrigin', ['$http', '$q','LeafletServices',DataOrigin])


function DataOrigin($http, $q,LeafletServices) {

    $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //var urlZones  = 'assets/zonas.geojson';
    //var urlZones  = 'assets/disolve_by_locate_depart.geojson';
    var urlZones  = 'assets/zonas.g.geojson';
    var urlMatriz = 'assets/subedatos.json';

    var model = {
        matriz : [] ,
        medias : {
            atributo : 0,
            transbordo : 0 
        },
        totales:{
            tren:0,
            colectivo:0,
            subte:0,
            viajes:0,
            atributo : 0,
            transbordo : 0 

        }
    }

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
        this.atributo = data.cantidad_as ;
        this.colectivo = data.cantidad_bus ;
        this.subte = data.cantidad_subte ;
        this.transbordo = data.cantidad_transbordo ;
        this.tren = data.cantidad_tren ;
        this.departamento = data.depto_origen ;
       // this.hora_incio = data.hora_incio ;
       // this.pobl2010_destino = data.pobl2010_destino ;
       // this.pobl2010_origen = data.pobl2010_origen ;
       // this.prov_destino = data.prov_destino ;
        this.provincia = data.prov_origen ;
        this.total =  this.colectivo +this.subte+this.tren ;
        this.total_porcentaje = 0 ;

        //this.detail = [] ; 
        //this.detail.push(data);
        this.originalStyle = {};
        this.destinations = [] ;
        this.destinations[data.depto_destino] = 0 ;

        this.porcentaje = {
            colectivo : 0,
            subte : 0,
            tren : 0
        };
        this.updatePorcentajes = function (){
            this.porcentaje.tren = parseInt(this.tren*100/this.total);
            this.porcentaje.colectivo = parseInt(this.colectivo*100/this.total);
            this.porcentaje.subte = parseInt(this.subte*100/this.total);
        }
        //this.updatePorcentajes();
        this.add = function (data){
            this.atributo += data.cantidad_as ;
            this.colectivo += data.cantidad_bus ;
            this.subte += data.cantidad_subte ;
            this.transbordo += data.cantidad_transbordo ;
            this.tren += data.cantidad_tren ;
            //this.detail.push(data);
            this.total +=  data.cantidad_bus + data.cantidad_subte + data.cantidad_tren ;
            this.destinations[data.depto_destino] =  0 ;
            this.updatePorcentajes();
        }
        // this.setPorcentaje = function(key,value){
        //     this.porcentaje[key] = value;
        // }

        this.highlight = function () {
            console.log("highlight" + this.departamento);
            this.destinations.forEach( function(index,element) {
                LeafletServices.polygons[element].highlight('destination');
            });
            LeafletServices.polygons[this.departamento].highlight('origin');
        }

        this.unHighlight = function () {
            this.destinations.forEach( function(index,element) {
                LeafletServices.polygons[element].unHighlight();
            });
            LeafletServices.polygons[this.departamento].unHighlight();
        }

    }


    function cookOD(data){
        var bigTable = [] ; 
        var model = {
            matriz :[],
            medias :{
                transbordo:0,
                atributo:0,
            },
            totales:{
                transbordo:0,
                atributo:0,
                colectivo:0,
                subte:0,
                tren:0,
                total:0
            }
        };

        data.forEach( function(element, index) {
            if (bigTable[element.depto_origen] ==  undefined) { 
                    bigTable[element.depto_origen] = new ODRegister(element);
                    model.matriz.push(bigTable[element.depto_origen]);
            }
            else {
                bigTable[element.depto_origen].add(element)
            }

            //console.log("record: "+element.depto_origen+" added");
        });

        console.log("departamentos: "+bigTable.length);
        
        //calcular totales
        model.matriz.forEach(countTotals);
        function countTotals(element,index){
            model.totales.transbordo += element.transbordo;
            model.totales.atributo += element.atributo;
            model.totales.colectivo += element.colectivo;
            model.totales.subte += element.subte;
            model.totales.tren += element.tren;
            model.totales.total += element.total;
        }

        model.matriz.forEach(setPorentajes);
        function setPorentajes(element,index){
            this.total_porcentaje = (element.total*100)/model.totales.total  ;
        }

        //calcular medias
        model.medias.atributo = parseInt( model.totales.atributo / model.matriz.length);
        model.medias.transbordo = parseInt (model.totales.transbordo / model.matriz.length);
        
        //ordenar por totales la matriz
        model.matriz.sort(compareFunction)
        function compareFunction(a,b){
            return b.total - a.total ;
        }

        return model ; 
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
