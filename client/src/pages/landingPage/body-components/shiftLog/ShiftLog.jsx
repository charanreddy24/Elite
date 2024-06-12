import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'flowbite-react';
import FormOne from './FormOne.jsx';
import FormTwo from './FormTwo.jsx';
import toast from 'react-hot-toast';

function getCurrentAndEndHours() {
  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMinutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  const endHours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const endHoursHours = endHours.getHours().toString().padStart(2, '0');
  const endHoursMinutes = endHours.getMinutes().toString().padStart(2, '0');
  const endHoursTime = `${endHoursHours}:${endHoursMinutes}`;

  return { current: currentTime, end: endHoursTime };
}

const times = getCurrentAndEndHours();

export default function ShiftLog() {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [shiftId, setShiftId] = useState(null);
  const [topForm, setTopForm] = useState(true);
  const [startTime, setStartTime] = useState(times.current);
  const [endTime, setEndTime] = useState(times.end);

  const [bottomForm, setBottomForm] = useState(false);
  const [loggedTime, setLoggedTime] = useState(new Date().toLocaleString());
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOneSubmitted, setFormOneSubmitted] = useState(false);

  const [quillData, setQuillData] = useState({
    description: '',
  });

  const [formOneData, setFormOneData] = useState({
    userId: currentUser._id,
    startTime: times.current,
    endTime: times.end,
    relieved: '',
    toBeRelievedBy: '',
    creator: currentUser.username,
    equipment: '',
    uniform: {
      whiteShirt: false,
      blackTie: false,
      badgeID: false,
      blackPants: false,
      securityLogoBlazer: false,
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getUsers');
        const data = await res.json();
        if (res.ok) {
          setUsers((prev) => [...prev, ...data.users]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const res = await fetch(
          `/api/shiftLog/checkActiveShift?userId=${currentUser._id}`,
        );
        const data = await res.json();
        if (data.activeShift) {
          setTopForm(false);
          setBottomForm(true);
          setShiftId(data.activeShift._id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkActiveShift();
  }, [currentUser]);

  // Automatic form submission after 13 hours
  useEffect(() => {
    if (formOneSubmitted) {
      const timer = setTimeout(() => {
        console.log('Automatic form submission:', formOneData, logs);
      }, 13 * 60 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [formOneData, logs, formOneSubmitted]);

  useEffect(() => {
    const fetchShiftLogs = async () => {
      try {
        const res = await fetch(
          `/api/shiftLog/getShiftLogs?userId=${currentUser._id}`,
        );
        const data = await res.json();
        if (res.ok) {
          setLogs(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (shiftId) {
      fetchShiftLogs();
    }
  }, [shiftId, currentUser]);

  const handleFormOneInputChange = (e) => {
    const { name, value } = e.target;
    setFormOneData({ ...formOneData, [name]: value });
    if (name === 'startTime') {
      setStartTime(value);
    } else if (name === 'endTime') {
      setEndTime(value);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormOneData({
      ...formOneData,
      uniform: {
        ...formOneData.uniform,
        [name]: checked,
      },
    });
  };

  const handleFormOneSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shiftLog/createShift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formOneData,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShiftId(data.shiftLog._id);
        setTopForm(false);
        setBottomForm(true);
        setFormOneSubmitted(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setTopForm(false);
    setBottomForm(true);
  };

  const handleRefresh = () => {
    setLoggedTime(new Date().toLocaleString());
  };

  const handleLogSaveChanges = async (e) => {
    e.preventDefault();
    const newLog = {
      time: loggedTime,
      description: quillData.description,
    };
    console.log('Logging Form Two Data:', newLog);
    try {
      const res = await fetch('/api/shiftLog/saveLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shiftId, ...newLog, userId: currentUser._id }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    setLogs([...logs, newLog]);
    setLoggedTime(new Date().toLocaleString());
    setQuillData({ description: '' });
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="text-xl font-bold underline dark:text-black">
          Shift Log
        </h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner size="xl"></Spinner>
        </div>
      ) : (
        <>
          {topForm && (
            <FormOne
              startTime={startTime}
              endTime={endTime}
              formOneData={formOneData}
              users={users}
              handleFormOneInputChange={handleFormOneInputChange}
              handleCheckboxChange={handleCheckboxChange}
              handleFormOneSave={handleFormOneSave}
            />
          )}
          {bottomForm && (
            <FormTwo
              handleRefresh={handleRefresh}
              loggedTime={loggedTime}
              setLoggedTime={setLoggedTime}
              logs={logs}
              setLogs={setLogs}
              quillData={quillData}
              setQuillData={setQuillData}
              handleLogSaveChanges={handleLogSaveChanges}
            />
          )}
        </>
      )}
    </>
  );
}
