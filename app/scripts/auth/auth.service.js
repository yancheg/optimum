/**
 * Created by Admin on 29.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum.auth').factory('AuthService', AuthService);

    AuthService.$inject = ['$q', 'webStorage', '$http', 'toastr', '$state', '$filter'];

    function AuthService($q, webStorage, $http, toastr, $state, $filter) {
        var user,
            users;

        /* Init components for local checkin */
        user = webStorage.has('user') ? JSON.parse(webStorage.get('user')) : null;
        if( webStorage.has('users') ) {
            users = JSON.parse(webStorage.get('users'));
        } else {
            $http.get('/data/auth.json').success(function(data){
                users = data;
                webStorage.set('users', JSON.stringify(data));
            });
        }

        return {
            isAuthenticated: isAuthenticated,
            hasAccess: hasAccess,
            login: login,
            logout: logout,
            register: register,
            watchAuthenticationStatusChange: watchAuthenticationStatusChange
        };

        function grantAccess() {
            return ( user && ("admin" == user.role));
        }

        function isAuthenticated() {
            return !!user;
        }

        function hasAccess (role) {
            if(grantAccess()) {
                return true;
            }

            return (user && user.role==role);
        }

        /*
         * Here should be server request for authentication access
         * but test app uses local-storage for user jobs,
         * so here just credentials checks with storages info
         * but you can emulate server request with error checkbox
         */
        function login (data) {
            if(data.error) {
                return $http({
                    method: 'POST',
                    url: '/api/login',
                    data: data
                });
            }else {
                var tmp = $filter('getByEmail')(users,data.email);

                if(tmp) {
                    if(tmp.password !== data.password) {
                        toastr.error("Error!", "Password incorrect!");
                        return false;
                    }

                    user = tmp;
                    if(!!data.remember) {
                        webStorage.set('user', JSON.stringify(user));
                    }
                    $state.go('users');
                } else {
                    toastr.info("User Not Found!");
                    return false;
                }

            }


        }

        function logout () {
            user = null;
            webStorage.remove('user');
            FB.logout();
        }

        function register (data) {

            var tmp = $filter('getByEmail')(users,data.email);

            if(tmp) {
                toastr.error("Error!", "Email already exists!");
                return false;
            }


            $state.go('users');
        }

        function watchAuthenticationStatusChange() {

            FB.Event.subscribe('auth.authResponseChange', function(res) {
                if (res.status === 'connected') {
                    getUserInfo();
                }
                else {
                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                     */
                }
            });
        }

        function getUserInfo() {
            FB.api('/me', function(res) {
                user = res;
                user.role = "user";
                webStorage.set('user', JSON.stringify(res));
                toastr.success("Facebook!", "You've sign uped successfully");
                $state.go('users');
            });
        }
    }

    angular.module('optimum.auth').filter('getByEmail', function() {
        return function(input, email) {
            var i=0, len=input.length;
            for (; i<len; i++) {
                if (input[i].email == email) {
                    return input[i];
                }
            }
            return null;
        };
    });
}());