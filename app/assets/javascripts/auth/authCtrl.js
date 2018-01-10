'use strict';

pokerApp.controller('AuthCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'Auth', function AuthCtrl($scope, $rootScope, $state, $timeout, Auth){
	$rootScope.pageLoaded = true;
	$timeout(function(){$rootScope.pageLoaded = true}, 3000);

	$scope.pageClass = 'page-login';

	$scope.login = function() {
		Auth.login($scope.user).then(function(){
			$state.go('home');
		}, function(error){
			$scope.loggingIn = false;
			$scope.error = error.data.error;
		});
	};
	
	$scope.goRegister = function() {
	  $state.go('register');
	};

	$scope.register = function() {
		Auth.register($scope.user).then(function(){
			$scope.login();
		}, function(error){
			$scope.registering = false;
			$scope.error = error.data.errors;
		})
	};
	
	$scope.goLogin = function() {
	  $state.go('login');
	}
}]);
