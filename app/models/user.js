// grab the mongoose module
//var mongoose = require('mongoose');
//
//var db = mongoose.connection;
//
//db.on('error', console.error);
//db.once('open', function () {
//    console.log('Mongoose connection open');
//    // Create schemas and models here.
//    var UserSchema = new mongoose.Schema({
//        id: String,
//        pwd: String,
//        score: Number
//    });
//
//    var User = mongoose.model('User', UserSchema);
//
    //Testing
    //var user = new User({
    //    id: 'test1',
    //    pwd: '',
    //    score: '1980'  // Mongoose will automatically convert this for us.
    //});
    //
    //user.save(function (err, user) {
    //    if (err) return console.error(err);
    //    console.dir(user);
    //});

    //User.findOneAndUpdate({id: 'test1'}, {score: '2000'}, {}, function (err, docs) {
    //    console.log(docs + "," + err);
    //});

    //User.findOne({id: 'test2'}, function (err, docs) {
    //    console.log(docs + "," + err);
    //    if (!err) {
    //        if (!docs) {
    //            var user = new User({
    //                id: 'test2',
    //                pwd: '',
    //                score: '1980'  // Mongoose will automatically convert this for us.
    //            });
    //
    //            user.save(function (err, user) {
    //                if (err) return console.error(err);
    //                console.dir(user);
    //            });
    //        } else {
    //            User.findOneAndUpdate({id: 'test2'}, {score: docs.score + 1}, {}, function (err, docs) {
    //                console.log(docs + "," + err);
    //            });
    //        }
    //    }
    //});

    // module.exports allows us to pass this to other files when it is called
//    module.exports = User;
//});

//mongoose.connect('mongodb://localhost/math-battle');
//console.log('mongoose.connect to math-battle');
