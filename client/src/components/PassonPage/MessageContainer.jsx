import React, { useEffect } from 'react';
import Messages from './Messages.jsx';
import MessageInput from './MessageInput.jsx';
import { TiMessages } from 'react-icons/ti';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedConversation,
  setMessages,
} from '/src/redux/conversations/conversationsSlice.js';

const MessageContainer = () => {
  const { selectedConversation } = useSelector((state) => state.conversations);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    //cleanup function (unmounts)
    return () => dispatch(setSelectedConversation(null));
  }, [dispatch]);

  return (
    <div className="flex flex-col grow items-center justify-center shrink-0 overflow-hidden">
      {!selectedConversation ? (
        <NoChatSelected username={currentUser.username} />
      ) : (
        <>
          <div className="px-4 py-2 mb-2">
            <span className="label-text"> To:</span>
            <span className="text-gray-900 dark:text-white font-bold">
              {selectedConversation.username}
            </span>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = ({ username }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center font-semibold flex flex-col items-center gap-2">
        <p>Welcome {username}</p>
        <p>Select a user to send a pass-on</p>
        <TiMessages className="text-3xl text-center" />
      </div>
    </div>
  );
};
