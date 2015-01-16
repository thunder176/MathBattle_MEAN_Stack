// modules =================================================
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var port = process.env.PORT || 8080; // set our port

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// db ======================================================
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function () {
    console.log('Mongoose connection open');
    // Create schemas and models here.
});
var UserSchema = new mongoose.Schema({
    id: String,
    pwd: String,
    score: Number
});

var User = mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/math-battle');
console.log('mongoose.connect to math-battle');


// start app ===============================================
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var numOfUsers = 0;
var roomId = 0;
var questions = [];
var questionId = 0;
var answers = [];
var roomRecord = [
    {name: '', score: 0},
    {name: '', score: 0},
    {name: '', score: 0},
    {name: '', score: 0}
];

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
    console.log('user connect');

    socket.on('userReady', function (info) {
        console.log('User: ' + info + ' is ready.');
        roomRecord[numOfUsers].name = info;

        numOfUsers += 1;
        console.log('connected user numbers: %d', numOfUsers);
        io.emit('mathBattleAddPlayers', {user: numOfUsers, room: roomId});

        if (4 == numOfUsers) {
            //var thisRoomRecord = roomRecord;
            for (var i = 0; i < 4; i++) {
                roomRecord[i].score = 0;
            }
            io.emit('mathBattleRecord', roomRecord);
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
        console.log('user: ' + data.name + ' answer = ' + data.ans);
        if (parseInt(answers[questionId]) == parseInt(data.ans)) {
            console.log('user: ' + data.name + ' answer correct, nextQuestion');
            socket.emit('answerRight', '');
            // add battle record
            for (var i = 0; i < 4; i++) {
                if (roomRecord[i].name == data.name) {
                    roomRecord[i].score += 10;
                }
            }

            // save the records in mongodb
            // find if it's exists
            var usrName = data.name;
            User.findOne({id: usrName}, function (err, docs) {
                console.log('FindOne:' + docs + "," + err);
                if (!err) {
                    if (!docs) {
                        var user = new User({
                            id: usrName,
                            pwd: '',
                            score: 10
                        });

                        user.save(function (err, user) {
                            if (err) return console.error(err);
                            console.log('Save:' + user);
                        });
                    } else {
                        User.findOneAndUpdate({id: usrName}, {score: docs.score + 10}, {}, function (err, docs) {
                            console.log('FindOneAndUpdate' + docs + "," + err);
                        });
                    }
                }
            });

            questionId++;
            if (10 == questionId) {
                socket.emit('allFinish', '');
                io.emit('allFinish', data.name);
            } else {
                io.emit('prepareNextQuestion', data.name);
                setTimeout(sendNextQuestion, 3000);
            }
        } else {
            socket.emit('answerWrong', '');
        }
    });

});

exports = module.exports = app; 						// expose app