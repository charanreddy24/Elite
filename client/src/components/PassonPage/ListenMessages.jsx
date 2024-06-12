import React, { useEffect } from 'react';
import { useSocketContext } from '../SocketContext.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMessages,
  setUnreadCounts,
} from '/src/redux/conversations/conversationsSlice.js';
import notificationSound from '/src/assets/sounds/notification.mp3';

const ListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, selectedConversation, unreadCounts } = useSelector(
    (state) => state.conversations,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      const passOnNotification = new Audio(notificationSound);
      passOnNotification.play();
      if (newMessage.senderId === selectedConversation._id) {
        dispatch(setMessages([...messages, newMessage]));
      } else {
        const newUnreadCounts = { ...unreadCounts };
        newUnreadCounts[newMessage.senderId] =
          (newUnreadCounts[newMessage.senderId] || 0) + 1;
        dispatch(setUnreadCounts(newUnreadCounts));
      }
    });

    return () => socket?.off('newMessage');
  }, [socket, setMessages, messages, selectedConversation, unreadCounts]);
};

export default ListenMessages;
