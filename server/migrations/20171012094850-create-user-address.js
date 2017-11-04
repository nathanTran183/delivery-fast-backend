'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('UserAddresses', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            address: {
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
            user_id: {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'user_id',
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
        return queryInterface.dropTable('UserAddresses');
    }
};