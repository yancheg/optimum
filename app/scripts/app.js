/**
 * Created by Admin on 28.09.15.
 */

(function(){
    'use strict';

    angular.module('optimum', ['ngAnimate', 'toastr', 'optimum.routes', 'optimum.auth', 'optimum.users']);

    angular.module('optimum').config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('ErrorInterceptor');
    }]);

    angular.module('optimum').run(['$rootScope', 'toastr', function($rootScope, toastr) {
        $rootScope.$on('loading-error', function(rejection) {
            toastr.error('loading-error', "Probably server is down!");
        });
    }]);

}());
