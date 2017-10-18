'use strict';

var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: {
                args: true,
                msg: "Username has been existed!"
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
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
                }
            }
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Phone number has been existed!"
            },
            validate: {
                isNumeric: true
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('Admin', 'Staff', 'DeliMan'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Active', 'Busy', 'Deactivated'),
            defaultValue: 'Active',
            allowNull: false
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
            },
            toJSON: function toJSON() {
                var values = Object.assign({}, this.get());
                delete values.password;
                return values;
            }
        },
        privateColumns: ['password']
    });
    Employee.beforeCreate(function (employee, options) {
        employee.username = employee.username.toLowerCase();
        employee.email = employee.email.toLowerCase();
        if (employee.changed('password')) {
            return bcrypt.hash(employee.password, 10).then(function (hash) {
                employee.password = hash;
            }).catch(function (err) {
                throw new Error();
            });
        }
    });
    Employee.beforeUpdate(function (employee, options) {
        if (employee.changed('password')) {
            return bcrypt.hash(employee.password, 10).then(function (hash) {
                employee.password = hash;
            }).catch(function (err) {
                throw new Error();
            });
        }
    });
    return Employee;
};