angular.module('CompetitionCtrl', []).controller('CompetitionController', function ($scope, socketFactory, shareFactory) {

    var questionsInFrontEnd;
    var roomId = 0;
    var userName = '';
    //var roomRecord = [
    //    {name: '', score: 0},
    //    {name: '', score: 0},
    //    {name: '', score: 0},
    //    {name: '', score: 0}
    //];

    userName = shareFactory.getVal();
    shareFactory.setVal('');

    if ('' == userName) {
        var randomId = parseInt(Math.random() * 1000);
        userName = 'Guest' + randomId;
    }
    socketFactory.emit('userReady', userName);

    $scope.userSubmitAns = function () {
        var submit = {name: userName, ans: $scope.userAns};
        socketFactory.emit('userAnswer', submit);
        $scope.userAns = '';
    };

    $scope.quit = function () {
        location.href = '/';
    };

    socketFactory.on('mathBattleAddPlayers', function (data) {
        roomId = data.room;
        $scope.uesrQuestions = 'Please wait for other users.\n' +
        'Now we have ' + data.user + ' players in Room: ' + data.room;
    });

    socketFactory.on('mathBattleRecord', function (data) {
        $scope.users = data;
    });

    socketFactory.on('mathBattleBegin', function (questions) {
        questionsInFrontEnd = questions;
        $scope.uesrQuestions = 'Battle starts in 3s...';
    });

    socketFactory.on('prepareNextQuestion', function (userAnsRight) {
        for(var i=0; i<4; i++) {
            if($scope.users[i].name == userAnsRight) {
                $scope.users[i].score += 10;
                break;
            }
        }
        $scope.uesrQuestions = 'Next question in 3s...';
    });

    socketFactory.on('nextQuestion', function (data) {
        $scope.userAnswerStatus = '';
        $scope.uesrQuestions = questionsInFrontEnd[data].num1 +
        questionsInFrontEnd[data].operator + questionsInFrontEnd[data].num2;
    });

    socketFactory.on('answerRight', function (data) {
        $scope.userAnswerStatus = 'Correct!';
    });

    socketFactory.on('answerWrong', function (data) {
        $scope.userAnswerStatus = 'Wrong!';
    });

    socketFactory.on('allFinish', function (userAnsRight) {
        for(var i=0; i<4; i++) {
            if($scope.users[i].name == userAnsRight) {
                $scope.users[i].score += 10;
                break;
            }
        }
        $scope.uesrQuestions = 'Mission Complete!';
        socketFactory.socket.reconnect();
    });

});