'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // User has many Posts
      User.hasMany(models.Post, {
        foreignKey: 'authorId',
        as: 'posts',
      });
      User.hasMany(models.Bookmark, {
        foreignKey: 'userId',
        as: 'bookmarks',
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
