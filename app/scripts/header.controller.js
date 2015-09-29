/**
 * Created by Admin on 29.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum').controller('HeaderController', HeaderController);

    HeaderController.$inject = ['AuthService'];

    function HeaderController (AuthService) {

        /* jshint validthis: true */
        var vm = this;

        vm.isAuthenticated = AuthService.isAuthenticated;
    }
}());