/**
 * Created by LocNT on 7/16/15.
 */

var MONGO_INFO = {
    DB_HOST : "ds055792.mongolab.com:55792",
    DB_USERNAME : "background",
    DB_PASSWORD : "123456789",
    DB_NAME : "nodejs-service-base",
}

//mongodb://<dbuser>:<dbpassword>@<dbhost>/<dbname>
exports.MONGO_URI = "mongodb://" + MONGO_INFO.DB_USERNAME + ":" + MONGO_INFO.DB_PASSWORD + "@" + MONGO_INFO.DB_HOST + "/" + MONGO_INFO.DB_NAME;
exports.MONGO_TIMEOUT = 10000;
exports.MONGO_OPTIONS = {
    server:{
        auto_reconnect: true,
        socketOptions:{
            connectTimeoutMS    : 30000,
            socketTimeoutMS     : 5000,
            keepAlive           : 1
        }
    }
};