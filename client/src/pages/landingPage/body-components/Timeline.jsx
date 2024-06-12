import React, { useState, useEffect } from 'react';
import { Timeline, Spinner } from 'flowbite-react';
import { HiCalendar } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function TimelineDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/shiftLog/getShiftReports?sort=desc');
        const data = await res.json();
        if (res.ok) {
          if (Array.isArray(data.reports)) {
            setReports(data.reports);
            if (data.reports.length < 6) {
              setShowMore(false);
            }
          } else {
            toast.error('Unexpected response format');
            setShowMore(false);
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Error fetching reports');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    console.log(reports);

    fetchReports();
  }, []);

  const handleShowMore = async () => {
    const startIndex = reports.length;
    const sortDirection = 'desc';
    try {
      const res = await fetch(
        `/api/shiftLog/getShiftReports?sort=${sortDirection}&startIndex=${startIndex}&limit=6`,
      );
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.reports)) {
          setReports((prev) => [...prev, ...data.reports]);
          if (data.reports.length < 6) {
            setShowMore(false);
            setLoading(false);
          }
        }
      } else {
        toast.error('Unexpected response format');
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold underline dark:text-black mb-4 mx-auto">
        All Shift Logs
      </h1>

      <div className="flex flex-col h-lvh rounded-lg overflow-auto bg-white">
        {reports.length > 0 ? (
          <>
            <Timeline className="p-4 mx-auto">
              {reports.map((report) => (
                <Timeline.Item key={report._id}>
                  <Timeline.Point icon={HiCalendar} />
                  <Timeline.Content className="p-4">
                    <Link
                      to={`/viewShiftReport/${report._id}`}
                      className=" hover:underline mt-2 block"
                    >
                      <Timeline.Time className="text-lg font-semibold hover:text-teal-500 underline">
                        Shift Report: {report.shiftDetails.startTime} to{' '}
                        {report.shiftDetails.endTime} (
                        {new Date(report.shiftDetails.createdAt)
                          .toLocaleString()
                          .slice(0, 10)}
                        )
                      </Timeline.Time>
                    </Link>
                    <Timeline.Body className="text-gray-600">
                      Logged By {report.shiftDetails.creator}
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>
              ))}
            </Timeline>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-3"
              >
                Show More
              </button>
            )}
          </>
        ) : loading ? (
          <div className="flex justify-center items-center">
            <Spinner size="xl"></Spinner>
          </div>
        ) : (
          <p className="flex justify-center items-center">No Shift Reports</p>
        )}
      </div>
    </>
  );
}
