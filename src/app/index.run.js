(function() {
  'use strict';

  angular
    .module('matrizOdSube')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
