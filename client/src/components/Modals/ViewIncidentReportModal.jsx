import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import { torontoTimeOptions } from '../../pages/landingPage/header/Clock.jsx';
import { FaTimes } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import CommentSection from '../CommentSection.jsx';

export default function ViewIncidentReportModal() {
  const [showModal, setShowModal] = useState(true);
  const draggableRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [userIncidentReports, setUserIncidentReports] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    loggedDate: '',
    incidentType: 'Trespassers',
    loggedBy: `${currentUser ? currentUser.username : ''}`,
    incidentDate: `${new Date().toISOString().split('T')[0]}`,
    description: '',
    files: '',
    id: Math.random().toString(),
    column: 'Incident Report Created',
  });
  const [loggedDate, setLoggedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { incidentReportId } = useParams();

  useEffect(() => {
    try {
      const fetchIncidentReport = async () => {
        const res = await fetch(
          `/api/incidentReport/getIncidentReports?incidentReportId=${incidentReportId}`,
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setUserIncidentReports(data.incidentReports);
          const updatedFormData = {
            ...data.incidentReports[0],
            incidentDate: data.incidentReports[0].incidentDate.split('T')[0],
          };
          setFormData(updatedFormData);
          setLoggedDate(updatedFormData.loggedDate);
          setLoading(false);
        }
      };
      fetchIncidentReport();
    } catch (error) {
      console.log(error);
    }
  }, [incidentReportId]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <>
      {showModal && (
        <>
          <main
            encType={'multipart/form-data'}
            className="dark:text-white justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div
              className="relative w-auto my-6 h-dvh mx-auto max-w-6xl"
              ref={draggableRef}
            >
              {/*content*/}
              <div className="dark:bg-slate-500 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t modal-header cursor-move">
                  <h3 className="text-xl font-semibold">Incident Report</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 dark:text-white text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={handleClose}
                  >
                    <FaTimes className="text-red-500" />
                  </button>
                </div>
                {/*body*/}

                <div className="relative p-6 space-y-6 flex-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {loading ? (
                      <div className="col-span-2 flex justify-center items-center">
                        <Spinner size="xl"></Spinner>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <strong className="mr-2">Title:</strong>
                        <input
                          className="w-full  ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          type="text"
                          name="title"
                          value={formData.title}
                          required
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <strong className="mr-2">Logged On:</strong> {loggedDate}
                    </div>
                    <div className="flex items-center">
                      <strong>Type of Incident:</strong>
                      <select
                        disabled
                        name="incidentType"
                        value={formData.incidentType}
                        className="w-full ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="Trespassers">Trespassers</option>
                        <option value="Elevator Related">
                          Elevator Related
                        </option>
                        <option value="Alarm Occurrence">
                          Alarm Occurrence
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <strong className="mr-2">Logged By:</strong>{' '}
                      {currentUser ? currentUser.username : ''}
                    </div>
                    <div className="flex items-center">
                      <strong>Date of Incident:</strong>
                      <input
                        disabled
                        className="w-full ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="date"
                        name="incidentDate"
                        value={formData.incidentDate}
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="mb-12">
                        <strong className="mr-2">Description:</strong>
                        <div
                          className="p-3 max-w-4xl mx-auto w-full incidentReport-content"
                          dangerouslySetInnerHTML={{
                            __html: formData && formData.description,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="mb-4 ">
                        <strong className="mr-2">Uploaded Files:</strong>
                        <div className="flex flex-col">
                          {userIncidentReports &&
                            userIncidentReports.map(
                              (incidentReport) =>
                                incidentReport.files &&
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
                                )),
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CommentSection incidentReportId={incidentReportId} />
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 border rounded-lg dark:bg-white hover:bg-rose-100 dark:hover:bg-rose-200 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleClose}
                  >
                    Close
                  </button>

                  {/* {publishError && (
                      <Alert color="failure" className="mt-5">
                        {publishError}
                      </Alert>
                    )} */}
                </div>
              </div>
            </div>
          </main>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}
