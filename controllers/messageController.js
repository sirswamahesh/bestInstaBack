const { Sequelize } = require("sequelize");
const db = require("../models");
const { getReceiverSocketId, io } = require("../app");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await db.Conversation.findOne({
      where: {
        participants: { [Sequelize.Op.contains]: [senderId, receiverId] },
      },
    });
    if (!conversation) {
      conversation = await db.Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await db.Message.create({
      senderId,
      receiverId,
      message,
      conversationId: conversation.id,
    });

    // implement socket io for real time data transfer
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the message.",
    });
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await db.Conversation.findOne({
      where: {
        participants: { [Sequelize.Op.contains]: [senderId, receiverId] },
      },
      attributes: { exclude: ["participants", "id", "createdAt", "updatedAt"] },
      include: [
        {
          model: db.Message,
          as: "messages",
          order: [["createdAt", "ASC"]],
        },
      ],
    });
    if (!conversation)
      return res.status(200).json({ success: false, messages: "" });

    return res
      .status(200)
      .json({ success: true, messages: conversation.messages });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendMessage, getMessage };
