angular.module('MainCtrl', []).controller('MainController', function($scope, socketFactory, $location, shareFactory) {

	$scope.userLogin = function() {
		if ('' != $scope.login.name) {
			socketFactory.emit('userLogin', $scope.login.name);
			shareFactory.setVal($scope.login.name);
			$location.path('/Competitions');
		}
	};
});