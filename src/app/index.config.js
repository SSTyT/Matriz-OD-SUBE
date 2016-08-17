(function() {
  'use strict';

  angular
    .module('matrizOdSube')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
