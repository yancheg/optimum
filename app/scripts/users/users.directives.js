/**
 * Created by Admin on 29.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum.users').directive('editBtn', ['$modal', function($modal){
        return {
            restrict: 'E',
            template: '<div><span class="glyphicon glyphicon-edit"></span>Edit</div>',
            scope: {
                user: '=',
                action: '=',
                index: '='
            },
            link: function(scope, el, attr){

                el.bind('click', function(){
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'scripts/users/views/edit.html',
                        controller:['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {
                            var old_info = angular.copy(item);
                            $scope.item = item;

                            $scope.ok = function () {
                                $modalInstance.close($scope.item);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss(old_info);
                            };
                        }],
                        resolve: {
                            item: function () {
                                return angular.copy(scope.user);
                            }
                        }
                    });

                    modalInstance.result.then(function (user) {
                        scope.action(user, scope.user.id);
                    },function (user) {
                        scope.user = user;
                    });
                });

            }
        };
    }]);

    angular.module('optimum.users').directive('searchField', ['$timeout', function($timeout){
        return {
            restrict: 'A',
            scope: {
                action: '=',
            },
            link: function(scope, el, attr){
                var timer;
                el.bind('keyup', function(){
                    if(timer) {
                        $timeout.cancel(timer);
                    }
                    var value = el.val();
                    if(value.length>3) {
                        timer = $timeout(function(){
                            scope.action(value);
                        }, 300);
                    }
                });

            }
        };
    }]);
}());