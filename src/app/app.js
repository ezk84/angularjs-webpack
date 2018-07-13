import '../style/main.less';
import '../style/app.css';

import angular from 'angular';
import TestService from './test.service';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  /**
   *
   * @param {TestService} testService
   */
  constructor(testService) {
    'ngInject'
    this.url = 'https://github.com/preboot/angular-webpack';
    testService.doSomething();
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .service('testService', TestService);

export default MODULE_NAME;
