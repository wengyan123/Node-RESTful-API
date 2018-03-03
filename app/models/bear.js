
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
    bear_id: Number,
    bear_name: String
})

module.exports = mongoose.model('Bear', BearSchema);