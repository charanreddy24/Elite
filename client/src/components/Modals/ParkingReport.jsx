import { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { torontoTimeOptions } from '../../pages/landingPage/header/Clock.jsx';
import { FaTimes } from 'react-icons/fa';
import { FaPenNib } from 'react-icons/fa6';
import { Checkbox } from 'flowbite-react';
import { useSelector } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

export default function ParkingReportModal({ cardsArray, setCardsArray }) {
  const [showModal, setShowModal] = useState(false);
  const draggableRef = useRef(null);
  const [loggedOnDate, setLoggedOnDate] = useState(new Date());
  const [parkingDayCount, setParkingDayCount] = useState(24);
  const { currentUser } = useSelector((state) => state.user);
  const [parkingExpiryDate, setParkingExpiryDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    if (showModal) {
      // Calculate the logged on date only when the modal is opened
      const currentDate = new Date();
      setLoggedOnDate(currentDate);
    }
  }, [showModal]);

  useEffect(() => {
    const expiryDate = new Date(loggedOnDate);
    expiryDate.setHours(expiryDate.getHours() + parseInt(parkingDayCount));
    setParkingExpiryDate(expiryDate);
  }, [loggedOnDate, parkingDayCount]);

  const initialFormData = {
    visitingUnitNumber: '',
    visitorName: '',
    issuedOn: `${loggedOnDate.toLocaleString('en-US', torontoTimeOptions)}`,
    parkingDayCount: '24',
    validUntil: `${parkingExpiryDate.toLocaleString(
      'en-US',
      torontoTimeOptions,
    )}`,
    licensePlate: '',
    vehicleMake: 'BMW',
    vehicleColor: 'Red',
    additionalDetails: '',
    id: Math.random().toString(),
    column: 'Active Permits',
  };
  const [formData, setFormData] = useState({ ...initialFormData });

  useEffect(() => {
    const fetchParkingPermits = async () => {
      try {
        const res = await fetch('/api/parkingRegister/getParkingPermits');
        const data = await res.json();
        if (res.ok) {
          setCardsArray(data.allParkingPermits);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchParkingPermits();
  }, [currentUser]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      parkingDayCount: parkingDayCount,
      issuedOn: `${loggedOnDate.toLocaleString('en-US', torontoTimeOptions)}`,
      validUntil: `${parkingExpiryDate.toLocaleString(
        'en-US',
        torontoTimeOptions,
      )}`,
    }));
  }, [loggedOnDate, parkingExpiryDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Restore overflow on component unmount
    };
  }, [showModal]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (
      !formData.visitorName ||
      !formData.visitingUnitNumber ||
      !formData.parkingDayCount ||
      !formData.licensePlate ||
      !formData.vehicleMake ||
      !formData.vehicleColor
    ) {
      return alert(JSON.stringify('Please fill out all the fields'));
    }
    const card = { ...formData };
    try {
      const res = await fetch('/api/parkingRegister/create', {
        method: 'POST',
        body: JSON.stringify({
          content: formData,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
    setCardsArray([...cardsArray, card]);
    setFormData({ ...initialFormData });
    setShowModal(false);
  };
  return (
    <>
      <div className="flex  items-center justify-center">
        <button
          className="flex flex-col lg:flex-row items-center gap-2 w-3/2 bg-slate-300 hover:bg-slate-400 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          <FaPenNib className="text-xl" />
          Issue a Parking Permit
        </button>
      </div>
      {showModal && (
        <>
          <form
            onSubmit={handleSaveChanges}
            className="dark:text-white justify-center items-center flex overflow-x-auto overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <Draggable handle=".modal-header" nodeRef={draggableRef}>
              <div
                className="relative w-auto my-6 h-dvh mx-auto max-w-6xl"
                ref={draggableRef}
              >
                {/*content*/}
                <div className="dark:bg-slate-500 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t modal-header cursor-move">
                    <h3 className="text-xl font-semibold">Parking Permit</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <FaTimes className="text-red-500 text-2xl block outline-none focus:outline-none" />
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 space-y-6 flex-auto">
                    <div className="grid grid-cols-2 gap-8">
                      {/* div for visitor details */}
                      <div className="col-span-2 flex flex-col justify-around gap-2 sm:flex-row">
                        <div className="flex items-center">
                          <strong className="mr-2">Visiting Unit:</strong>
                          <input
                            className="text-center ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="number"
                            placeholder="Unit Number"
                            min={1}
                            name="visitingUnitNumber"
                            value={formData.visitingUnitNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <strong className="mr-2">Visitor Name:</strong>
                          <input
                            className="text-center ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text"
                            placeholder="Name"
                            name="visitorName"
                            value={formData.visitorName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-span-2 flex flex-col justify-around gap-2 sm:flex-row">
                        <div className="flex items-center">
                          <strong className="mr-2 ">Authorized Officer:</strong>
                          <span>{currentUser ? currentUser.username : ''}</span>
                        </div>
                      </div>

                      <div className="bg-gray-100 p-2 items-center col-span-2 dark:bg-inherit">
                        <strong className="mr-2">Issued On:</strong>
                        <span>
                          {loggedOnDate.toLocaleString(
                            'en-US',
                            torontoTimeOptions,
                          )}
                        </span>
                      </div>
                      <div className=" p-2 items-center col-span-2 ">
                        <strong className="mr-2">Select Period of Time:</strong>
                        <select
                          name="parkingDayCount"
                          value={parkingDayCount}
                          onChange={(e) => setParkingDayCount(e.target.value)}
                          className="ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="24">24 Hours</option>
                          <option value="48">2 Days</option>
                          <option value="72">3 Days</option>
                          <option value="96">4 Days</option>
                        </select>
                      </div>
                      <div className="bg-gray-100 p-2 items-center col-span-2 dark:bg-inherit">
                        <strong className="mr-2">Valid Until:</strong>
                        <span>
                          {parkingExpiryDate.toLocaleString(
                            'en-US',
                            torontoTimeOptions,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Div for Vehicle details */}
                    <div className="grid grid-cols-3 gap-4 border rounded-lg">
                      {/* Div for title */}
                      <div className="mt-2 mr-2 col-span-3">
                        <strong className="border-b border-slate-800">
                          Vehicle Details:
                        </strong>
                      </div>
                      {/* Div for the license plate, make and color */}
                      <div className="flex flex-col sm:flex-row items-center col-span-3 mb-4">
                        <div className="ml-2 flex items-center">
                          <strong className="">License Plate:</strong>
                          <input
                            className=" w-1/2 text-center ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text"
                            placeholder="XXXX"
                            name="licensePlate"
                            value={formData.licensePlate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="ml-[-20px] flex items-center">
                          <strong className="">Vehicle Make:</strong>
                          <select
                            name="vehicleMake"
                            value={formData.vehicleMake}
                            onChange={handleInputChange}
                            className="w-32 ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="BMW">BMW</option>
                            <option value="Mercedes">Mercedes</option>
                            <option value="Audi">Audi</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Nissan">Nissan</option>
                            <option value="Volkswagen">Volkswagen</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="ml-6 flex items-center">
                          <strong className="">Color:</strong>
                          <select
                            name="vehicleColor"
                            value={formData.vehicleColor}
                            onChange={handleInputChange}
                            className="w-32 ml-2 mr-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Red">Red</option>
                            <option value="Blue">Blue</option>
                            <option value="Black">Black</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <strong className="">Additional Details (If any):</strong>
                      <textarea
                        className="border border-slate-800 rounded-lg dark:bg-slate-800"
                        name="additionalDetails"
                        value={formData.additionalDetails}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="">
                      <Checkbox id="accept" required /> I agree that above
                      information is accurate and as per the company's policies
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 dark:bg-white hover:bg-rose-100 rounded dark:hover:bg-rose-200 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-3 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </Draggable>
          </form>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}
