'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('OrderDetails', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            product_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            product_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            detail: {
                type: Sequelize.STRING,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            unit_price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0
                }
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0
                }
            },
            image_url: {
                type: Sequelize.STRING,
            },
            order_id: {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'Orders',
                    key: 'id',
                    as: 'order_id',
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
        return queryInterface.dropTable('OrderDetails');
    }
};