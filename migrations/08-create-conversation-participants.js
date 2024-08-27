'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('conversation_participants', {
      conversationId: {
        type: Sequelize.UUID,
        references: {
          model: 'conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('conversation_participants');
  }
};
