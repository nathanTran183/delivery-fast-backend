'use strict';
module.exports = function (sequelize, DataTypes) {
    var UserPhone = sequelize.define('UserPhone', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            isNumeric: true,
        },
        role: DataTypes.BOOLEAN,
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    UserPhone.associate = (models) => {
        UserPhone.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });
    };
    return UserPhone;
};