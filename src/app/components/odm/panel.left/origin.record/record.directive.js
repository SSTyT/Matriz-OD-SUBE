"use strict";
var odRecord = {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        //template: '<ng-map class="filtre--l"  disable-default-u-i="true" center="-34.628767838201036,-58.542341058691335" zoom="12" styles=\'[{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]\'> </ng-map>',
        templateUrl: 'app/components/odm/panel.left/origin.record/record.tpl.html',
        replace: true,
        bindings: {
            record: '<',
            model: '<',
            odm: '=',
        },
        controller: 'odRecordController'
    };

angular.module('matrizOdSube').component('odRecord',odRecord);
angular.module('matrizOdSube').controller('odRecordController', ['$timeout','$scope',odRecordController]);
function odRecordController ($timeout,$scope){
    this.show = "Total: " + this.record.total+" viajes ";
    this.hover = function(field){
        console.log("call me ");
        console.log($scope);

        if (field == 'total'){
              this.show = field+" " + this.record[field]+" viajes ";
        }else{

            this.show = field+" " + this.record.porcentaje[field].toFixed(1)+" %";
        }
    }
}
    

