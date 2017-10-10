'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _dbConfig = require('./db-config.json');

var _dbConfig2 = _interopRequireDefault(_dbConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var db = _dbConfig2.default[process.env.NODE_ENV];

module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	expireTime: process.env.EXPIRE_TIME,
	db: {
		username: db.username,
		password: db.password,
		database: db.database,
		host: db.port,
		dialect: db.dialect
	},
	jwtSecret: process.env.JWTSECRET
};