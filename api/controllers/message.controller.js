import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      isRead: false,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('messages');

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;
    messages.forEach(async (message) => {
      if (
        message.receiverId.toString() === senderId.toString() &&
        !message.isRead
      ) {
        message.isRead = true;
        await message.save();
      }
    });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const getUnreadCounts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate('messages');

    const unreadCounts = {};

    conversations.forEach((conversation) => {
      const otherUserId = conversation.participants.find(
        (id) => id.toString() !== userId.toString(),
      );

      const unreadMessages = conversation.messages.filter(
        (message) =>
          message.receiverId.toString() === userId.toString() &&
          !message.isRead,
      );

      if (!unreadCounts[otherUserId]) {
        unreadCounts[otherUserId] = 0;
      }

      unreadCounts[otherUserId] += unreadMessages.length;
    });

    res.status(200).json(unreadCounts);
  } catch (error) {
    next(error);
  }
};

export const unreadMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const unreadMessages = await Message.find({
      receiverId: userId,
      isRead: false,
    });
    if (unreadMessages.length > 0) {
      return res.status(200).json({ hasUnreadMessages: true, unreadMessages });
    }

    return res.status(200).json({ hasUnreadMessages: false });
  } catch (error) {
    next(error);
  }
};
