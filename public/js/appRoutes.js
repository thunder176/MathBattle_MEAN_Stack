angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/Competitions', {
			templateUrl: 'views/competition.html',
			controller: 'CompetitionController'
		})

		.when('/history', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		});

	$locationProvider.html5Mode(true);

}]);