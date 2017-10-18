'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.createTable('StoreType_Stores', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
      },
      store_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Stores', // Can be both a string representing the table name, or a reference to the model
          key: "id"
        }
      },
      store_type_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: "StoreTypes", // Can be both a string representing the table name, or a reference to the model
          key: "id"
        }
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
    return queryInterface.dropTable('StoreType_Stores');
  }
};