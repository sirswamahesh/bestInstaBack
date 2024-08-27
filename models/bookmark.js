'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class Bookmark extends Model {
    static associate(models) {
      // Bookmark belongs to User
      Bookmark.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // Bookmark belongs to Post
      Bookmark.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
      });
    }
  }

  Bookmark.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    postId: {
      type: DataTypes.UUID,
      references: {
        model: 'Post',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Bookmark',
    tableName: 'bookmarks',
    timestamps: true,
  });

  return Bookmark;
};
