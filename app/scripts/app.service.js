/**
 * Created by Admin on 29.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum').factory('ErrorInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
        return {

            requestError: function (rejection) {
                $rootScope.$broadcast('loading-error', rejection);
                return $q.reject(rejection);
            },

            responseError: function (rejection) {
                $rootScope.$broadcast('loading-error', rejection);
                return $q.reject(rejection);
            }
        };
    }]);
}());