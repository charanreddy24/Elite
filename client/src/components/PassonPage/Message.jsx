import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Message = ({ message }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { selectedConversation } = useSelector((state) => state.conversations);

  const fromMe = message.senderId === currentUser._id;
  const chatClassName = fromMe
    ? 'self-end bg-violet-300'
    : 'self-start bg-gray-100 dark:bg-gray-700';
  const profilePic = fromMe
    ? currentUser.profilePicture
    : selectedConversation?.profilePicture;
  const bubbleBgColor = fromMe
    ? 'bg-slate-400'
    : 'bg-gray-100 dark:bg-gray-700';

  return (
    <div
      className={`flex items-start gap-2.5 mb-1 ${
        fromMe ? 'justify-end' : 'justify-start'
      } `}
    >
      {!fromMe && (
        <img
          className="w-8 h-8 rounded-full"
          src={profilePic}
          alt="profile pic"
        />
      )}
      <div
        className={`flex flex-col max-w-[320px] leading-1.5 p-4 border border-gray-200 rounded-xl ${bubbleBgColor} `}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {fromMe ? 'You' : selectedConversation?.username}
          </span>
          <span className="text-sm font-normal text-black dark:text-white">
            {moment(message.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {message.message}
        </p>
      </div>
      {fromMe && (
        <img
          className="w-8 h-8 rounded-full"
          src={profilePic}
          alt="profile pic"
        />
      )}
    </div>
  );
};

export default Message;
