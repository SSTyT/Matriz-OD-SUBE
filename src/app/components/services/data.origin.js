'use strict';
angular.module('matrizOdSube').factory('DataOrigin', ['$http', '$q','Tools','RegistroOrigenDestino',DataOrigin]);


function DataOrigin($http, $q,Tools,RegistroOrigenDestino) {

    $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    var urlZones       = 'assets/data/departamentos.geojson';
    var urlDiccionario = 'assets/data/diccionario.json';
    var urlMatriz      = 'assets/data/matriz.json';

    var urlColectivos  = 'assets/data/bondies.geojson';
    var urlTrenes      = 'assets/data/train.geojson';
    var urlSubte       = 'assets/data/subway.geojson';

    var bigTable = [] ; 
    var model = {
        departamentos : [],
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
        }
    };

    var getID = Tools.getID;
    var colors = Tools.colors; 

    function prepararDiccionario(dicc){
        var out = [] ;

        dicc.forEach(recorrer);
        function recorrer(element,index){
            //{"Cod_depto":882,"Departamento":"Z�rate","id":6882,"Provincia":"Buenos Aires","Cod_prov":6}
            out[element.id ] =  {
                dpto : element.Cod_depto,
                prov : element.Cod_prov,
                  id : element.id,
                lbl  : element.Departamento,
            };
        }

        return out;
    }

    function cookOD(data,diccionario){
        data.forEach( function(element) {
             var id = getID(element.prov_origen,element.depto_origen)
             //console.log(id);
             if (bigTable[id] ==  undefined) { 
                    bigTable[id] = new RegistroOrigenDestino(element,diccionario);
                    model.matriz.push(bigTable[id]);
                     model.departamentos.push(id);
             }
             else {
               bigTable[id].add(element)
             }
            //console.log("record: "+id+" added");
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
        model.medias.atributo_porcentaje = ( (model.medias.atributo*100)/model.totales.atributo);

        //porcentajs de medias para presentacion
        model.medias.transbordo = parseInt (model.totales.transbordo / model.matriz.length);
        model.medias.transbordo_porcentaje = ( (model.medias.transbordo*100)/model.totales.transbordo);


        model.matriz.forEach(calcPorcenjateAST);
        function calcPorcenjateAST(element,index){
            element.porcentaje.atributo  = (element.atributo*100)/model.totales.atributo;
            element.porcentaje.transbordo  = (element.transbordo*100)/model.totales.transbordo;
        }
        //calcular el color de cada depto en funcion de su valor total de viajes 
        model.matriz.forEach(paintRecord);

        function calcTotalColor(param,min,max){
            var lower,upper,r,g,b = 0 ;
            
            var module = max - min / 57; 

             if( param <= max*.5){
                r = parseInt((param/module).map(min/module,(max-min)/module,colors.min.r,colors.med.r));
                g = parseInt((param/module).map(min/module,(max-min)/module,colors.min.g,colors.med.g));
                b = parseInt((param/module).map(min/module,(max-min)/module,colors.min.b,colors.med.b));
            }else{
                r = parseInt((param/module).map(min/module,(max-min)/module,colors.med.r,colors.max.r));
                g = parseInt((param/module).map(min/module,(max-min)/module,colors.med.g,colors.max.g));
                b = parseInt((param/module).map(min/module,(max-min)/module,colors.med.b,colors.max.b));
            }
            return 'rgb('+r+','+g+','+b+')';
        }

        function paintRecord(element,index){

            element.style = {
                weight: 2,
                color: calcTotalColor(element.total,0,model.max.total),
                fillOpacity: 0.95,
                strokeOpacity:1,
                stroke:'red'
            };

            var totalDestinos = 0 ;

            for (var key in element.detail.destination) {
              if (element.detail.destination.hasOwnProperty(key))
                getMax(element.detail.destination[key]);
            }

            for (var key in element.detail.destination) {
              if (element.detail.destination.hasOwnProperty(key))
                pintarDestinos(element.detail.destination[key]);
            }

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

        model.matriz.forEach(function(element){
                
            element.detail.destinationSortedByID = Object.keys(element.detail.destination).sort(sortObject);
            function sortObject(a,b){
                return element.detail.destination[b].total - element.detail.destination[a].total ;
            }
        })

        function compareFunction(a,b){
            return b.total - a.total ;
        }

        console.log(model);
        Tools.setModel ( model);
        return model ; 
    };

    function getODData() {
        var promise = $q(function(success, reject) {
            var promises = [] ;

            promises.push($http.get(urlMatriz));
            promises.push($http.get(urlDiccionario));
            $q.all(promises).then(recordsHandler);
            function recordsHandler(data){
                success(cookOD(data[0].data,prepararDiccionario(data[1].data)));
            }
        });
        return promise;
    };

    function getZonas(){
        var promise = $q(function(success, reject) {
            $http.get(urlZones).success(function(res) {
                success(res.features);
            });
        });
        return promise;
    };

    function getDiccionario(){
        var promise = $q(function(success, reject) {
            $http.get(urlDiccionario).success(function(res) {
                success(res.features);
                //success(sortTheMotherfuckers(res,'depto'));
            });
        });
        return promise;
    };
    function getColectivos(){
                var promise = $q(function(success, reject) {
            $http.get(urlColectivos).success(function(res) {
                success(res.features);
                //success(sortTheMotherfuckers(res,'depto'));
            });
        });
        return promise;
    }

    function getSubtes(){
                var promise = $q(function(success, reject) {
            $http.get(urlSubte).success(function(res) {
                success(res.features);
                //success(sortTheMotherfuckers(res,'depto'));
            });
        });
        return promise;
    }

    function getTrenes(){
                var promise = $q(function(success, reject) {
            $http.get(urlTrenes).success(function(res) {
                success(res.features);
                //success(sortTheMotherfuckers(res,'depto'));
            });
        });
        return promise;
    }

    return {
        getColectivos  : getColectivos,
        getDiccionario : getDiccionario,
        getODData      : getODData,
        getSubtes      : getSubtes,
        getTrenes      : getTrenes,
        getZonas       : getZonas,
        record         : bigTable
    };
}
