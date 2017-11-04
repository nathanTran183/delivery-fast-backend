'use strict';
module.exports = function (sequelize, DataTypes) {
    var ProductAddon = sequelize.define('ProductAddon', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    ProductAddon.associate = (models) => {
        ProductAddon.belongsTo(models.Addon, {
            foreignKey: 'addon_id',
            onDelete: 'CASCADE',
        });
    };
    return ProductAddon;
};