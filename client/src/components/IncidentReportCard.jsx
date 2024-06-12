import React from 'react';
import { Link } from 'react-router-dom';

const IncidentReportCard = ({ incidentReport }) => {
  return (
    <div className="w-80 h-64 mx-auto my-4 border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <Link to={`/view-incidentReport/${incidentReport._id}`} className="block">
        <div className="bg-gray-100 p-4 cursor-pointer">
          <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-500 hover:underline transition duration-300 ease-in-out">
            {incidentReport.title.toUpperCase()}
          </h1>
        </div>
      </Link>
      <div className="p-4 ">
        <div className="flex flex-col space-y-2">
          <span className="text-sm italic text-gray-600 dark:text-white">
            {incidentReport.incidentType}
          </span>
          <p
            className="line-clamp-5 text-gray-800 dark:text-white"
            dangerouslySetInnerHTML={{
              __html: incidentReport && incidentReport.description,
            }}
          ></p>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportCard;
