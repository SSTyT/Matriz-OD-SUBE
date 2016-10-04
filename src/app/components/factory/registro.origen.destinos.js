'use strict';
angular.module('matrizOdSube').factory('RegistroOrigenDestino', ['$http', '$q','Tools','LeafletServices',RegistroOrigenDestino]);

function RegistroOrigenDestino($http,$q,Tools,LeafletServices) {

    //helpers

    var getID = Tools.getID;
    var colors = Tools.colors; 
    var model = Tools.model;
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
            this.id = getID(data.prov_destino,data.depto_destino);
            this.atributo = data.cantidad_as ;
            this.colectivo = data.cantidad_bus ;
            this.subte = data.cantidad_subte ;
            this.transbordo = data.cantidad_transbordo ;
            this.tren = data.cantidad_tren ;
            this.total =  data.cantidad_bus + data.cantidad_subte + data.cantidad_tren ;
            this.departamento = parseInt(data.depto_destino);
            this.hour = new HourRegister();

            this.add = function (data){
                this.atributo += data.cantidad_as ;
                this.colectivo += data.cantidad_bus ;
                this.subte += data.cantidad_subte ;
                this.transbordo += data.cantidad_transbordo ;
                this.tren += data.cantidad_tren ;
                this.total +=  data.cantidad_bus + data.cantidad_subte + data.cantidad_tren ; 
                this.hour.update(data);   
                this.updatePorcentajes() ;           
            };

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
        }

        this.destinationsByHour = [] ;
        this.destination = {};
        this.destinationID = [];
        this.destinationSortedByID = [] ;

        this.update = function (data){

             var id = getID(data.prov_destino,data.depto_destino);
            if (this.destination[id] === undefined){
                this.destination[id] = new DestinationRegister(data);  
                this.destinationID.push(id);
            }
            else{
                this.destination[id].add(data);
           }
       }

    }

    var ODRegister = function (data,diccionario){
        var self = this;
        this.atributo = data.cantidad_as ;
        this.colectivo = data.cantidad_bus ;
        this.subte = data.cantidad_subte ;
        this.transbordo = data.cantidad_transbordo ;
        this.tren = data.cantidad_tren ;
        this.departamento = data.depto_origen ;
        this.id = getID(data.prov_origen,data.depto_origen) ; 
        this.nombre = diccionario[this.id].lbl ; 

        this.provincia = data.prov_origen ;
        this.total =  data.cantidad_bus+data.cantidad_subte +data.cantidad_tren;
        this.total_porcentaje = 0 ;

        this.style = {};
        this.detail = new RegisterDetail();
        this.hour = new HourRegister();

        this.porcentaje = {
            colectivo : 0,
            subte : 0,
            tren : 0,
            transbordo: 0,
            atributo: 0,
        };

        this.updatePorcentajes = function (){
            this.porcentaje.tren = ((this.tren*100)/this.total);
            this.porcentaje.colectivo = ((this.colectivo*100)/this.total);
            this.porcentaje.subte = ((this.subte*100)/this.total);
        };

        this.add = function (data){
            this.atributo += data.cantidad_as ;
            this.colectivo += data.cantidad_bus ;
            this.subte += data.cantidad_subte ;
            this.transbordo += data.cantidad_transbordo ;
            this.tren += data.cantidad_tren ;
            this.total += data.cantidad_bus+data.cantidad_subte +data.cantidad_tren ;
            this.updatePorcentajes();
            this.detail.update(data);
            this.hour.update(data);

        };

        this.calcEdges = function calcEdges(){
            var origin = LeafletServices.polygons[this.id].centroid;
            var collection = this.detail.destinationSortedByID ; 

            var i = 0 ;
            var top = 5 ;
            var edges = [] ;
            var radiusMax = 20 ;
            var radiusMin = 15 ;
            var maxWeight = 40 ;
            var minWeight = 5  ;

            var total =0 ;
            var h = 0 ;
            while (h < top && h <  collection.length-1){
                h++;
                total += this.detail.destination[collection[h]].total;
            }

            function calcWeight(destination,totalWeight,type){

                if (type == 'white')
                    {return totalWeight + 4;}
                else
                    {return  (totalWeight * destination.porcentaje[type])/100.0;}
            }

            function calcOffset(destination,weigth,type){
                var out = 0;
                var base = -(weigth*.5);
                //var base = 0;

                if ( type == 'white' ){
                      out =  0; 
                }else if ( type == 'colectivo' ){
                    out =  base + ( calcWeight(destination,weigth,'colectivo')*.5) ; 
                }else if ( type == 'subte' ){
                    //out=30;
                    out = base +( calcWeight(destination,weigth,'colectivo') +calcWeight(destination,weigth,'subte')*.5 +1);
                }else{
                    out = base + (calcWeight(destination,weigth,'colectivo') + calcWeight(destination,weigth,'subte') +calcWeight(destination,weigth,'tren')*.5 )+1;   
                }

                return out;
            }

            function map_range(value, low1, high1, low2, high2){
                return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
            }

            function getTypification(destination){
                var out = "";
                if (destination.colectivo >= destination.tren  ){
                    if(destination.colectivo >= destination.subte){
                       out = 'colectivo' ;
                    }else{
                        out  =  'subte' ;
                    }
                }else{
                    if(destination.tren >= destination.subte){
                        out = 'tren';
                    }
                    else{
                        out='subte';
                    }
                }
                return out;
            }
            function getColor(type){
                var  col  =  colors[type] ;
                return 'rgb('+col.r+','+col.g+','+col.b+')'
            }

            function map(current,total,min,max) {
                var val = ((current*100)/total); 
                return map_range(val,0,100,min,max);
            }

            function circleStyle(destination,total){
                return {
                    color: getColor(getTypification(destination)),
                    fillColor: getColor(getTypification(destination)),
                    fillOpacity: 0.8,
                    strokeOpacity:1,
                    radius : map(destination.total,total,radiusMin,radiusMax),
                    className:'circle '+getTypification(destination)
                }
            }

            function edgeStyle(destination,total,type){
                var totalWeight =  map(destination.total,total,minWeight,maxWeight);
                var computedStyle = {
                    color: getColor(type),
                    fillColor: getColor(type),
                    fillOpacity: 1,
                    weight:calcWeight(destination,totalWeight,type),
                    className:'edge '+type,
                    offset: calcOffset(destination,totalWeight,type)
                }; 
                return  computedStyle ;
            }

            var circle = '';
            while (i < top && i <  collection.length-1) {
                var destination = LeafletServices.polygons[collection[i]].centroid ; 
                var destination_record = this.detail.destination[collection[i]];

                if (origin === destination){
                    circle = {
                        points:[origin,destination],
                        style:circleStyle(destination_record,total) 
                    }
                }else{
                    edges.push({points:[origin,destination],style: edgeStyle(destination_record,total,'white') }); 
                    edges.push({points:[origin,destination],style: edgeStyle(destination_record,total,'colectivo') }); 
                    edges.push({points:[origin,destination],style: edgeStyle(destination_record,total,'subte') }); 
                    edges.push({points:[origin,destination],style: edgeStyle(destination_record,total,'tren') }); 
                }
                i++;
            }

            edges.push(circle);
            return edges;  
        }

        this.highlight = function () {
            console.log("highlight" + this.departamento);
            LeafletServices.drawPairs(this.calcEdges());

            model = Tools.getModel();
            model.departamentos.forEach(paintPolygons);
            function paintPolygons(element,index){
                var style = {} ; 
                var current = LeafletServices.polygons[element] ; 
                    if ( self.detail.destination[element] !== undefined)
                        {
                            style = self.detail.destination[element].style;
                            current.highlight('destination',style);
                            current.restoreIcon();
                         }
                    else
                        {
                            style ={
                                weight: 2,
                                color: 'rgb(230,230,230)',
                                fillOpacity: 0.95,
                                strokeOpacity:1
                            };
                            current.highlight('destination',style);
                            current.setHiddenIcon();
                    }
            }
        };

        this.unHighlight = function (current) {
                model.departamentos.forEach(normalizePolygons);
                LeafletServices.clearPairs();
                function normalizePolygons(element,index){
                    LeafletServices.polygons[element].unHighlight();
                    LeafletServices.polygons[element].restoreIcon();
                }
        }
    };

    return  ODRegister;
}
