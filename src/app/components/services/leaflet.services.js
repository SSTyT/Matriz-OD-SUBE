angular.module('matrizOdSube').factory('LeafletServices', ['$timeout','$http','$q' , leafletServices]);

function leafletServices($timeout,$http,$q){
	service = this ;
	service.OSM;
	service.map;
	service.polygons = [] ;
	service.currentPairs = [] ;
	service.highlightStyle = {
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

	function get_polygon_centroid(pts) {
	   var first = pts[0], last = pts[pts.length-1];
	   if (first[0] != last[0] || first[1] != last[1]) pts.push(first);
	   var twicearea=0,
	   x=0, y=0,
	   nPts = pts.length,
	   p1, p2, f;
	   for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
	      p1 = pts[i]; p2 = pts[j];
	      f = p1[0]*p2[1] - p2[0]*p1[1];
	      twicearea += f;          
	      x += ( p1[0] + p2[0] ) * f;
	      y += ( p1[1] + p2[1] ) * f;
	   }
	   f = twicearea * 3;
	   return { lng:x/f, lat:y/f };
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
		
		self.id = parseInt(data.geometry.properties.depto);
		self.polygon = L.geoJson(data.geometry,{
			style:self.style,
		 	className:data.geometry.properties.depto+" departamento animated",
 		  	onEachFeature: function (feature, layer) {
					layer.on('click',clickHandler);
			     	function clickHandler(event){		
			     	 	 event.originalEvent.preventDefault();
			        	console.log(feature.properties);
			        	openCallBack(parseInt(data.geometry.properties.depto));
			      	}

					var popup = L.popup()
					    .setLatLng(self.centroid)
						//.setLatLng(layer.getBounds().getCenter())
					    .setContent('<p> '+data.geometry.properties.departamen+'<br/>  </p>');
					
					//layer.bindPopup(popup);
			        layer.on('mouseover', function (e) {
			            self.polygon.openPopup();
			          if (service.currentPairs.length == 0 )  self.polygon.bringToFront();
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

	function clearPairs(){
		service.currentPairs.forEach(cleanCurrent);

		function cleanCurrent(element){
			service.map.removeLayer(element)
		}
	}

	function drawPairs(pairs){
		clearPairs();
		service.currentPairs = [] ; 
		pairs.forEach(draw);
		function draw(element,index){

			if (element.points[0] === element.points[1]){
				var circle = L.circleMarker(element.points[0], element.style).addTo(service.map);
				service.currentPairs.push( circle);
			}else{	
				var path = L.polyline(element.points, element.style).addTo(service.map);
				service.currentPairs.push( path);	
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