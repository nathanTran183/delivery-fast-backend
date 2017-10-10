'use strict';

module.exports = {
    up: function up(queryInterface, Sequelize) {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1
            },
            username: {
                type: Sequelize.STRING(50),
                unique: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(50),
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            first_name: {
                type: Sequelize.STRING
            },
            last_name: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.BOOLEAN
            },
            date_of_birth: {
                type: Sequelize.DATEONLY
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            point: {
                type: Sequelize.BIGINT,
                defaultValue: 0
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
    down: function down(queryInterface, Sequelize) {
        return queryInterface.dropTable('Users');
    }
};