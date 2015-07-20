/**
 * Created by LocNT on 7/18/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var DB_CONFIG = require("../helper/DatabaseConfig");

var connection = mongoose.createConnection(DB_CONFIG.MONGO_URI);

autoIncrement.initialize(connection);

var categorySchema = new Schema({
    name: String,
    image: String
});

categorySchema.plugin(autoIncrement.plugin, {
    model: 'Category',
    field: 'id',
    startAt: 1
});
var Category = connection.model('Category', categorySchema);

module.exports = Category;