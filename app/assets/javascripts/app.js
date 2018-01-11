'use strict';

var pokerApp = angular.module('poker', [
    'ui.router',
    'templates',
    'doowb.angular-pusher',
    'Devise',
    'ui.bootstrap',
    'ngAnimate',
    'ya.nouislider',
    'ngAudio'
])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('login', {
                        url: '/login', templateUrl: 'Login.html', controller: 'AuthCtrl',
                        onEnter: ['$state', 'Auth', function ($state, Auth) {
                            Auth.currentUser().then(function (user) {
                                $state.go('home');
                            });
                        }]
                    })
                    .state('register', {
                        url: '/register', templateUrl: 'Register.html', controller: 'AuthCtrl',
                        onEnter: ['$state', 'Auth', function ($state, Auth) {
                            Auth.currentUser().then(function (user) {
                                $state.go('home');
                            });
                        }]
                    })
                    .state('home', {
                        url: '/home', templateUrl: 'Home.html', controller: 'HomeCtrl'
                    })
                    .state('account', {
                        url: '/account', templateUrl: 'AccountDetails.html', controller: 'accountCtrl'
                    })
                    .state('editaccount', {
                        url: '/account/edit', templateUrl: 'EditAccount.html', controller: 'accountCtrl'
                    })
                    .state('gameroom', {
                        url: '/gameroom/:gameId?bIn', templateUrl: 'GameRoom.html', controller: 'gameRoomCtrl',
                        onExit: ['$stateParams', 'Pusher', function($stateParams, Pusher){
                            Pusher.unsubscribe('gameroom-' + $stateParams.gameId);
                        }]
                    });

            $urlRouterProvider.otherwise('login');
        }])
        .config(['PusherServiceProvider', function (PusherServiceProvider) {
            PusherServiceProvider.setToken('<%= Pusher.key %>').setOptions({});
        }])
        .run(['$rootScope', '$state', 'Auth', 'apiServices', function ($rootScope, $state, Auth, apiServices) {
            {
                $rootScope.signedIn = Auth.isAuthenticated;
                $rootScope.logout = Auth.logout;

                Auth.currentUser().then(function (user) {
                    $rootScope.user = user;
                    console.log($rootScope.user);
                    console.log(user);
                });

                $rootScope.$on('devise:new-registration', function (e, user) {
                    $rootScope.user = user;
                    console.log($rootScope.user);
                    console.log(user);
                });

                $rootScope.$on('devise:login', function (e, user) {
                    $rootScope.user = user;
                    apiServices.AccountService.GetPicture($rootScope.user._id).success(function (result){
                        $rootScope.user.image_url = result;
                    });
                    console.log($rootScope.user);
                    console.log(user);
                });

                $rootScope.$on('devise:logout', function (e, user) {
                    delete $rootScope.user;
                    $state.go('login');
                });

                $rootScope.$on('$stateChangeStart', function (event, toState) {
                    if (toState.name != 'login' && toState.name != 'register') {
                        if (!$rootScope.user) {
                            event.preventDefault();
                            $state.go('login');
                        }
                    }
                });
            }
        }]);
