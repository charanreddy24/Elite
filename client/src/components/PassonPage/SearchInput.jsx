import { Alert, TextInput, Toast } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedConversation } from '/src/redux/conversations/conversationsSlice.js';
import toast from 'react-hot-toast';

const SearchInput = () => {
  const [search, setSearch] = useState('');
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
          setConversations((prev) => [...prev, ...data.users]);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    if (search.length < 3) {
      return toast.error('Search term must be at least 3 characters long');
    }

    const conversation = conversations.find((c) =>
      c.username.toLowerCase().includes(search.toLowerCase()),
    );
    if (conversation) {
      dispatch(setSelectedConversation(conversation));
      setSearch('');
    } else {
      toast.error('No such user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <TextInput
        type="text"
        placeholder="Search.."
        className="rounded-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="bg-slate-300 rounded-full p-1">
        <AiOutlineSearch className="w-7 h-7 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
