import { Avatar } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedConversation,
  clearUnreadCount,
} from '/src/redux/conversations/conversationsSlice.js';
import { useSocketContext } from '../SocketContext.jsx';

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, unreadCounts } = useSelector(
    (state) => state.conversations,
  );
  const dispatch = useDispatch();

  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  const unreadCount = unreadCounts?.[conversation._id] || 0;

  const handleClick = () => {
    dispatch(setSelectedConversation(conversation));
    dispatch(clearUnreadCount(conversation._id));
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center border-2 bg-slate-300 dark:bg-slate-400 border-slate-100 rounded-lg p-5 cursor-pointer ${
          isSelected ? 'bg-slate-400 text-white ' : ''
        }`}
        onClick={handleClick}
      >
        <Avatar
          alt="user"
          img={conversation.profilePicture}
          rounded
          status={`${isOnline ? 'online' : 'busy'}`}
          statusPosition="top-right"
        />

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="ml-2">{conversation.username}</p>
            {unreadCount > 0 && (
              <span className="ml-2 text-red-500 font-semibold bg-white p-1.5 mt-2 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1"></div>}
    </>
  );
};

export default Conversation;
