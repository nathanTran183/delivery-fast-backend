'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Employees', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            username: {
                type: Sequelize.STRING(50),
                unique: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(50),
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                isNumeric: true,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            gender: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            date_of_birth: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            role: {
                type: Sequelize.ENUM('Admin', 'Staff', 'DeliMan'),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('Active', 'Busy', 'Deactivated'),
                allowNull: false,
                defaultValue: 'Active'
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
        return queryInterface.dropTable('Employees');
    }
};