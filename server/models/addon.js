'use strict';
module.exports = function(sequelize, DataTypes) {
  var Addon = sequelize.define('Addon', {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          primaryKey: true,
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false
      },
      role: {
        type: DataTypes.BOOLEAN,
          allowNull: false
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
    Addon.associate = (models) => {
        Addon.belongsTo(models.Category, {
            foreignKey: 'category_id',
            onDelete: 'CASCADE',
        });
        Addon.hasMany(models.ProductAddon, {
            foreignKey: 'addon_id',
            as: 'productAddons',
        });
    };
  return Addon;
};