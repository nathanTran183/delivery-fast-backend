'use strict';
module.exports = function (sequelize, DataTypes) {
    var Product = sequelize.define('Product', {
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
                min: {
                    args: [0],
                    msg: "Product's price must be higher than 0!"
                }
            }
        },
        image_url: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            onDelete: 'CASCADE',
        });
    };

    return Product;
};