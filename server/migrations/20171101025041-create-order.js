'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            user_phone: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true,
                }
            },
            user_address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            latitude: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: null,
                validate: {min: -90, max: 90}
            },
            longitude: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: null,
                validate: {min: -180, max: 180}
            },
            delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            delivery_time: {
                type: Sequelize.STRING,
                allowNull: false
            },
            ship_fee: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            total_amount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            note: Sequelize.STRING,
            status: {
                type: Sequelize.ENUM('Order Submitted', 'Processing', 'Confirmed', 'Assigned', 'Picked', 'Delivered', 'Cancelled'),
                allowNull: false,
                defaultValue: "Order Submitted"
            },
            payment: {
                type: Sequelize.ENUM('Cash'),
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'user_id',
                },
            },
            store_id: {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'Stores',
                    key: 'id',
                    as: 'store_id',
                },
            },
            employee_id: {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'Employees',
                    key: 'id',
                    as: 'employee_id',
                },
            },
            deliMan_id: {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'Employees',
                    key: 'id',
                    as: 'deliMan_id',
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Orders');
    }
};