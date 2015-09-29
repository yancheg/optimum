/**
 * Created by Admin on 28.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum.users').controller('UsersController', UsersController);

    UsersController.$inject = ['$filter', 'users', 'usersCount', 'UserService', 'toastr', 'offset'];

    function UsersController ($filter, users, usersCount, UserService, toastr, offset) {

        /* jshint validthis: true */
        var vm = this;
        vm.users = users;
        vm.pagination = usersCount;

        vm.edit = function(user, id) {
            UserService.updateUser(user, id).then(function(data){
                toastr.success("User Updated!");
                var index = $filter('getIndexById')(vm.users, id);
                vm.users[index] = data;
            });
        };

        vm.filter = function(search) {
            UserService.filterUsers(search).then(function(data){
                vm.users = data;
                vm.pagination = null;
            });
        };
    }
}());