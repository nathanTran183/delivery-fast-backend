'use strict';
module.exports = function (sequelize, DataTypes) {
    var Store = sequelize.define('Store', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        name: {
            type:DataTypes.STRING,
            unique: {
                args: true,
                msg: "Store name is unique!"
            },
            allowNull: false
        },
        address: {
            type:DataTypes.STRING,
            unique: {
                args: true,
                msg: "Store address is unique!"
            },
            allowNull: false,
        },
        phone_number: {
            type:DataTypes.STRING,
            unique: {
                args: true,
                msg: "Store phone number is unique!"
            },
            allowNull: false
        },
        opening_time: DataTypes.STRING,
        closing_time: DataTypes.STRING,
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: null,
            validate: {min: -90, max: 90}
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: null,
            validate: {min: -180, max: 180}
        },
        status: {
            type:DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        },
        validate: {
            bothCoordsOrNone() {
                if ((this.latitude === null) !== (this.longitude === null)) {
                    throw new Error('Require either both latitude and longitude or neither')
                }
            }
        }
    });
    Store.associate = (models) => {
        Store.belongsToMany(models.StoreType, {
            through: models.StoreType_Store,
            as: 'storeTypes',
            foreignKey: 'store_id',
        });
        Store.hasMany(models.Order, {
            foreignKey: 'store_id',
            as: 'orders',
        });
        Store.hasMany(models.Category, {
            foreignKey: 'store_id',
            as: 'categories',
        });
        Store.hasMany(models.Discount, {
            foreignKey: 'store_id',
            as: 'discounts',
        });
    };
    return Store;
};