import errorHandler from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { getUsersBasedOnLastMessage } from '../utils/getUsersBasedOnLastMessage.js';

export const test = (req, res) => {
  res.json({ message: 'API is working' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be atleast 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must not be greater than 20 characters'),
      );
    }
    if (!req.body.username.match(/^[a-zA-Z\s]+$/)) {
      return next(
        errorHandler(400, 'Username cannot have special characters or numbers'),
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true },
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;

    //Getting only already established chats
    const usersBasedOnLastMessage = await getUsersBasedOnLastMessage(userId);

    const userIdsFromLastMessage = new Set(
      usersBasedOnLastMessage.map((user) => user._id.toString()),
    );

    const usersWithOutCurrentUser = await User.find({
      _id: { $ne: userId, $nin: [...userIdsFromLastMessage] },
    }).lean();

    //Combining both the established chats and remaining users
    const remainingUsers = [
      ...usersBasedOnLastMessage,
      ...usersWithOutCurrentUser,
    ];

    const usersList = await User.find({ _id: { $ne: userId } }).lean();
    const allUsersList = await User.find({}).lean();

    const removePassword = (userList) => {
      return userList.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });
    };

    const usersPasswordRemoved = removePassword(usersList);
    const allUsersWithoutPassword = removePassword(allUsersList);
    const usersBasedOnLastMessageWithoutPassword =
      removePassword(remainingUsers);

    const filteredUsersBasedOnLastMessage =
      usersBasedOnLastMessageWithoutPassword.filter(
        (user) => user._id.toString() !== userId,
      );

    res.status(200).json({
      users: usersPasswordRemoved,
      allUsers: allUsersWithoutPassword,
      usersBasedOnLastMessage: filteredUsersBasedOnLastMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  const userId = req.params.userId;
  const userDetails = await User.findById(userId).lean();
  res.status(200).json({ userDetails });
};
