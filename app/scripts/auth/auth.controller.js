/**
 * Created by Admin on 29.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum.auth').controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService'];

    function AuthController(AuthService) {
        /* validthis: true */
        var vm = this;

        vm.login = AuthService.login;
        vm.register = AuthService.register;
        vm.facebook = AuthService.facebookLogin;
    }
}());