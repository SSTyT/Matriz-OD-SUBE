angular.module('matrizOdSube').factory('LeafletServices', ['$http','$q',  leafletServices]);




function leafletServices($http,$q){
	self = this ;
	self.OSM;
	self.map;
	self.polygons = [] ;

/*
    stroke: rgba(91, 147, 61, 0.8);
    stroke-opacity: 0.75;
    stroke-width: 1;
    fill: rgba(91, 147, 61, 0.8);
    fill-opacity: 0.2;
*/

	self.highlightStyle = {
		// origin : {
		// 	color: 'rgb(0,0,0)',
		// 	opacity: 1 ,
		// 	weight: 5 
		// },
		origin : {
			color: 'rgb(0,0,0)',
			opacity: 1 ,
			weight: 5 
		},
		destination : {
		color: 'rgb(128,128,128)',
		opacity: 1 ,
		weight: 2 
		}
	};



	function getMap(){
		return self.map;
	}

	function getLayers(){
		return self.OSM;
	}

    function genStyle(){
        function randomChannel(){return parseInt((Math.random()*255));}
        var myStyle = {
            "color": "rgba("+randomChannel()+","+randomChannel()+","+randomChannel()+",1)",
            "weight": 1,
            "opacity": 0.95
        }
        return myStyle;
    }

	function initMap(data){

		var promise = $q(function (success,fail){
            self.OSM = L.tileLayer.provider('OpenStreetMap.HOT');
            self.map = L.map('map', {
                zoomControl: false,
                center: [-34.6192103, -58.429606],
                layers: self.OSM,
                zoom: 12
            });
            self.OSM.on("load", function callmeOnce() {
               	success(self.map);
                self.OSM.off("load", callmeOnce);
            });
		});


            return promise ; 
	}



	function Polygon(data){

		this.style = genStyle(); 
		this.polygon = L.geoJson(data.geometry,{
			style:this.style,
		 	className:data.geometry.properties.depto,
 		  	onEachFeature: function (feature, layer) {

					//.bindLabel('Look revealing label!')
			  		//layer.bindLabel(feature.properties.depto, { 'noHide': true }).addTo(self.map);
		     		layer.on('click',clickHandler);
			     	function clickHandler(){			          
			        	console.log(feature.properties);
			      	}
				}
		}).addTo(self.map);

		this.highlight = function (type) {
            this.polygon.setStyle(self.highlightStyle[type]);
		}
		this.unHighlight = function () {
			this.polygon.setStyle(this.style)
		}


	}

	function drawPoly(data){
		
		self.polygons[parseInt(data.geometry.properties.depto)] = new Polygon(data) ;

		//console.log("polygon: "+ data.geometry.properties.depto+ "    added");
 		//L.circleMarker(polygon.getBounds().getCenter()).bindLabel( data.properties, {noHide:true}).addTo(self.map);
		//polygon.bindLabel()
		 //label = new L.Label(data.geometry.properties.depto).addTo(self.map);
		// label.setContent(data.geometry.properties.depto);
		// label.setLatLng(polygon.getBounds().getCenter());
		// map.showLabel(label);
	}

	return {
		initMap   : initMap,
		getMap    : getMap,
		getLayers : getLayers,
		drawPoly  : drawPoly,
		polygons  : self.polygons
	} ;

}