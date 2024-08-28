"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Message extends Model {
    static associate(models) {
      // Message belongs to Sender (User)
      Message.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });

      // Message belongs to Receiver (User)
      Message.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
      });

      // Message belongs to Conversation
      Message.belongsTo(models.Conversation, {
        foreignKey: "conversationId",
        as: "conversation",
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      conversationId: {
        type: DataTypes.UUID,
        references: {
          model: "Conversation",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: true,
    }
  );

  return Message;
};
