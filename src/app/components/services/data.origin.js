'use strict';
angular.module('matrizOdSube').factory('DataOrigin', ['$http', '$q','LeafletServices',DataOrigin]);


function DataOrigin($http, $q,LeafletServices) {

    $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //var urlZones  = 'assets/zonas.geojson';
    //var urlZones  = 'assets/disolve_by_locate_depart.geojson';
    var urlZones  = 'assets/zonas.g.geojson';
    var urlMatriz = 'assets/salida3.json';
    //var urlMatriz = 'assets/subedatos.json';

    var bigTable = [] ; 
    var model = {
        matriz : [] ,
        medias : {
            atributo : 0,
            transbordo : 0 
        },
        totales:{
            transbordo : 0, 
            colectivo : 0,
            atributo : 0,
            subte : 0,
            total : 0,
            tren : 0
        },
        max:{
            colectivo : 0,
            subte : 0,
            total : 0,
            tren : 0,
            atributo : 0,
            transbordo : 0 
        },
        min:{
            colectivo : 1000000000,
            subte : 1000000000,
            total : 1000000000,
            tren : 1000000000,
            atributo : 10000000000,
            transbordo : 10000000000 
        },
        colors:{
            max : {
                r:245,
                g:85,
                b:54
            },
            min : {
                r:250,
                g:218,
                b:156
            },
            tren: {
                r:22,
                g:186,
                b:197
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
            }
        }
    };

    var HourRegister = function (){

        function oneHour (id) {
            this.hora = id ;
            this.total = 0;
            this.tren = 0;
            this.subte = 0;
            this.colectivo = 0;
            this.atributo = 0 ;
            this.transbordo = 0 ;

            this.update =function (data){
                this.total += data.cantidad_total;
                this.tren += data.cantidad_tren;
                this.subte += data.cantidad_subte;
                this.colectivo += data.cantidad_bus;
                this.atributo += data.cantidad_as ;
                this.transbordo += data.cantidad_transbordo ;
            }
        }

        this.horasTable = [] ;

        

        for (var i = 0; i <= 23; i++) {
            this.horasTable[i] = new oneHour(i);
        }


        this.update = function (data){
            this.horasTable[data.hora_inicio].update(data);
        };

        this.get = function(id){
            return this.horasTable[id];
        };

    }

    var RegisterDetail = function (){

        function DestinationRegister (data){

            this.atributo = data.cantidad_as ;
            this.colectivo = data.cantidad_bus ;
            this.subte = data.cantidad_subte ;
            this.transbordo = data.cantidad_transbordo ;
            this.tren = data.cantidad_tren ;
            this.total =  data.cantidad_bus + data.cantidad_subte + data.cantidad_tren ;
            this.departamento = data.depto_destino;

            this.add = function (data){
                this.atributo += data.cantidad_as ;
                this.colectivo += data.cantidad_bus ;
                this.subte += data.cantidad_subte ;
                this.transbordo += data.cantidad_transbordo ;
                this.tren += data.cantidad_tren ;
                this.total +=  data.cantidad_bus + data.cantidad_subte + data.cantidad_tren ;                
            };

        }
        this.destinationsByHour = [] ;
        this.destination = [];
        this.destinationID = [];
        this.update = function (data){
            if (this.destination[data.depto_destino] === undefined){
                this.destination[data.depto_destino] = new DestinationRegister(data);  
                        this.destinationID.push(data.depto_destino);
            }
            else{
                this.destination[data.depto_destino].add(data);
           }
       }
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
        this.total =  data.cantidad_bus+data.cantidad_subte +data.cantidad_tren;
        this.total_porcentaje = 0 ;

        //this.detail = [] ; 
        //this.detail.push(data);
        this.style = {};
        this.detail = new RegisterDetail();
        this.hour = new HourRegister();
        // this.destinations = [] ;
        // this.destinations[data.depto_destino] = 0 ;

        this.porcentaje = {
            colectivo : 0,
            subte : 0,
            tren : 0
        };
        this.updatePorcentajes = function (){
            this.porcentaje.tren = parseInt((this.tren*100)/this.total);
            this.porcentaje.colectivo = parseInt((this.colectivo*100)/this.total);
            this.porcentaje.subte = parseInt((this.subte*100)/this.total);
        };
        //this.updatePorcentajes();
        this.add = function (data){
            this.atributo += data.cantidad_as ;
            this.colectivo += data.cantidad_bus ;
            this.subte += data.cantidad_subte ;
            this.transbordo += data.cantidad_transbordo ;
            this.tren += data.cantidad_tren ;
            //this.detail.push(data);
            this.total += data.cantidad_bus+data.cantidad_subte +data.cantidad_tren ;
            //this.destinations[data.depto_destino] =  0 ;
            this.updatePorcentajes();

            this.detail.update(data);
            this.hour.update(data);

        };
        // this.setPorcentaje = function(key,value){
        //     this.porcentaje[key] = value;
        // }


        //comportamiento
        this.highlight = function () {
            //console.log("highlight" + this.departamento);
            // this.destinations.forEach( function(index,element) {
            //     LeafletServices.polygons[element].highlight('destination');
            // });
            // LeafletServices.polygons[this.departamento].highlight('origin');
            // LeafletServices.polygons[this.departamento].focus();

        };

        this.unHighlight = function () {
            // this.destinations.forEach( function(index,element) {
            //     LeafletServices.polygons[element].unHighlight();
            // });
            // LeafletServices.polygons[this.departamento].unHighlight();
        };

    };


    function cookOD(data){
        data.forEach( function(element, index) {

            //console.log(element.hora_inicio);
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

        model.matriz.forEach(recorrer);

        function storeMax(key,element){
            if(model.max[key] < element[key]){
                model.max[key] = element[key]
            }
        }

        function storeMin(key,element){
            if(model.min[key] > element[key]){
                model.min[key] = element[key]
            }
        }

        function recorrer(element,index){
            element.total_porcentaje = (element.total*100)/model.totales.total;

            storeMax('total',element);
            storeMax('subte',element);
            storeMax('colectivo',element);
            storeMax('tren',element);
            storeMax('transbordo',element);
            storeMax('atributo',element);

            storeMin('total',element);
            storeMin('subte',element);
            storeMin('colectivo',element);
            storeMin('tren',element);
            storeMin('transbordo',element);
            storeMin('atributo',element);

        }

        //calcular medias
        model.medias.atributo = parseInt( model.totales.atributo / model.matriz.length);
        model.medias.transbordo = parseInt (model.totales.transbordo / model.matriz.length);
        //calcular el color de cada depto en funcion de su valor total de viajes 
        model.matriz.forEach(paintRecord);
        function calcTotalColor(param,min,max){
            var r = parseInt(param.map(min,max,model.colors.min.r,model.colors.max.r));
            var g = parseInt(param.map(min,max,model.colors.min.g,model.colors.max.g));
            var b = parseInt(param.map(min,max,model.colors.min.b,model.colors.max.b));
            return 'rgb('+r+','+g+','+b+')';
        }

        function paintRecord(element,index){

            element.style = {
                weight: 2,
                color: calcTotalColor(element.total,0,model.max.total),
                fillOpacity: 0.85,
                strokeOpacity:1
            };


            var totalDestinos = 0 ;
            element.detail.destination.forEach(getMax);
            element.detail.destination.forEach(pintarDestinos);

            function getMax(element,index){
                if (element.total > totalDestinos){
                    totalDestinos = element.total ;
                }
            };

            function pintarDestinos(element,index){
                element.style = {
                    weight: 2,
                    color: calcTotalColor(element.total,0,totalDestinos),
                    fillOpacity: 0.85,
                    strokeOpacity:1
                };
            };
        }

        //ordenar por totales la matriz
        model.matriz.sort(compareFunction)
        function compareFunction(a,b){
            return b.total - a.total ;
        }

        model.matriz.forEach(sortChildren);
        function sortChildren(element,index){
            element.detail.destination.sort(compareFunction);
        }

        console.log(model);
        return model ; 
    };

    function getODData() {
        var promise = $q(function(success, reject) {
                $http.get(urlMatriz).success(function(res) {
                        success(cookOD(res));
                });
        });
        return promise;
    };

    function getZonas(){
        var promise = $q(function(success, reject) {
                $http.get(urlZones).success(function(res) {
                    success(res.features);
                    //success(sortTheMotherfuckers(res,'depto'));
                });
        });
        return promise;
    };

    return {
        getODData : getODData,
        getZonas : getZonas,
        record : bigTable
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
