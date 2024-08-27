'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ConversationParticipants extends Model {}

  ConversationParticipants.init({
    conversationId: {
      type: DataTypes.UUID,
      references: {
        model: 'Conversation',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
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
  }, {
    sequelize,
    modelName: 'ConversationParticipants',
    tableName: 'conversation_participants',
    timestamps: false,
  });

  return ConversationParticipants;
};
