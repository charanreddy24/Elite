import moment from 'moment';
import { useEffect, useState } from 'react';

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/user/getUsers');
        const data = await res.json();
        const commentedUser = data.allUsers.find(
          (user) => user._id === comment.userId,
        );
        if (res.ok) {
          setUser(commentedUser);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 dark:text-teal-300 text-cyan-600 hover:underline truncate">
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className="text-gray-500 dark:text-white text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 dark:text-white pb-2 text-justify">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
