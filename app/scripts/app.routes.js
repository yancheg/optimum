/**
 * Created by Admin on 28.09.15.
 */

(function(){
    'use strict';

    angular.module('optimum.routes', ['ui.router']);

    angular.module('optimum.routes').constant('ACCESS.LEVEL', {
        public : 'user',
        admin  : 'admin'
    });

    angular.module('optimum.routes').config(RouterConfig);

    RouterConfig.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider', 'ACCESS.LEVEL'];

    function RouterConfig($urlRouterProvider, $stateProvider, $locationProvider, ACCESS) {
        $urlRouterProvider.otherwise('/');
/*        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');*/

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "views/homepage.html"
            })
            .state('users', {
                url: "/users/{page}",
                templateUrl: "scripts/users/views/list.html",
                controller: "UsersController",
                controllerAs: "vm",
                data: {
                    access: ACCESS.public
                },
                resolve: {
                    offset: ['$stateParams', function($stateParams){
                        return parseInt((($stateParams.page || 1) - 1) * 25) || 0;
                    }],
                    users: ['UserService', 'offset', function(UserService, offset) {
                        return UserService.getUsersList(offset);
                    }],
                    usersCount: ['UserService', function(UserService) {
                       return UserService.getUsersCount();
                    }]
                }
            })
            .state('login', {
                url: "/login",
                controller: 'AuthController',
                controllerAs: 'vm',
                templateUrl: "scripts/auth/views/login.html",
                resolve: {
                    auth: ['AuthService', '$state', 'toastr', '$q', '$timeout', function(AuthService, $state, toastr, $q, $timeout) {
                        var deferred = $q.defer();

                        $timeout(function() {
                            if (AuthService.isAuthenticated()) {
                                $state.go('users');
                                toastr.info("Already signed up!");
                                deferred.reject();
                            } else {
                                deferred.resolve();
                            }
                        });

                        return deferred.promise;
                    }]
                }
            })
            .state('register', {
                url: "/reg",
                controller: 'AuthController',
                controllerAs: 'vm',
                templateUrl: "scripts/auth/views/register.html",
                resolve: {
                    auth: ['AuthService', '$state', 'toastr', '$q', '$timeout', function(AuthService, $state, toastr, $q, $timeout) {
                        var deferred = $q.defer();

                        $timeout(function() {
                            if (AuthService.isAuthenticated()) {
                                $state.go('users');
                                toastr.info("Already signed up!");
                                deferred.reject();
                            } else {
                                deferred.resolve();
                            }
                        });

                        return deferred.promise;
                    }]
                }
            })
            .state('logout', {
                url: "/logout",
                controller: ['AuthService', '$state', function(AuthService, $state) {
                    AuthService.logout();
                    $state.go('home');
                }]
            })
            .state('create', {
                url: "/api/users/create",
                resolve: {
                    data: ['UserService', function(UserService){
                        return UserService.createUser(0);
                    }]
                }
            });
    }

    /* Catch route changes errors && Check for routes Access
     */
    RoutesRun.$inject = ['$rootScope', '$state', 'toastr', 'AuthService'];

    angular.module('optimum.routes').run(RoutesRun);

    function RoutesRun($rootScope, $state, toastr, AuthService) {
        var handlingRouteChangeError = false;
        $rootScope.$on('$stateChangeError',
            function(event, current, previous, rejection) {
                console.log(arguments);
                if (handlingRouteChangeError) { return; }
                handlingRouteChangeError = true;
                var destination = (current && (current.title ||
                    current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' +
                    (rejection.msg || '');

                toastr.warning(msg, rejection);

                $state.go('home');
            }
        );

        $rootScope.$on('$stateChangeStart',
            function(event, current, previous, rejection) {
                if(current && current.data && current.data.access) {
                    if(!AuthService.hasAccess(current.data.access)) {
                        toastr.error("Error!", "Access denied!");
                        event.preventDefault();

                        if(AuthService.isAuthenticated()) {
                            $state.go('home');
                        } else {
                            $state.go('login');
                        }
                    }
                }
            }
        );
    }
}());