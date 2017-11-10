'use strict';
module.exports = function (sequelize, DataTypes) {
    var Order = sequelize.define('Order', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        user_phone: {
            type: DataTypes.STRING,
            validate: {
                isNumeric: true,
            }
        },
        user_address: {
            type: DataTypes.STRING,
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
        order_date: {
            type: DataTypes.DATE,
        },
        delivery_date: {
            type: DataTypes.DATE,
        },
        ship_fee: {
            type: DataTypes.INTEGER,
        },
        total_amount: {
            type: DataTypes.INTEGER,
        },
        note: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('Order Submitted', 'Processing', 'Confirmed', 'Assigned', 'Picked', 'Delivered', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Order Submitted'
        },
        payment: {
            type: DataTypes.ENUM('Cash'),
            allowNull: false
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
    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });
        Order.belongsTo(models.Store, {
            foreignKey: 'store_id',
            onDelete: 'CASCADE',
        });
        Order.belongsTo(models.Employee, {
            foreignKey: 'employee_id',
            onDelete: 'CASCADE',
        });
        Order.belongsTo(models.Employee, {
            foreignKey: 'deliMan_id',
            onDelete: 'CASCADE',
        });
        Order.hasMany(models.OrderDetail, {
            foreignKey: 'order_id',
            as: 'orderDetails',
        });
    };
    return Order;
};