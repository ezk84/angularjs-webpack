export default class TestService {
    constructor($window) {
        'ngInject'
        this.message = 'The test';
        this.$window = $window;
    }

    doSomething() {
        this.message = 'Something else';
        // this.$window.alert(`the message is ${this.message}`);
    }
}

