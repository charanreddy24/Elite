import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Textarea, Checkbox, Spinner, Timeline } from 'flowbite-react';
import { IoIosCheckmark } from 'react-icons/io';
import toast from 'react-hot-toast';

export default function ViewShiftReportModal() {
  const [showModal, setShowModal] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [shiftReport, setShiftReport] = useState(null);
  const [uniformData, setUniformData] = useState(null);
  const navigate = useNavigate();
  const { shiftLogId } = useParams();

  useEffect(() => {
    const fetchShiftReport = async () => {
      try {
        const res = await fetch(`/api/shiftLog/viewShiftReport/${shiftLogId}`);
        const data = await res.json();
        if (res.ok) {
          setShiftReport(data);
          if (data.shiftDetails.uniform) {
            fetchUniformData(data.shiftDetails.uniform);
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Error fetching report details');
        console.log(error);
      }
    };

    const fetchUniformData = async (uniformId) => {
      try {
        const res = await fetch(`/api/shiftLog/uniform/${uniformId}`);
        const data = await res.json();
        if (res.ok) {
          setUniformData(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Error fetching uniform data');
        console.log(error);
      }
    };

    fetchShiftReport();
  }, [shiftLogId]);

  const handleClose = () => {
    setShowModal(false);
    navigate(-1);
  };

  if (!shiftReport) {
    return <div>No report found</div>;
  }

  return (
    <div>
      {showModal && (
        <>
          <main className="dark:text-white justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 h-dvh mx-auto max-w-6xl">
              <div className="dark:bg-slate-500 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t modal-header cursor-move">
                  <h3 className="text-xl font-semibold">Shift Report</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 dark:text-white text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={handleClose}
                  >
                    <FaTimes className="text-red-500" />
                  </button>
                </div>
                {shiftReport && shiftReport.shiftDetails ? (
                  <main className="flex flex-col gap-2 h-4/5 sm:shrink-0 overflow-y-auto">
                    <div className="text-sm p-4 w-full bg-white dark:bg-gray-800 rounded-lg flex flex-col ">
                      <div className="grid grid-cols-2 ml-6 gap-4 place-items-center">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <strong>Shift Start Time:</strong>
                            <span className="ml-5">
                              {shiftReport.shiftDetails.startTime}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <strong>Shift End Time:</strong>
                            <span className="ml-7">
                              {shiftReport.shiftDetails.endTime}
                            </span>
                          </div>
                          <div className="flex items-center py-4">
                            <strong>Equipment Received:</strong>
                            <Textarea
                              className="ml-2 bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
              p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              name="equipment"
                              value={shiftReport.shiftDetails.equipment}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center pb-4">
                            <strong className="mr-2">Shift Done By:</strong>
                            <p className="ml-4 text-teal-500">
                              {shiftReport.shiftDetails.creator}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <strong className="mr-2">Relieved:</strong>
                            <select
                              className="w-full ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              name="relieved"
                              disabled
                            >
                              <option>
                                {shiftReport.shiftDetails.relieved}
                              </option>
                            </select>
                          </div>
                          <div className="flex items-center">
                            <strong className="text-xs">
                              To be Relieved By:
                            </strong>
                            <select
                              className="w-full ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              name="toBeRelievedBy"
                              disabled
                            >
                              <option>
                                {shiftReport.shiftDetails.toBeRelievedBy}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col self-center mt-4">
                        <strong>Uniform Report:</strong>
                        <p className="mt-2 mb-2">
                          I confirm that I have the below uniform
                        </p>
                        <div className="flex flex-col">
                          {uniformData ? (
                            <>
                              <div className="flex items-center">
                                {uniformData.whiteShirt ? (
                                  <IoIosCheckmark className="text-green-500 text-3xl ml-[-3]" />
                                ) : (
                                  <FaTimes className="text-red-500 text-xl" />
                                )}
                                <p className="ml-2">White Shirt</p>
                              </div>
                              <div className="flex items-center">
                                {uniformData.blackTie ? (
                                  <IoIosCheckmark className="text-green-500 text-3xl ml-[-3]" />
                                ) : (
                                  <FaTimes className="text-red-500 text-xl" />
                                )}

                                <p className="ml-2">Tie</p>
                              </div>
                              <div className="flex items-center">
                                {uniformData.badgeID ? (
                                  <IoIosCheckmark className="text-green-500 text-3xl ml-[-3]" />
                                ) : (
                                  <FaTimes className="text-red-500 text-xl" />
                                )}

                                <p className="ml-2">Badge ID</p>
                              </div>
                              <div className="flex items-center">
                                {uniformData.blackPants ? (
                                  <IoIosCheckmark className="text-green-500 text-3xl ml-[-3]" />
                                ) : (
                                  <FaTimes className="text-red-500 text-xl" />
                                )}

                                <p className="ml-2">Black Pants</p>
                              </div>
                              <div className="flex items-center">
                                {uniformData.securityLogoBlazer ? (
                                  <IoIosCheckmark className="text-green-500 text-3xl ml-[-3]" />
                                ) : (
                                  <FaTimes className="text-red-500 text-xl" />
                                )}

                                <p className="ml-2">
                                  Security Logo Blazer / Jacket / Vest
                                </p>
                              </div>
                            </>
                          ) : (
                            <Spinner size="xl" />
                          )}
                        </div>
                      </div>
                    </div>
                  </main>
                ) : (
                  <div className="flex justify-center items-center p-4">
                    <Spinner size="xl" />
                  </div>
                )}

                {/* Logs started from here */}
                <h3 className="text-xl font-semibold ml-4">Shift Logs</h3>
                {shiftReport.logs && (
                  <div className="ml-4 border-t border-solid border-blueGray-200 rounded-b">
                    <Timeline className="mt-4">
                      {shiftReport.logs.map((log, index) => (
                        <Timeline.Item key={index}>
                          <Timeline.Point />
                          <Timeline.Content>
                            <div className="">
                              <p className="text-xs">{log.time}</p>

                              <span
                                dangerouslySetInnerHTML={{
                                  __html: log.description,
                                }}
                              ></span>
                            </div>
                          </Timeline.Content>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                )}

                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 border rounded-lg dark:bg-white hover:bg-rose-100 dark:hover:bg-rose-200 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </main>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
}
