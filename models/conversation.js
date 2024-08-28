"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.Message, {
        foreignKey: "conversationId",
        as: "messages",
      });
    }
  }

  Conversation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
      },
      participants: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
      tableName: "conversations",
    }
  );

  return Conversation;
};
