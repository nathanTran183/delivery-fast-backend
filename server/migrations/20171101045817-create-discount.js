'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Discounts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false
            },
            percentage: {
                type: Sequelize.FLOAT,
                allowNull: false,
                validate: {
                    min: 0
                }
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            expire_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
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
        return queryInterface.dropTable('Discounts');
    }
};