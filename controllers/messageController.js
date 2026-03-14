const Message = require("../models/messageSchema");
const Conversation = require("../models/conversationSchema");
const mongoose = require("mongoose");

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text, fileUrl, fileType } = req.body;

    const senderId = new mongoose.Types.ObjectId(req.user.id);
    const targetId = new mongoose.Types.ObjectId(recipientId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, targetId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, targetId],
      });
    }

    const newMessage = await Message.create({
      conversationId: conversation._id.toString(),
      senderId: senderId,
      recipientId: targetId,
      text: text?.trim() || "",
      fileUrl: fileUrl || null,
      fileType: fileType || null,
    });

    conversation.lastMessage = newMessage._id;
    conversation.lastMessageText = text?.trim() || (fileUrl ? "[file]" : "");
    await conversation.save();

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
exports.getChatHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const myId = req.user.id;
    console.log("Fetching chat history for conversation:", conversationId);
    console.log("Authenticated user ID:", myId);
    const conversation = await Conversation.findOne({
      participants: { $all: [myId, conversationId] },
    });
    if (!conversationId) {
      return res.status(404).json([]);
    }
    console.log("Found conversation:", conversation);
    const messages = await Message.find({
      conversationId: conversation._id.toString(),
    }).sort({ createdAt: 1 });
    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const { recipientId, text } = req.body;

    if (!req.file)
      return res.status(400).json({
        status: "error",
        message: "No file provided",
      });
    if (!recipientId)
      return res.status(400).json({
        status: "error",
        message: "Recipient ID is missing",
      });
    const senderId = new mongoose.Types.ObjectId(req.user.id);
    const targetId = new mongoose.Types.ObjectId(recipientId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, targetId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, targetId],
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/messages/${req.file.filename}`;

    const newMessage = await Message.create({
      conversationId: conversation._id.toString(),
      senderId: senderId,
      recipientId: targetId,
      text: text?.trim() || "",
      fileUrl: fileUrl,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
    });

    conversation.lastMessage = newMessage._id;
    conversation.lastMessageText = text?.trim() || "[file]";
    await conversation.save();
    res.status(201).json({
      success: true,
      // message: "File uploaded successfully",
     newMessage,
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error during file upload",
      error: error.message,
    });
  }
};
