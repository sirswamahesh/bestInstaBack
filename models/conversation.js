'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class Conversation extends Model {
    static associate(models) {
      // Conversation has many Users (Participants)
      Conversation.belongsToMany(models.User, {
        through: 'ConversationParticipants',
        as: 'participants',
        foreignKey: 'conversationId',
      });

      // Conversation has many Messages
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversationId',
        as: 'messages',
      });
    }
  }

  Conversation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversations',
    timestamps: true,
  });

  return Conversation;
};
