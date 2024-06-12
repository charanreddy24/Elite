// App.js
import React, { useState, useEffect } from 'react';
import Sidebar from '/src/pages/landingPage/sidebar/Sidebar.jsx';
import Header from '/src/pages/landingPage/header/Header.jsx';
import MainBody from '/src/pages/landingPage/body-components/MainBody.jsx';
import UnitFile from '/src/pages/landingPage/body-components/UnitFile.jsx';
import ShiftLog from '/src/pages/landingPage/body-components/shiftLog/ShiftLog.jsx';
import PassOn from '/src/pages/landingPage/body-components/PassOn.jsx';
import TimelineDashboard from '/src/pages/landingPage/body-components/Timeline.jsx';

const LandingPage = () => {
  const [selectedOption, setSelectedOption] = useState('Incident Report');
  const [sideBarSelectedOption, setSideBarSelectedOption] =
    useState('MainBody');
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSideBarButtonClick = (option) => {
    setSideBarSelectedOption(option);
  };

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  const renderSelectedPage = () => {
    switch (sideBarSelectedOption) {
      case 'MainBody':
        return (
          <MainBody
            selectedOption={selectedOption}
            handleSelectChange={handleSelectChange}
          />
        );
      case 'Timeline':
        return <TimelineDashboard />;
      case 'UnitFile':
        return <UnitFile />;
      case 'ShiftLog':
        return <ShiftLog />;
      case 'PassOn':
        return <PassOn />;
      default:
        return (
          <MainBody
            selectedOption={selectedOption}
            handleSelectChange={handleSelectChange}
          />
        );
    }
  };

  return (
    <div className="flex bg-slate-200 h-dvh overflow-x-auto overflow-y-hidden">
      <div
        className={`${
          showSidebar ? 'block' : 'hidden'
        } h-dvh w-fit xl:w-1/6 flex flex-col p-4 shadow-md bg-gradient-to-r from-slate-600 via-slate-500 to-slate-400`}
      >
        <Sidebar handleSideBarButtonClick={handleSideBarButtonClick} />
      </div>

      <div className=" w-full flex flex-col p-2 gap-y-2 shrink-0 lg:flex-shrink ">
        <Header handleSidebarToggle={handleSidebarToggle} />
        {renderSelectedPage()}
      </div>
    </div>
  );
};

export default LandingPage;
