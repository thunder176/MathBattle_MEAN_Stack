angular.module('GeekCtrl', []).controller('GeekController', function($scope, socketFactory) {

	$scope.tagline = 'This is the history page';

	socketFactory.emit('historyRecord', '');

	var records = [{
		id: String,
		pwd: String,
		score: Number
	}];

	socketFactory.on('historyRecord', function (data) {
		records = data;
		$scope.records = data;
	});

});