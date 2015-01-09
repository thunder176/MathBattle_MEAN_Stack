angular.module('MainCtrl', []).controller('MainController', function($scope, socketFactory) {

	$scope.tagline = 'This is the login page';

	$scope.userLogin = function() {
		var userEmail = $scope.login.email;
		var userPwd = $scope.login.password;
		var usrInfo = {email : userEmail, pwd : userPwd};
		socketFactory.emit('userLogin', usrInfo);
	}

});