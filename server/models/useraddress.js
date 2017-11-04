'use strict';
module.exports = function (sequelize, DataTypes) {
    var UserAddress = sequelize.define('UserAddress', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
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
    UserAddress.associate = (models) => {
        UserAddress.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });
    };
    return UserAddress;
};