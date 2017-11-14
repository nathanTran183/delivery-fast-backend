'use strict';

module.exports = function (sequelize, DataTypes) {
    var Addon = sequelize.define('Addon', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: "Addon product's quantity must bigger than 1"
                }
            }
        }
    }, {
        classMethods: {
            associate: function associate(models) {
                // associations can be defined here
            }
        }
    });
    Addon.associate = function (models) {
        Addon.belongsTo(models.Category, {
            foreignKey: 'category_id',
            onDelete: 'CASCADE'
        });
        Addon.hasMany(models.ProductAddon, {
            foreignKey: 'addon_id',
            as: 'productAddons'
        });
    };
    return Addon;
};