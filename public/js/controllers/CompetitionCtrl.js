angular.module('CompetitionCtrl', []).controller('CompetitionController', function ($scope, socketFactory) {

    var questionsInFrontEnd;
    var roomId = 0;

    $scope.users = [
        {name: 'user 1', score: 50},
        {name: 'user 2', score: 20},
        {name: 'user 3', score: 150},
        {name: 'user 4', score: 90}
    ];

    $scope.userSubmitAns = function () {
        socketFactory.emit('userAnswer', $scope.userAns);
        $scope.userAns = '';
    };

    socketFactory.emit('userReady', '');

    socketFactory.on('mathBattleAddPlayers', function (data) {
        roomId = data.room;
        $scope.uesrQuestions = 'Please wait for other users.\n' +
        'Now we have ' + data.user + ' players in Room: ' + data.room;
    });

    socketFactory.on('mathBattleBegin', function (questions) {
        questionsInFrontEnd = questions;
        $scope.uesrQuestions = 'Battle starts in 3s...';
    });

    socketFactory.on('prepareNextQuestion', function () {
        $scope.uesrQuestions = 'Next question in 3s...';
    });

    socketFactory.on('nextQuestion', function (data) {
        $scope.userAnswerStatus = '';
        $scope.uesrQuestions = questionsInFrontEnd[data].num1 +
        questionsInFrontEnd[data].operator + questionsInFrontEnd[data].num2;
    });

    socketFactory.on('answerRight', function (questions) {
        $scope.userAnswerStatus = 'Correct!';
    });

    socketFactory.on('answerWrong', function (questions) {
        $scope.userAnswerStatus = 'Wrong!';
    });

    socketFactory.on('allFinish', function (questions) {
        $scope.uesrQuestions = 'Mission Complete!';
    });

});