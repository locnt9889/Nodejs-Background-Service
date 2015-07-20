/**
 * Created by LocNT on 7/17/15.
 */
var DB_CONFIG = require('../helper/DatabaseConfig');
var mongoose = require('mongoose');
mongoose.connect(DB_CONFIG.MONGO_URI, function(err){
    console.log("connect");
});

// create a schema
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    name: String,
    age: Number,
    isActive: Boolean
});

var Person = mongoose.model('Person', userSchema);

// make this available to our users in our Node applications
module.exports = Person;