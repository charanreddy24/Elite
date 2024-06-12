import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashIncidentReports() {
  const { currentUser } = useSelector((state) => state.user);
  const [userIncidentReports, setUserIncidentReports] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchIncidentReports = async () => {
      try {
        const res = await fetch(
          `/api/incidentReport/getIncidentReports?userId=${currentUser._id}`,
        );
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setUserIncidentReports(data.incidentReports);
          if (data.incidentReports.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchIncidentReports();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userIncidentReports.length;
    try {
      const res = await fetch(
        `/api/incidentReport/getIncidentReports?userId=${currentUser._id}&startIndex=${startIndex}`,
      );
      const data = await res.json();
      if (res.ok) {
        setUserIncidentReports((prev) => [...prev, ...data.incidentReports]);
        if (data.incidentReports.length < 9) {
          setShowMore(false);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userIncidentReports.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Files</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Incident Type</Table.HeadCell>
              <Table.HeadCell>Logged By</Table.HeadCell>
              <Table.HeadCell>
                <span>View</span>
              </Table.HeadCell>
            </Table.Head>
            {userIncidentReports.map((incidentReport) => (
              <Table.Body className="divide-y" key={incidentReport._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(incidentReport.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="flex flex-col gap-4">
                    {incidentReport.files &&
                      incidentReport.files.map((file, index) => (
                        <a
                          key={index}
                          href={file.fileUrl}
                          target="_blank"
                          download={file.filename}
                          className="text-teal-500 dark:text-teal-300 hover:underline hover:cursor-pointer"
                        >
                          {index + 1}. {file.filename}
                        </a>
                      ))}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-teal-500 dark:text-white hover:underline hover:cursor-pointer"
                      to={`/view-incidentReport/${incidentReport._id}`}
                    >
                      {incidentReport.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{incidentReport.column}</Table.Cell>
                  <Table.Cell>{incidentReport.incidentType}</Table.Cell>
                  <Table.Cell>
                    <Link
                      to={'?tab=profile'}
                      className="font-medium text-teal-500 dark:text-white hover:underline hover:cursor-pointer"
                    >
                      {incidentReport.loggedBy}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/view-incidentReport/${incidentReport._id}`}
                    >
                      <span>View</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : loading ? (
        <div className="col-span-2 flex justify-center items-center">
          <Spinner size="xl"></Spinner>
        </div>
      ) : (
        <p>You have created no incident reports</p>
      )}
    </div>
  );
}
