(function() {
  'use strict';

  angular
    .module('matrizOdSube', [ 'ngResource', 'ui.router','nvd3' ])    .filter('int', function() {
        function numberWithCommas(x) {
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        }
    return function(input) {
      if (parseInt(0 + input) === 0) {
        return '0';
      } else {
        var out = numberWithCommas(parseInt(0 + input).toFixed(0)).replace(/\./g, '*');
        out = out.replace(/,/g, '.');
        return out.replace(/\*/g, ',');
      }
    };
  });

})();
