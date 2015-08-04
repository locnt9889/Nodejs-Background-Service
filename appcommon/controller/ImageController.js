/**
 * Created by LocNT on 7/16/15.
 */
var UPLOAD_FOLDER = "/var/www/nginxsite.com/public_html";
var PRE_IMAGE = "/BackgroundStore/Images/";
var PRE_THUMB = "/BackgroundStore/Thumbs/";
var MAX_SIZE_IMAGE = 3145728; //3Mb
var MAX_SIZE_THUMB = 2097152; //2Mb

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var DB_CONFIG = require("../helper/DatabaseConfig");
var CONSTANTS = require("../helper/Constants");

var Image = require("../model/Image");
var ImageDto = require("../dto/ImageDto");
var ResponseDto = require("../dto/ResponseDto");

var addImage = function(req, res, image) {
    // save the user
    var responseDto = new ResponseDto();
    image.save(function (errsave, row) {
        if (errsave) {
            console.log('Image error ' + errsave);
            responseDto.code = 1;
            responseDto.error = errsave;
        }else {
            console.log('Image created!');
            responseDto.code = 0;
            responseDto.result = row;
        }

        res.send(responseDto);
        //connection.disconnect();
    });
}
/* GET Add Image */
router.post('/add', function(req, res, next) {
    var imageDto = new ImageDto();
    imageDto.image = req.body.image ? req.body.image : "";
    imageDto.thumb = req.body.thumb ? req.body.thumb : "";
    imageDto.category_id = req.body.category_id ? req.body.category_id : 0

    var image = new Image(imageDto);

    addImage(req, res, image);

});
function findall(req, res, next) {
    var perPage = Number(req.query.perPage ? req.query.perPage : 5);
    var page = Number(req.query.page ? req.query.page : 1);
    var sortby = req.query.sortby ? req.query.sortby : CONSTANTS.IMAGES_SORT_BY.RANDOM;

    var sortObj = "image";

    if(CONSTANTS.IMAGES_SORT_BY.DOWNLOAD == sortby){
        sortObj = "-num_down";
    }else if(CONSTANTS.IMAGES_SORT_BY.FAVORITE == sortby){
        sortObj = "-num_favorite";
    }else if(CONSTANTS.IMAGES_SORT_BY.PREVIEW == sortby){
        sortObj = "-num_prev";
    }else if(CONSTANTS.IMAGES_SORT_BY.DATE == sortby){
    sortObj = "-id";
    }else{
        sortObj = "image";
    }

    console.log(sortby + "====" + sortObj);

    var responseDto = new ResponseDto();
    Image.find({}).limit(perPage).sort(sortObj).skip(perPage * (page-1)).exec(function (err, rows) {
        if (err) {
            console.log("error find-by-id : " + err);
            responseDto.code = 1;
            responseDto.error = err;
            res.send(responseDto);
        }else {
            console.log("find-by-id");
            Image.find({}).count().exec(function(error, count){
                if (error) {
                    console.log("error find-by-id : " + err);
                    responseDto.code = 1;
                    responseDto.error = err;
                }else {
                    responseDto.code = 0;
                    responseDto.result.rows = rows;
                    var pages = count / perPage;
                    responseDto.result.pages = pages > parseInt(pages) ? parseInt(pages) + 1 : parseInt(pages);
                    responseDto.result.page = parseInt(page);
                }
                res.send(responseDto);
            })
        }
        //connection.disconnect();
    });
}
/* GET find */
router.get('/findall', findall);

/* GET find */
router.get('/find-by-id', function(req, res, next) {
    var id = req.query.id ? req.query.id : 0;
    var responseDto = new ResponseDto();
    Image.findOne({'id' : id}, function (err, row) {
        if (err) {
            console.log("error find-by-id : " + err);
            responseDto.code = 1;
            responseDto.error = err;
        }else {
            console.log("find-by-id");
            responseDto.code = 0;
            responseDto.result = row;
        }
        res.send(responseDto);
        //connection.disconnect();
    });
});

/* GET find */
router.get('/find-by-category', function(req, res, next) {
    var category_id = Number(req.query.category_id ? req.query.category_id : 0);

    if(category_id == 0) {
        findall(req, res, next);
    }else {
        var perPage = Number(req.query.perPage ? req.query.perPage : 5);
        var page = Number(req.query.page ? req.query.page : 1);
        var sortby = req.query.sortby ? req.query.sortby : CONSTANTS.IMAGES_SORT_BY.RANDOM;

        var sortObj = "id";

        if(CONSTANTS.IMAGES_SORT_BY.DOWNLOAD == sortby){
            sortObj = "-num_down";
        }else if(CONSTANTS.IMAGES_SORT_BY.FAVORITE == sortby){
            sortObj = "-num_favorite";
        }else if(CONSTANTS.IMAGES_SORT_BY.PREVIEW == sortby){
            sortObj = "-num_prev";
        }else{
            sortObj = "id";
        }

        var responseDto = new ResponseDto();
        Image.where("category_id", category_id).limit(perPage).skip(perPage * (page - 1)).sort(sortObj).exec(function (err, rows, wee) {
            if (err) {
                console.log("error find-by-id : " + err);
                responseDto.code = 1;
                responseDto.error = err;
                res.send(responseDto);
            } else {
                console.log("find-by-id");
                Image.where("category_id", category_id).count().exec(function (error, count) {
                    if (error) {
                        console.log("error find-by-id : " + err);
                        responseDto.code = 1;
                        responseDto.error = err;
                    } else {
                        responseDto.code = 0;
                        responseDto.result.rows = rows;
                        var pages = count / perPage;
                        responseDto.result.pages = pages > parseInt(pages) ? parseInt(pages) + 1 : parseInt(pages);
                        responseDto.result.page = parseInt(page);
                    }
                    res.send(responseDto);
                })
            }
            //connection.disconnect();
        });
    }
});

/* GET action */
router.get('/execute', function(req, res, next) {
    var type = req.query.type ? req.query.type : "";
    var action = req.query.action ? req.query.action : "";
    var id = req.query.id ? req.query.id : 0;

    var responseDto = new ResponseDto();
    Image.findOne({'id' : id}, function (err, row) {
        if (err) {
            console.log("error execute : " + err);
            responseDto.code = 1;
            responseDto.error = err;
        }else if(!row || row == null){
            console.log("execute find one is failure");

            responseDto.code = 2;
            responseDto.message = "Can not find the image!"
            responseDto.result = row;
        }else{
            console.log("execute");
            if(type == CONSTANTS.EXECUTE_IMAGE_TYPE.PREVIEW){
                if(action == CONSTANTS.EXECUTE_IMAGE_ACTION.ADD){
                    row.num_prev = row.num_prev + 1;
                }else if(action == CONSTANTS.EXECUTE_IMAGE_ACTION.REMOVE){
                    row.num_prev = row.num_prev == 0 ? row.num_prev : row.num_prev - 1;
                }
            }else if(type == CONSTANTS.EXECUTE_IMAGE_TYPE.DOWNLOAD){
                if(action == CONSTANTS.EXECUTE_IMAGE_ACTION.ADD){
                    row.num_down = row.num_down + 1;
                }else if(action == CONSTANTS.EXECUTE_IMAGE_ACTION.REMOVE){
                    row.num_down = row.num_down == 0 ? row.num_down : row.num_down - 1;
                }
            }else if(type == CONSTANTS.EXECUTE_IMAGE_TYPE.FAVORITE){
                if(action == CONSTANTS.EXECUTE_IMAGE_ACTION.ADD){
                    row.num_favorite = row.num_favorite + 1;
                }else if(action == CONSTANTS.EXECUTE_IMAGE_ACTION.REMOVE){
                    row.num_favorite = row.num_favorite == 0 ? row.num_favorite : row.num_favorite - 1;
                }
            }

            row.save(function(err, rowupdate){
                if (err) {
                    console.log("error update : " + err);
                    responseDto.code = 1;
                    responseDto.error = err;
                }else {
                    responseDto.code = 0;
                    responseDto.result = rowupdate;
                }

                res.send(responseDto);
            });
        }
    });
});
/* GET action */
router.get('/upload', function(req, res, next) {
    res.sendfile("views/upload-client.html");
});

var Q = require("q");
/* GET action */
router.post('/upload-action', function(req, res, next) {
    console.log("upload action");

    upload_file(req, res);
});

var multiparty = require('multiparty');
var fs = require('fs');

function upload_file(req, res) {
    var imageDto = new ImageDto();
    imageDto.image = "";
    imageDto.thumb = "";
    imageDto.category_id = 0;

    //var image = new Image(imageDto);

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var responseDto = new ResponseDto();
        if(err){
            responseDto.code = 1;
            responseDto.error = err;
            responseDto.message = "Loi parse form";
            res.send(responseDto);
            return;
        }
        if(files.imageFile.length == 0 || files.thumbFile.length == 0){
            responseDto.code = 1;
            responseDto.error = {'errcode' : "EMPTY"};
            responseDto.message = "image or thumb is empty!";
            res.send(responseDto);
            return;
        }
        var categoryID = 0;
        try{
            categoryID = parseInt(fields.category_id[0]);
        }catch(e){
            console.log(e);
        }
        if(categoryID <= 0){
            responseDto.code = 1;
            responseDto.error = {'errcode' : "EMPTY"};
            responseDto.message = "category id can not <= 0!";
            res.send(responseDto);
            return;
        }
        if(files.imageFile[0].size > MAX_SIZE_IMAGE ||  files.thumbFile[0].size > MAX_SIZE_THUMB){
            responseDto.code = 1;
            responseDto.error = {'errcode' : "LIMITED"};
            responseDto.message = "image or thumb is limited size!";
            res.send(responseDto);
            return;
        }

        imageDto.category_id = categoryID;

        console.log("ddd");
        read_write_file(files.imageFile[0].originalFilename, files.imageFile[0].path, PRE_IMAGE).then(function(fullFilePath){
            imageDto.image = fullFilePath;
            read_write_file(files.thumbFile[0].originalFilename, files.imageFile[0].path, PRE_THUMB).then(function(fullFilePath){
                imageDto.thumb = fullFilePath;
                var image = new Image(imageDto);
                addImage(req, res, image);
            },function(){
                responseDto.code = 1;
                responseDto.error = {'errcode' : "WRITE/READ FILE"};
                responseDto.message = "loi doc/ghi file thumb";
                res.send(responseDto);
                return;
            });
        },function(){
            responseDto.code = 1;
            responseDto.error = {'errcode' : "WRITE/READ FILE"};
            responseDto.message = "loi doc/ghi file image";
            res.send(responseDto);
            return;
        });
    });
}
function read_write_file(fileName, filePath, preFolder){
    var deferred = Q.defer();
    fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
            deferred.reject(err);
        }else {
            var currentDate = new Date();
            var filepathSave = preFolder + currentDate.getTime() + fileName;
            var fullFilePath = UPLOAD_FOLDER + filepathSave;
            console.log("fullFilePath : " + fullFilePath);
            fs.writeFile(fullFilePath, data, function (err) {
                if (err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(filepathSave);
                }
            });
        }
    });
    return deferred.promise;
}


module.exports = router;
