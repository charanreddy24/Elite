import { TextInput, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '/src/redux/conversations/conversationsSlice.js';
import { Spinner } from 'flowbite-react';

const MessageInput = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { messages, selectedConversation } = useSelector(
    (state) => state.conversations,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage) return;
    await handleSendMessage(inputMessage);
    setInputMessage('');
  };
  const handleSendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        },
      );
      const data = await res.json();
      dispatch(setMessages([...messages, data]));
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-2/3 h-24">
      <div className=" relative">
        <Textarea
          type="text"
          placeholder="Enter the Pass-On"
          className=" rounded-lg"
          rows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-6"
        >
          {loading ? (
            <div className="mx-auto">
              <Spinner size="xl"></Spinner>
            </div>
          ) : (
            <IoIosSend size={36} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
