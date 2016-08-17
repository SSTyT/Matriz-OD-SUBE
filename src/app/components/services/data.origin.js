angular.module('matrizOdSube').factory('DataOrigin', [
    '$http', '$q',DataOrigin

])


    function DataOrigin($http, $q) {

        $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        var urlZones = ' assets/zonas.geojson'
          



        function ODModel(mapa) {

        }


        function getZonas(){

            var promise = $q(function(success, reject) {
                //if (cortesCache !== undefined)
                // { success(cortesCache); } 
                //else 
                //{
                    $http.get(urlZones).success(function(res) {
                      //  bakeCortes(mapa, res);
                        //$q.all(promises).then(function() {
                            success(res);
                        //});
                    });
              //  }
            });

            return promise;
        }

        function getODData (argument) {
             // body...  
        }

        return {
            getODData : getODData,
            getZonas : getZonas 
        };
    }

/*
{
    "result": "ok",
    "afectaciones": [{
        "id": 3,
        "lat": "-34.602292",
        "lng": "-58.375199",
        "afectacion_id": 3
    }, {
        "id": 3,
        "lat": "-34.602204",
        "lng": "-58.373913",
        "afectacion_id": 3
    }, {
        "id": 4,
        "lat": "-34.601173778736",
        "lng": "-58.376712799072",
        "afectacion_id": 3
    }]
}
*/
