// Sidebar.js
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { HiIdentification, HiClock, HiUser } from 'react-icons/hi';
import { FcTimeline } from 'react-icons/fc';
import { PiHandshake } from 'react-icons/pi';
import React from 'react';

const Sidebar = ({ handleSideBarButtonClick }) => {
  const handleClick = (option) => {
    handleSideBarButtonClick(option);
  };
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate('/dashboard?tab=profile');
  };
  return (
    <>
      <div className="flex flex-col items-center md:justify-evenly sm:justify-start gap-y-4 p-4 h-full overflow-y-auto">
        <Button
          className="w-full flex items-center justify-start mb-4 bg-gradient-to-r from-slate-800 to-slate-300 hover:from-slate-600 hover:to-gray-800 text-white"
          outline
          onClick={() => handleClick('Home')}
          pill
        >
          <FaHome className="text-xl mr-2" />
          <span>Home</span>
        </Button>

        <Button
          className="w-full flex items-center justify-start mb-4 bg-gradient-to-r from-slate-800 to-slate-300 hover:from-slate-600 hover:to-gray-800 text-white"
          outline
          onClick={() => handleClick('Timeline')}
          pill
        >
          <FcTimeline className="text-xl mr-2" />
          <span>Timeline</span>
        </Button>

        <Button
          className="w-full flex items-center justify-start mb-4 bg-gradient-to-r from-slate-800 to-slate-300 hover:from-slate-600 hover:to-gray-800 text-white"
          outline
          onClick={() => handleClick('UnitFile')}
          pill
        >
          <HiIdentification className="text-xl mr-2" />
          <span>Unit File</span>
        </Button>

        <Button
          className="w-full flex items-center justify-start mb-4 bg-gradient-to-r from-slate-800 to-slate-300 hover:from-slate-600 hover:to-gray-800 text-white"
          outline
          onClick={() => handleClick('ShiftLog')}
          pill
        >
          <HiClock className="text-xl mr-2" />
          <span>Shift Log</span>
        </Button>

        <Button
          className="w-full flex items-center justify-start mb-4 bg-gradient-to-r from-slate-800 to-slate-300 hover:from-slate-600 hover:to-gray-800 text-white"
          outline
          onClick={() => handleClick('PassOn')}
          pill
        >
          <PiHandshake className="text-xl mr-2" />
          <span>Pass On</span>
        </Button>

        <hr className="w-full my-4 border-gray-900" />

        <Button
          className="w-full flex items-center justify-start bg-gradient-to-r from-slate-800 to-slate-300 hover:from-slate-600 hover:to-gray-800 text-white"
          outline
          onClick={handleProfileClick}
          pill
        >
          <HiUser className="text-3xl mr-2" />
          <span>User Profile</span>
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
