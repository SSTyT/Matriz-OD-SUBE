(function() {
  'use strict';

  angular
    .module('matrizOdSube')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/components/odm/odm.tpl.html',
        controller: 'ODMController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
