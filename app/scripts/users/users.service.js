/**
 * Created by Admin on 28.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum.users').factory('UserService', UserService);

    UserService.$inject = ['$q','$http','toastr', 'webStorage', '$filter'];

    function UserService($q, $http, toastr, webStorage, $filter) {
        var users;

        if( webStorage.has('usersList') ) {
            users = JSON.parse(webStorage.get('usersList'));
        }

        return {
            getUsersCount:  getUsersCount,
            getUsersList:   getUsersList,
            updateUser:     updateUser,
            filterUsers:    filterUsers
        };

        function filterUsers(search) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: './data/users.json'
            }).success(function(data){
                var arr = $filter('filter')(data, { $: search});
                defer.resolve(arr);
            }).error(function(data){
                defer.reject(data);
            });
            return defer.promise;
        }

        function getUsersList(offset) {
            var defer = $q.defer();
            if(users && users.length>0) {
                defer.resolve( users.slice( offset, (offset+25) ) );
            } else {
                $http({
                    method: 'GET',
                    url: './data/users.json'
                }).success(function(data){
                    users = data;
                    webStorage.set('usersList', JSON.stringify(data));
                    defer.resolve( data.slice( offset, (offset+25) ) );
                }).error(function(data){
                    defer.reject(data);
                });
            }

            return defer.promise;
        }

        function getUsersCount() {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: './data/users.json'
            }).success(function(data){
                var arr = new Array(data.length/25);
                defer.resolve(arr);
            }).error(function(data){
                defer.reject(data);
            });

            return defer.promise;
        }

        function updateUser(newUser, id) {
            var defer = $q.defer();
            // Here request for user update
            /*$http({
                method: 'POST',
                url: '/data/users.json'
            }).success(function(data){
                defer.resolve(data);
            }).error(function(data){
                defer.reject(data);
            });*/
            var index = $filter('getIndexById')(users, id);
            newUser.id = id;
            delete newUser.object;
            users[index] = newUser;
            webStorage.set('usersList', JSON.stringify(users));
            defer.resolve(newUser);
            return defer.promise;
        }
    }

    angular.module('optimum.users').filter('getIndexById', function() {
        return function(input, id) {
            var i=0, len=input.length;
            for (; i<len; i++) {
                if (input[i].id == id) {
                    return i;
                }
            }
            return null;
        };
    });
}());
