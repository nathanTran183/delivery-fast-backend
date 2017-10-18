'use strict';

module.exports = function (sequelize, DataTypes) {
  var StoreType = sequelize.define('StoreType', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
      }
    }
  });
  StoreType.associate = function (models) {
    StoreType.belongsToMany(models.Store, {
      through: models.StoreType_Store,
      as: 'stores'
    });
  };
  return StoreType;
};