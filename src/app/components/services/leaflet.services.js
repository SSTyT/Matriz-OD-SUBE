angular.module('matrizOdSube').factory('LeafletServices', ['$timeout','$http','$q' , leafletServices]);

function leafletServices($timeout,$http,$q){
	service = this ;
	service.OSM;
	service.map;
	service.polygons = [] ;

	service.highlightStyle = {
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
		return service.map;
	}

	function getLayers(){
		return service.OSM;
	}

    // function genStyle(){
    //     function randomChannel(){return parseInt((Math.random()*255));}
    //     var myStyle = {
    //         "color": "rgba("+randomChannel()+","+randomChannel()+","+randomChannel()+",1)",
    //         "weight": 1,
    //         "opacity": 0.95
    //     }
    //     return myStyle;
    // }

	function initMap(data){

		var promise = $q(function (success,fail){
            //service.OSM = L.tileLayer.provider('OpenStreetMap.HOT');
            service.OSM = L.tileLayer.provider('OpenStreetMap');
            service.map = L.map('map', {
                zoomControl: false,
                center: [-34.69759025633039, -58.627166748046875],
                layers: service.OSM,
                zoom: 9
            });
            service.OSM.on("load", function callmeOnce() {
               	success(service.map);
                service.OSM.off("load", callmeOnce);
            });



            service.map.on("zoomend", function () {
       			service.polygons.forEach( function(element, index) {
       			

					if (element.id <= 15){
						console.log(element);
	       				if (service.map.getZoom() <= 10){
	       					element.setTinyIcon();
	       				}else{
	       					element.setIcon();
	       				}
					}

       			});
            });

		});
            return promise ; 
	}

	function Polygon(data,openCallBack){
		var self = this;
		self.style = data.style; 
		//self.anchorPoint = getUpperPoint(data.geometry);
		
		self.id = parseInt(data.geometry.properties.depto);
		self.polygon = L.geoJson(data.geometry,{
			style:self.style,
		 	className:data.geometry.properties.depto+" departamento animated",
 		  	onEachFeature: function (feature, layer) {

					//.bindLabel('Look revealing label!')
			  		//layer.bindLabel(feature.properties.depto, { 'noHide': true }).addTo(service.map);
		     		layer.on('click',clickHandler);
			     	function clickHandler(){			          
			        	console.log(feature.properties);
			        	openCallBack(parseInt(data.geometry.properties.depto));
			      	}

			      	//console.log("popup center");
			      	//console.log(layer.getBounds().getCenter());

					var popup = L.popup()
					    //.setLatLng(poly.anchorPoint)
						.setLatLng(layer.getBounds().getCenter())
					    .setContent('<p>Departamento '+parseInt(data.geometry.properties.depto)+'<br/>  </p>');
					
					layer.bindPopup(popup);
			        layer.on('mouseover', function (e) {
			           // self.polygon.openPopup();
			            self.polygon.bringToFront();
			        });
			        // layer.on('mouseout', function (e) {
			        //     self.closePopup();
			        // });
				}
		}).addTo(service.map);

		self.focus = function () {
			service.map.fitBounds(self.polygon.getBounds());

       		//service.map.setView(self.polygon.getBounds().getCenter());
			service.map.zoomOut();
		}
		self.highlight = function (type,style) {
            self.polygon.setStyle(style);
		}
		self.unHighlight = function () {
			self.polygon.setStyle(self.style);
		}


		self.hideMarker = function (){
			service.map.removeLayer(self.marker);
		}

		self.showMarker = function (){
			self.marker.addTo(service.map);
		}




		var icon = L.divIcon({
			className: 'polygon-marker'+data.geometry.properties.depto,
			html:	'<div class="marker-content">'+
						'<div class="marker-border">'+
							parseInt(data.geometry.properties.depto)+
						'</div>'+
					'<div>'
		});
		var tinyIcon = L.divIcon({
			className: 'polygon-marker '+data.geometry.properties.depto,
			html:	'<div class="marker-content-tiny">'+
						'<div class="marker-border">'+
							parseInt(data.geometry.properties.depto)+
						'</div>'+
					'<div>'
		});
		
			// you can set .my-div-icon styles in CSS

		self.marker = L.marker(self.polygon.getBounds().getCenter(), {icon: (service.map.getZoom()<=10)? icon:tinyIcon}).on('click',function(){
			openCallBack(parseInt(data.geometry.properties.depto));
		}).addTo(service.map);



		self.setTinyIcon = function (){
			self.marker.setIcon(tinyIcon);
		}
		self.setIcon = function (){
			self.marker.setIcon(icon);
		}

		function getUpperPoint(data){

			var out = [0,0] ;
			data.geometry.coordinates[0][0].forEach(findAnchor);

			function findAnchor(element,index){
				//console.log(element);
				if (out[0] > element[0]){
					out = element ;
				}
			}

			return out;
		}

	}

	function drawPoly(data,openCallBack){
		
		service.polygons[parseInt(data.geometry.properties.depto)] = new Polygon(data,openCallBack) ;

		//console.log("polygon: "+ data.geometry.properties.depto+ "    added");
 		//L.circleMarker(polygon.getBounds().getCenter()).bindLabel( data.properties, {noHide:true}).addTo(service.map);
		//polygon.bindLabel()
		 //label = new L.Label(data.geometry.properties.depto).addTo(service.map);
		// label.setContent(data.geometry.properties.depto);
		// label.setLatLng(polygon.getBounds().getCenter());
		// map.showLabel(label);
	}



	function drawPath(data){
		


		L.geoJson(data.geometry).addTo(service.map);
	}

	return {
		initMap   : initMap,
		getMap    : getMap,
		getLayers : getLayers,
		drawPoly  : drawPoly,
		drawPath  : drawPath,
		polygons  : service.polygons
	} ;

}