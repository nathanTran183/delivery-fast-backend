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
            unique: {
                args: true,
                msg: "Username has been existed!"
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: {
                args: true,
                msg: "Email has been existed!"
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: "Wrong email format"
                },
            }
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
            },
            toJSON: function () {
                let values = Object.assign({}, this.get());
                delete values.password;
                return values;
            },
        },
        privateColumns: ['password']
    });

    User.beforeCreate((user, options) => {
        if (user.changed('password')) {
            return bcrypt.hash(user.password, 10)
                .then(hash => {
                    user.password = hash;
                })
                .catch(err => {
                    throw new Error();
                });
        }
    });
    User.beforeUpdate((user, options) => {
        if (user.changed('password')) {
            return bcrypt.hash(user.password, 10)
                .then(hash => {
                    user.password = hash;
                })
                .catch(err => {
                    throw new Error();
                });
        }
    });
    User.associate = (models) => {
        User.hasMany(models.UserPhone, {
            foreignKey: 'user_id',
            as: 'userPhones',
        });
        User.hasMany(models.UserAddress, {
            foreignKey: 'user_id',
            as: 'userAddress',
        })
        User.hasMany(models.Order, {
            foreignKey: 'user_id',
            as: 'orders',
        })
    };

    return User;
};