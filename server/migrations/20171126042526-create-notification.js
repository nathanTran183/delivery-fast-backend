'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notifications', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
      title: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.STRING
      },
        image_url: {
            type: Sequelize.STRING
        },
        user_id: {
          type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Notifications');
  }
};