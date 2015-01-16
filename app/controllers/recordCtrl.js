// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mathapp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('mongoodb/mathapp connected');
});

// Get Record schema and model
//var recordSchema = require('../models/record.js').recordSchema;
//var Records = mongoose.model('Records', recordSchema);

//