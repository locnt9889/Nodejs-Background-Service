/**
 * Created by LocNT on 7/18/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var DB_CONFIG = require("../helper/DatabaseConfig");

var connection = mongoose.createConnection(DB_CONFIG.MONGO_URI);

autoIncrement.initialize(connection);

var imageSchema = new Schema({
    image : String,
    thumb : String,
    num_down : Number,
    num_favorite : Number,
    num_prev : Number,
    category_id : Number
});

imageSchema.plugin(autoIncrement.plugin, {
    model: 'Image',
    field: 'id',
    startAt: 1
});
var Category = connection.model('Image', imageSchema);

module.exports = Category;