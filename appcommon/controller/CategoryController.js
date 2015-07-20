/**
 * Created by LocNT on 7/16/15.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var DB_CONFIG = require("../helper/DatabaseConfig");

var Category = require("../model/Category");
var CategoryDto = require("../dto/CategoryDto");
var ResponseDto = require("../dto/ResponseDto");

/* GET add category */
router.post('/add', function(req, res, next) {
    var categoryDto = new CategoryDto();
    categoryDto.name = req.body.name ? req.body.name : "";
    categoryDto.image = req.body.image ? req.body.image : "";

    var category = new Category(categoryDto);

    var responseDto = new ResponseDto();
    // save the user
    category.save(function (errsave, row) {
        if (errsave) {
            console.log('Category error ' + errsave);
            responseDto.code = 1;
            responseDto.error = errsave;
        }else {
            console.log('Category created!');
            responseDto.code = 0;
            responseDto.error = row;
        }
        res.send(responseDto);
        //connection.disconnect();
    });
});

/* GET findall */
router.get('/findall', function(req, res, next) {
    var responseDto = new ResponseDto();
    Category.find({}, function (err, rows) {
        if (err) {
            console.log("error findall : " + err);
            responseDto.code = 1;
            responseDto.error = err;
        }else {
            console.log("findall");
            responseDto.code = 0;
            responseDto.result = rows;
        }
        res.send(responseDto);
        //connection.disconnect();
    });
});

module.exports = router;
