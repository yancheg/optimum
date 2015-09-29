/**
 * Created by Admin on 29.09.15.
 */

(function() {
    'use strict';

    angular.module('optimum.auth', []);

    angular.module('optimum.auth').run(RunFunction);

    RunFunction.$inject = ['$window', 'AuthService'];
    function RunFunction($window, AuthService) {

        $window.fbAsyncInit = function() {

            FB.init({
                appId: '368311113299106',
                channelUrl: 'app/channel.html',
                status: true,
                cookie: true,
                xfbml: true
            });

            AuthService.watchAuthenticationStatusChange();

        };

        (function(d){

            var js,
                id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];

            if (d.getElementById(id)) {
                return;
            }

            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";

            ref.parentNode.insertBefore(js, ref);

        }(document));
    }

}());