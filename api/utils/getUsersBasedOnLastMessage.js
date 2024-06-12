import Conversation from '../models/conversation.model.js';
import User from '../models/user.model.js';

export const getUsersBasedOnLastMessage = async (userId) => {
  const result = await Conversation.aggregate([
    {
      $lookup: {
        from: 'messages',
        localField: 'messages',
        foreignField: '_id',
        as: 'messages',
      },
    },
    {
      $unwind: '$messages',
    },
    {
      $sort: {
        'messages.createdAt': -1,
      },
    },
    {
      $group: {
        _id: '$_id',
        latestMessage: {
          $first: '$messages',
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'latestMessage.senderId',
        foreignField: '_id',
        as: 'sender',
      },
    },
    {
      $unwind: '$sender',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'latestMessage.receiverId',
        foreignField: '_id',
        as: 'receiver',
      },
    },
    {
      $unwind: '$receiver',
    },
    {
      $project: {
        _id: 0,
        latestMessage: 1,
        sender: {
          _id: 1,
          username: 1,
          email: 1,
          profilePicture: 1,
        },
        receiver: {
          _id: 1,
          username: 1,
          email: 1,
          profilePicture: 1,
        },
      },
    },
    {
      $sort: {
        'latestMessage.createdAt': -1,
      },
    },
  ]);

  const users = [];
  const userIds = new Set();

  result.forEach((item) => {
    if (!userIds.has(item.sender._id.toString())) {
      users.push(item.sender);
      userIds.add(item.sender._id.toString());
    }
    if (!userIds.has(item.receiver._id.toString())) {
      users.push(item.receiver);
      userIds.add(item.receiver._id.toString());
    }
  });

  return users;
};
