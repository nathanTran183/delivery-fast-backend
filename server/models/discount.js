'use strict';
module.exports = function (sequelize, DataTypes) {
    var Discount = sequelize.define('Discount', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        percentage: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        expire_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    Discount.associate = (models) => {
        Discount.belongsTo(models.Store, {
            foreignKey: 'store_id',
            onDelete: 'CASCADE',
        });
    };
    return Discount;
};