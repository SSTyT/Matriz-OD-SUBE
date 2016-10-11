angular.module('matrizOdSube').factory('LeafletServices', ['$timeout','$http','$q' ,'Tools', leafletServices]);

function leafletServices($timeout,$http,$q,Tools){
	service = this ;
	service.OSM;
	service.map;
	service.polygons = [] ;
	service.currentEdges = [] ;


	var getID = Tools.getID ; 


	function getMap(){
		return service.map;
	}

	function getLayers(){
		return service.OSM;
	}

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
       				element.restoreIcon()
       			});
            });

		});
            return promise ; 
	}

	function Polygon(data,openCallBack){
		var self = this;
		self.style = data.style; 
		//self.centroid = get_polygon_centroid(data.geometry.geometry.coordinates[0][0]);
		self.centroid = {lat:data.geometry.properties.y_centroid,lng:data.geometry.properties.x_centroid};
		
		self.id =  getID(data.geometry.properties.prov,data.geometry.properties.depto);
		self.polygon = L.geoJson(data.geometry,{
			style:self.style,
		 	className:data.geometry.properties.depto+" departamento animated",
 		  	onEachFeature: function (feature, layer) {
					layer.on('click',clickHandler);
			     	function clickHandler(event){		
			     	 	 event.originalEvent.preventDefault();
			        	console.log(feature.properties);
			        	openCallBack(self.id);
			      	}

					var popup = L.popup()
					    .setLatLng(self.centroid)
						//.setLatLng(layer.getBounds().getCenter())
					    .setContent('<p> '+data.geometry.properties.departamen+'<br/>  </p>');
					
					//layer.bindPopup(popup);
			        layer.on('mouseover', function (e) {
			            self.polygon.openPopup();
			          if (service.currentEdges.length == 0 )  self.polygon.bringToFront();
			        });
			        
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
			iconSize : [30,30],
			className: 'polygon-marker'+data.geometry.properties.depto,
			html:	'<div class="marker-content">'+
						'<div class="marker-border">'+
							self.id+
						'</div>'+
					'<div>'
		});

		var iconDestino = L.divIcon({
			iconSize : [30,30],
			className: 'polygon-marker destino'+data.geometry.properties.depto,
			html:	'<div class="marker-content">'+
						'<div class="marker-border">'+
							self.id+
						'</div>'+
					'<div>'
		});
		
		var tinyIcon = L.divIcon({
			className: 'polygon-marker '+data.geometry.properties.depto,
			html:	'<div class="marker-content-tiny">'+
						'<div class="marker-border">'+
							self.id+
						'</div>'+
					'<div>'
		});
		var hiddenIcon = L.divIcon({
			className: 'polygon-marker '+data.geometry.properties.depto,
			html:	'<div class="marker-content-tiny">'+
						'<div class="marker-border">'+
						'</div>'+
					'<div>'
		});
		
			// you can set .my-div-icon styles in CSS

		self.marker = L.marker(self.centroid, {icon: (data.geometry.properties.depto <= 15 && service.map.getZoom()<=10)? tinyIcon:icon}).on('click',function(){
			openCallBack(parseInt(data.geometry.properties.depto));
		}).addTo(service.map);



		self.setTinyIcon = function (){
			self.marker.setIcon(tinyIcon);
		}
		self.setIcon = function (){
			self.marker.setIcon(icon);
		}
		self.setHiddenIcon = function (){
			self.marker.setIcon(hiddenIcon);	
		}

		self.restoreIcon = function (){
			if (self.id <= 15){
				if (service.map.getZoom() <= 10){
					self.setTinyIcon();
				}else{
					self.setIcon();
				}
			}
			else{
				self.setIcon();
			}		
			//self.marker.setIcon(icon);
		}

	}

	function drawPoly(data,openCallBack){

		service.polygons[getID(data.geometry.properties.prov,data.geometry.properties.depto)] = new Polygon(data,openCallBack) ;
	}

	function clearPairs(){
		service.currentEdges.forEach(cleanCurrent);

		function cleanCurrent(element){
			service.map.removeLayer(element)
		}
	}

	function drawPairs(pairs){
		clearPairs();
		service.currentEdges = [] ; 
		pairs.forEach(draw);
		function draw(element,index){

			if (element.points[0] === element.points[1]){
				var circle = L.circleMarker(element.points[0], element.style).addTo(service.map);
				service.currentEdges.push( circle);
			}else{	
				var path = L.polyline(element.points, element.style).addTo(service.map);
				service.currentEdges.push( path);	
			}
		}
	}
	

	function drawPath(data){
		


		L.geoJson(data.geometry).addTo(service.map);
	}

	return {
		initMap    : initMap,
		getMap     : getMap,
		getLayers  : getLayers,
		drawPoly   : drawPoly,
		drawPath   : drawPath,
		drawPairs  : drawPairs,
		clearPairs : clearPairs,
		polygons   : service.polygons
	} ;

}