import React from 'react';
import PassOnSideBar from '../../../components/PassonPage/PassOnSideBar.jsx';
import MessageContainer from '../../../components/PassonPage/MessageContainer.jsx';

export default function PassOn() {
  return (
    <div className="flex h-dvh rounded-lg overflow-auto bg-gray-400 dark:bg-slate-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <PassOnSideBar />
      <MessageContainer />
    </div>
  );
}
