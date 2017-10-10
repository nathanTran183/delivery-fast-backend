'use strict';
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
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
            associate: function (models) {
                // associations can be defined here
            }
        },
        instanceMethods: {
            comparePassword: function (candidatePassword, cb) {
                bcrypt.compare(candidatePassword, this.getDataValue('password'), function (err, isMatch) {
                    if (err) return cb(err);
                    cb(null, isMatch);
                });
            }
        }
    });

    User.beforeCreate((user, options) => {
        return bcrypt.hash(user.password, 10)
            .then(hash => {
                user.password = hash;
            })
            .catch(err => {
                throw new Error();
            });
    });
    User.associate = (models) => {
        User.hasMany(models.UserPhone, {
            foreignKey: 'user_id',
            as: 'UserPhone',
        });
    };

    return User;
};