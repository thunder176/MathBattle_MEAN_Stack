// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recordSchema = new Schema({
    date: { type: Date, default: Date.now },
    players: [{id: String, score: Number}]
});

// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('recordSchema', recordSchema);
