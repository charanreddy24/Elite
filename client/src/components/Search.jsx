import { Button, Select, TextInput, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IncidentReportCard from './IncidentReportCard.jsx';

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    incidentType: 'Trespassers',
    incidentDate: '',
  });
  const [incidentReports, setIncidentReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const typeFromUrl = urlParams.get('incidentType');
    const dateFromUrl = urlParams.get('incidentDate');
    if (searchTermFromUrl || sortFromUrl || typeFromUrl || dateFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        incidentType: typeFromUrl,
        incidentDate: dateFromUrl,
      });
    }

    const fetchIncidentReports = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(
          `/api/incidentReport/getIncidentReports?${searchQuery}`,
        );

        if (res.ok) {
          setLoading(false);
          const data = await res.json();
          setIncidentReports(data.incidentReports);
          setSidebarData((prevData) => ({
            ...prevData,
            searchTerm: '',
          }));
          if (data.incidentReports.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchIncidentReports();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'incidentType') {
      const incidentType = e.target.value || '';
      setSidebarData({ ...sidebarData, incidentType });
    }
    if (e.target.id === 'incidentDate') {
      const incidentDate = e.target.value || '';
      setSidebarData({ ...sidebarData, incidentDate });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('incidentType', sidebarData.incidentType);
    urlParams.set('incidentDate', sidebarData.incidentDate);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfIncidentReports = incidentReports.length;
    const startIndex = numberOfIncidentReports;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(
      `/api/incidentReport/getIncidentReports?${searchQuery}`,
    );
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setIncidentReports([...incidentReports, ...data.incidentReports]);
      if (data.incidentReports.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className=" flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search"
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Incident Type:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.incidentType}
              id="incidentType"
            >
              <option value="Trespassers">Trespassers</option>
              <option value="Elevator Related">Elevator Related</option>
              <option value="Alarm Occurrence">Alarm Occurrence</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Date:</label>
            <input
              className="w-full ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="date"
              id="incidentDate"
              value={sidebarData.incidentDate}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            outline
            className="bg-gradient-to-r from-slate-800 via-slate-500 to-slate-300"
          >
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && incidentReports.length === 0 && (
            <p className="text-xl text-gray-500"> Nothing Found</p>
          )}
          {loading && (
            <div className="mx-auto">
              <Spinner size="xl"></Spinner>
            </div>
          )}

          {!loading &&
            incidentReports &&
            incidentReports.map((incidentReport) => (
              <IncidentReportCard
                key={incidentReport._id}
                incidentReport={incidentReport}
              />
            ))}
          {showMore && (
            <button
              className="text-teal-500 text-lg hover:underline p-7 w-full"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
