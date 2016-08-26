'use strict';
angular.module('matrizOdSube').factory('DataOrigin', ['$http', '$q','LeafletServices',DataOrigin]);


function DataOrigin($http, $q,LeafletServices) {

    $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //var urlZones  = 'assets/zonas.geojson';
    //var urlZones  = 'assets/disolve_by_locate_depart.geojson';
    var urlZones  = 'assets/zonas.g.geojson';
    var urlMatriz = 'assets/subedatos.json';
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
            tren : 0
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




    var RegisterDetail = function (){


        function DestinationRegister (data){

            this.atributo = data.cantidad_as ;
            this.colectivo = data.cantidad_bus ;
            this.subte = data.cantidad_subte ;
            this.transbordo = data.cantidad_transbordo ;
            this.tren = data.cantidad_tren ;
            this.total =  data.cantidad_bus + data.cantidad_subte + data.cantidad_tren ;
    
            this.add = function (data){
                this.atributo += data.cantidad_as ;
                this.colectivo += data.cantidad_bus ;
                this.subte += data.cantidad_subte ;
                this.transbordo += data.cantidad_transbordo ;
                this.tren += data.cantidad_tren ;
                this.total +=  data.cantidad_bus + data.cantidad_subte + data.cantidad_tren ;
                this.destinations[data.depto_destino] =  0 ;
                
                
            };

        }

        this.destinations = [];
        this.destinationID = [];
        this.update = function (data){
                if (this.destination[data.depto_destino] === undefined){
                    this.destination[data.depto_destino] = new DestinationRegister(data);
                    
                }
                else{
                    this.destination[data.depto_destino].add(data);
               }
       };
    };

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
        this.style = {};

        this.detail = new RegisterDetail();


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
        };
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

           // this.updateDetail(data){}
        };
        // this.setPorcentaje = function(key,value){
        //     this.porcentaje[key] = value;
        // }


        //comportamiento
        this.highlight = function () {
            //console.log("highlight" + this.departamento);
            this.destinations.forEach( function(index,element) {
                LeafletServices.polygons[element].highlight('destination');
            });
            LeafletServices.polygons[this.departamento].highlight('origin');
            // LeafletServices.polygons[this.departamento].focus();

        };

        this.unHighlight = function () {
            this.destinations.forEach( function(index,element) {
                LeafletServices.polygons[element].unHighlight();
            });
            LeafletServices.polygons[this.departamento].unHighlight();
        };

    };


    function cookOD(data){
      


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

        model.matriz.forEach(recorrer);

        function storeMax(key,element){
            if(model.max[key] < element[key]){
                model.max[key] = element[key]
            }
        };

        function recorrer(element,index){
            element.total_porcentaje = (element.total*100)/model.totales.total;

            storeMax('total',element);
            storeMax('subte',element);
            storeMax('colectivo',element);
            storeMax('tren',element);


        };

        //calcular medias
        model.medias.atributo = parseInt( model.totales.atributo / model.matriz.length);
        model.medias.transbordo = parseInt (model.totales.transbordo / model.matriz.length);
        

        //calcular el color de cada depto en funcion de su valor total de viajes 
        model.matriz.forEach(paintRecord);
        function calcTotalColor(param){
            var r = parseInt(param.map(0,model.max.total,model.colors.min.r,model.colors.max.r));
            var g = parseInt(param.map(0,model.max.total,model.colors.min.g,model.colors.max.g));
            var b = parseInt(param.map(0,model.max.total,model.colors.min.b,model.colors.max.b));
            return 'rgb('+r+','+g+','+b+')';
        };

        function paintRecord(element,index){

            element.style = {
                weight: 2,
                color: calcTotalColor(element.total),
                fillOpacity: 0.85,
                strokeOpacity:1
            };

        };

        //ordenar por totales la matriz
        model.matriz.sort(compareFunction)
        function compareFunction(a,b){
            return b.total - a.total ;
        };


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
