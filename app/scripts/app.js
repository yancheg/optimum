/**
 * Created by Admin on 28.09.15.
 */

(function(){
    'use strict';

    angular.module('optimum', ['ngAnimate', 'toastr', 'optimum.routes', 'optimum.auth', 'optimum.users']);

    angular.module('optimum').config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('ErrorInterceptor');

        $httpProvider.interceptors.push(HttpInterceptor);

        HttpInterceptor.$inject = ['$q', 'webStorage'];

        function HttpInterceptor($q, webStorage) {
            return {
                'request': function(config) {

                    if(webStorage.has('token')) {
                        config.headers.Token = webStorage.get('token');
                    }
                    return config;
                }
            };
        }
    }]);

    angular.module('optimum').run(['$rootScope', 'toastr', function($rootScope, toastr) {
        $rootScope.$on('loading-error', function(rejection) {
            toastr.error('loading-error', "Probably server is down!");
        });
    }]);

}());
