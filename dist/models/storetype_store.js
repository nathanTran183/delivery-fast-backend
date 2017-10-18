'use strict';

module.exports = function (sequelize, DataTypes) {
    var StoreType_Store = sequelize.define('StoreType_Store', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        store_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Store', // Can be both a string representing the table name, or a reference to the model
                key: "id"
            }
        },
        store_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "StoreType", // Can be both a string representing the table name, or a reference to the model
                key: "id"
            }
        }
    }, {
        classMethods: {
            associate: function associate(models) {
                // associations can be defined here
            }
        }
    });
    return StoreType_Store;
};