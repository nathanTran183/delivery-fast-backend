'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Stores', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            opening_time: Sequelize.STRING,
            closing_time: Sequelize.STRING,
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
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            image_url: {
                type: Sequelize.STRING
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
        return queryInterface.dropTable('Stores');
    }
};