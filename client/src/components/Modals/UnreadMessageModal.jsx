import { Button, Modal } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiOutlineMail } from 'react-icons/hi';
import axios from 'axios';

export default function UnreadMessageModal() {
  const [openModal, setOpenModal] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);

  const fetchUsername = async (userId) => {
    const response = await axios.get(`/api/user/getUserDetails/${userId}`);
    return response.data.userDetails.username;
  };

  const handleUsername = async (userId) => {
    return await fetchUsername(userId);
  };

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get('/api/messages/unread-messages');
        if (response.data.hasUnreadMessages) {
          const messagesWithUsernames = await Promise.all(
            response.data.unreadMessages.map(async (message) => ({
              ...message,
              senderUsername: await handleUsername(message.senderId),
            })),
          );
          setUnreadMessages(messagesWithUsernames);
          setOpenModal(true);
        } else {
          setOpenModal(false);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    const intervalId = setInterval(fetchUnreadMessages, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineMail className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              You have unread Pass-Ons!
            </h3>
            <ul className="mb-5 text-left">
              {unreadMessages.map((message) => (
                <li key={message._id} className="mb-2">
                  <strong>From:</strong> {message.senderUsername} <br />
                  <strong>Pass-On:</strong> {message.message}
                </li>
              ))}
            </ul>
            <Button
              className="mx-auto"
              color="failure"
              onClick={() => setOpenModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
