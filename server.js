// modules =================================================
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var dbRecord = require('./app/controllers/recordCtrl');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================

// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// db ======================================================
var User = require('./app/models/user');


// start app ===============================================
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var numOfUsers = 0;
var roomId = 0;
var questions = [];
var questionId = 0;
var answers = [];

function makeAllQuestions() {

    for (var i = 0; i < 10; i++) {
        questions[i] = getRandomQuestion();
        answers[i] = calculateResult(questions[i]);
        console.log('Random Question' + (i + 1) + ': ' + questions[i].num1 + questions[i].operator + questions[i].num2);
        console.log('answer = ' + answers[i]);
    }
    //console.log('questions[0]: ' + questions[0].num1 + questions[0].operator + questions[0].num2);
    return questions;
}

function getRandomQuestion() {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var operators = ['+', '-', '*'];

    var question = {
        num1: 0,
        num2: 0,
        operator: ''
    };
    question.num1 = parseInt(Math.random() * 10);
    question.num2 = parseInt(Math.random() * 10);
    question.operator = operators[parseInt(Math.random() * 3)];
    return question;
}

function calculateResult(question) {
    var result;
    switch (question.operator) {
        case '+':
            result = question.num1 + question.num2;
            break;
        case '-':
            result = question.num1 - question.num2;
            break;
        case '*':
            result = question.num1 * question.num2;
            break;
        default:
            break;
    }
    return result;
}

io.on('connection', function (socket) {

    socket.on('userReady', function () {
        numOfUsers += 1;
        console.log('connected user numbers: %d', numOfUsers);
        io.emit('mathBattleAddPlayers', {user: numOfUsers, room: roomId});

        if (4 == numOfUsers) {
            questions = makeAllQuestions();
            io.emit('mathBattleBegin', questions);
            setTimeout(sendNextQuestion, 3000);
            numOfUsers = 0;
            questionId = 0;
            roomId++;
        }
    });

    socket.on('disconnect', function () {
        console.log('user disconnect');
    });

    socket.on('userLogin', function (info) {
        console.log('login info: ' + info);
    });

    function sendNextQuestion() {
        io.emit('nextQuestion', questionId);
    }
    socket.on('userAnswer', function (data) {
        console.log('userAnswer = ' + data);
        if (parseInt(answers[questionId]) == parseInt(data)) {
            console.log('userAnswer correct, nextQuestion');
            socket.emit('answerRight', '');
            questionId++;
            if (10 == questionId) {
                io.emit('allFinish', '');
            } else {
                io.emit('prepareNextQuestion', '');
                setTimeout(sendNextQuestion, 3000);
            }
        } else {
            socket.emit('answerWrong', '');
        }
    });

});

exports = module.exports = app; 						// expose app