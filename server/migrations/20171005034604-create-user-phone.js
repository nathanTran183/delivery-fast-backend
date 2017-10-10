'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('UserPhones', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            phone_number: {
                type: Sequelize.STRING,
                isNumeric: true,
            },
            role: {
                type: Sequelize.BOOLEAN
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
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('UserPhones');
    }
};