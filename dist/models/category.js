'use strict';

module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define('Category', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function associate(models) {
                // associations can be defined here
            }
        }
    });
    Category.associate = function (models) {
        Category.belongsTo(models.Store, {
            foreignKey: 'store_id',
            onDelete: 'CASCADE'
        });
        Category.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products'
        });
        Category.hasMany(models.Addon, {
            foreignKey: 'category_id',
            as: 'addons'
        });
    };
    return Category;
};