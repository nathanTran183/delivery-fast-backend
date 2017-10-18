'use strict';

module.exports = function (sequelize, DataTypes) {
    var Store = sequelize.define('Store', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        opening_time: DataTypes.STRING,
        closing_time: DataTypes.STRING,
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: null,
            validate: { min: -90, max: 90 }
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: null,
            validate: { min: -180, max: 180 }
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function associate(models) {
                // associations can be defined here
            }
        },
        validate: {
            bothCoordsOrNone: function bothCoordsOrNone() {
                if (this.latitude === null !== (this.longitude === null)) {
                    throw new Error('Require either both latitude and longitude or neither');
                }
            }
        }
    });
    Store.associate = function (models) {
        Store.belongsToMany(models.StoreType, {
            through: models.StoreType_Store,
            as: 'storeTypes'
        });
    };
    return Store;
};