'use strict';

var fs = require('fs');
var path = require('path');

var Sequelize = require('sequelize');
var pg = require('pg');
var basename = path.basename(module.filename);
var db = {};

var DotENV = require('dotenv');
DotENV.config();
var env = process.env.NODE_ENV || 'production';
var config = require(__dirname + '/../config/db-config.json')[env];

var sequelize = void 0;
if (config.use_env_variable) {
    if (env == 'production') pg.defaults.ssl = true;
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    if (env == 'production') pg.defaults.ssl = true;
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname).filter(function (file) {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;