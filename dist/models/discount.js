'use strict';

module.exports = function (sequelize, DataTypes) {
    var Discount = sequelize.define('Discount', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
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
            associate: function associate(models) {
                // associations can be defined here
            }
        },
        validate: {
            dateRangeValidation: function dateRangeValidation() {
                if (this.start_date > this.expire_date) {
                    throw new Error("Expire date must be later than Start date!");
                }
            }
        }
    });
    Discount.associate = function (models) {
        Discount.belongsTo(models.Store, {
            foreignKey: 'store_id',
            onDelete: 'CASCADE',
            as: 'store'
        });
    };
    return Discount;
};