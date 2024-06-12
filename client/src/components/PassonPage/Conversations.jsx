import { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';
import Conversation from './Conversation.jsx';
import { useDispatch } from 'react-redux';
import { setUnreadCounts } from '/src/redux/conversations/conversationsSlice.js';

const Conversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/getUsers');
        const data = await res.json();
        if (res.ok) {
          setConversations((prev) => [
            ...prev,
            ...data.usersBasedOnLastMessage,
          ]);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    const fetchUnreadCounts = async () => {
      try {
        const res = await fetch('/api/messages/unreadCounts');
        const data = await res.json();

        if (res.ok) {
          dispatch(setUnreadCounts(data));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getConversations();
    fetchUnreadCounts();
  }, [dispatch]);

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
      {loading ? (
        <div className="mx-auto">
          <Spinner size="xl"></Spinner>
        </div>
      ) : null}
    </div>
  );
};

export default Conversations;
