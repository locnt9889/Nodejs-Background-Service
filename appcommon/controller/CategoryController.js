/**
 * Created by LocNT on 7/16/15.
 */

var express = require('express');
var router = express.Router();
var Q = require('q');

var mongoose = require('mongoose');
var DB_CONFIG = require("../helper/DatabaseConfig");

var Category = require("../model/Category");
var Image = require("../model/Image");
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

var findAllNoCount = function(){
    var deferred = Q.defer();
    Category.find({}, function (err, rows) {
        if (err) {
            deferred.reject(err);
        }else {
            deferred.resolve(rows);
        }
    });
    return deferred.promise;
}

var countImageOfCategory = function(){
    var deferred = Q.defer();
    var agg = [
        {$group: {
            _id: "$category_id",
            total : {$sum:1}
        }}
    ];

    var responseDto = new ResponseDto();
    Image.aggregate(agg, function (err, rows) {
        if (err) {
            deferred.reject(err);
        }else {
            deferred.resolve(rows);
        }
    });

    return deferred.promise;
}

/* GET findall */
router.get('/findall', function(req, res, next) {
    var responseDto = new ResponseDto();
    findAllNoCount().then(function (rows) {
        console.log("findall");
        responseDto.code = 0;
        responseDto.result = rows;
        countImageOfCategory().then(function(data){
            for(var i = 0; i < rows.length; i++){
                var cateId = rows[i].id;
                for(var j = 0; j < data.length; j++){
                    if(cateId == data[j]._id){
                        rows[i]._doc.num_images = data[j].total;
                    }
                }
            }
            responseDto.result = rows;
            res.send(responseDto);
        }, function(err){
            res.send(responseDto);
        });
    }, function(err){
        console.log("error findall : " + err);
        responseDto.code = 1;
        responseDto.error = err;
        res.send(responseDto);
    });
});

module.exports = router;
