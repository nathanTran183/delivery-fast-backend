'use strict';

module.exports = function (sequelize, DataTypes) {
    var Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING
        },
        body: {
            type: DataTypes.STRING
        },
        image_url: DataTypes.STRING,
        user_id: DataTypes.STRING
    }, {
        classMethods: {
            associate: function associate(models) {
                // associations can be defined here
            }
        }
    });
    Notification.associate = function (models) {
        Notification.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order',
            onDelete: 'CASCADE'
        });
    };
    return Notification;
};