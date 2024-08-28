"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Post extends Model {
    static associate(models) {
        // Post belongs to User
        Post.belongsTo(models.User, {
          foreignKey: 'authorId',
          as: 'author',
        });
        Post.hasMany(models.Comment, {
          foreignKey: 'postId',
          as: 'comments',
        });
        Post.hasMany(models.PostLike, {
          foreignKey: 'postId',
          as: 'likes',
        });
      }
  }

  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      caption: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    }
  );

  return Post;
};
