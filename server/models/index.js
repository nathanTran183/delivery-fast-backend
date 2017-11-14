const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
const pg = require('pg');
const basename = path.basename(module.filename);
const db = {};

const DotENV = require('dotenv');
DotENV.config();
const env = process.env.NODE_ENV || 'production';
const config = require(`${__dirname}/../config/db-config.json`)[env];

let sequelize;
if (config.use_env_variable) {
    pg.defaults.ssl = true;
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    pg.defaults.ssl = true;
    sequelize = new Sequelize(
        config.database, config.username, config.password, config
    );
}

fs
    .readdirSync(__dirname)
    .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;