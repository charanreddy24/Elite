import React, { useEffect, useState, useRef } from 'react';
import Message from './Message.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../../redux/conversations/conversationsSlice.js';
import { MessageSkeleton } from '../MessageSkeleton.jsx';
import ListenMessages from './ListenMessages.jsx';

const Messages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, selectedConversation } = useSelector(
    (state) => state.conversations,
  );
  const dispatch = useDispatch();
  const lastMessageRef = useRef();
  ListenMessages();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();
        dispatch(setMessages(data));
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
        inline: 'nearest',
      });
    }, 5);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto custom-scrollbar w-full">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(2)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center">Send a pass on</p>
      )}
    </div>
  );
};

export default Messages;
