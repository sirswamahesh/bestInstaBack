'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class PostLike extends Model {
    static associate(models) {
      // PostLike belongs to User
      PostLike.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // PostLike belongs to Post
      PostLike.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
      });
    }
  }

  PostLike.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    postId: {
      type: DataTypes.UUID,
      references: {
        model: 'posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'PostLike',
    tableName: 'post_likes',
    timestamps: true,
  });

  return PostLike;
};
