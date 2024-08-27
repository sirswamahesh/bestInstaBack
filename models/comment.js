'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      // Comment belongs to User
      Comment.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author',
      });

      // Comment belongs to Post
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
      });
    }
  }

  Comment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorId: {
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
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
  });

  return Comment;
};
