'use strict';

var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        gender: DataTypes.BOOLEAN,
        date_of_birth: DataTypes.DATEONLY,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        point: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        }
    }, {
        classMethods: {
            associate: function associate(models) {
                // associations can be defined here
            }
        },
        instanceMethods: {
            comparePassword: function comparePassword(candidatePassword, cb) {
                bcrypt.compare(candidatePassword, this.getDataValue('password'), function (err, isMatch) {
                    if (err) return cb(err);
                    cb(null, isMatch);
                });
            }
        }
    });

    User.beforeCreate(function (user, options) {
        return bcrypt.hash(user.password, 10).then(function (hash) {
            user.password = hash;
        }).catch(function (err) {
            throw new Error();
        });
    });
    User.associate = function (models) {
        User.hasMany(models.UserPhone, {
            foreignKey: 'user_id',
            as: 'UserPhone'
        });
    };

    return User;
};