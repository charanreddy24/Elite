import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '/src/components/DashSidebar.jsx';
import DashProfile from '/src/components/DashProfile.jsx';
import DashIncidentReports from '../../components/DashIncidentReports.jsx';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* Profile */}
      {tab === 'profile' && <DashProfile />}
      {/* Incident Reports */}
      {tab === 'incidentReports' && <DashIncidentReports />}
    </div>
  );
}
