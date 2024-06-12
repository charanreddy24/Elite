import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Spinner } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { FaPenNib } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function UnitFile() {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [residents, setResidents] = useState([
    { name: '', email: '', phone: '', residentType: '' },
  ]);
  const [formData, setFormData] = useState({
    unitNumber: '',
    residents: [],
    licensePlate: '',
    spotDetails: '',
  });

  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [unitFilesData, setUnitFilesData] = useState([]);

  useEffect(() => {
    const fetchUnitFiles = async () => {
      const sortDirection = 'asc';
      try {
        const res = await fetch(
          `/api/unitFile/getUnitFiles?sort=${sortDirection}`,
        );
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setUnitFilesData(data.unitFiles);
          if (data.unitFiles.length < 6) {
            setShowMore(false);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchUnitFiles();
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = unitFilesData.length;
    const sortDirection = 'asc';
    try {
      const res = await fetch(
        `/api/unitFile/getUnitFiles?sort=${sortDirection}&startIndex=${startIndex}`,
      );
      const data = await res.json();
      if (res.ok) {
        setUnitFilesData((prev) => [...prev, ...data.unitFiles]);
        if (data.unitFiles.length < 6) {
          setShowMore(false);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setShowModal(false);
      const updatedFormData = { ...formData, residents };

      const res = await fetch('/api/unitFile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Resident Added Successfully');
      } else {
        toast.error('Unit Number should be Unique');
      }

      setFormData({
        unitNumber: '',
        residents: [],
        licensePlate: '',
        spotDetails: '',
      });
      setResidents([{ name: '', email: '', phone: '', residentType: '' }]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResidentChange = (e, index) => {
    const { name, value } = e.target;
    const newResidents = [...residents];
    newResidents[index][name] = value;
    setResidents(newResidents);
  };

  const addResidentInput = () => {
    setResidents([
      ...residents,
      { name: '', email: '', phone: '', residentType: '' },
    ]);
  };

  const removeResidentInput = () => {
    setResidents(residents.slice(0, -1));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <h2 className="mx-auto font-semibold text-gray-800 text-2xl underline">
          Unit File Page
        </h2>
        {currentUser.isAdmin && (
          <button
            className="flex items-center gap-2 bg-slate-300 hover:bg-slate-400 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(true)}
          >
            <FaPenNib className="text-xl" />
            Add a Resident
          </button>
        )}
      </div>

      {showModal && (
        <Modal
          show={showModal}
          size="lg"
          onClose={() => setShowModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <form className="text-center" onSubmit={handleSubmit}>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Please Enter the Details of the Resident
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <div className="flex items-center">
                    <strong className="mr-2">Unit Number:</strong>
                    <input
                      className="w-48 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-2 flex flex-col">
                  <div className="flex items-start">
                    <strong className="mr-2 mb-2">Residents:</strong>
                  </div>
                  {residents.map((resident, index) => (
                    <div key={index} className="mb-4">
                      <input
                        className="w-48 mb-2 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => handleResidentChange(e, index)}
                        value={resident.name}
                        name="name"
                        type="text"
                        placeholder={`Resident ${index + 1} Name`}
                        required
                      />
                      <input
                        className="w-48 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => handleResidentChange(e, index)}
                        value={resident.email}
                        name="email"
                        type="email"
                        placeholder={`Resident ${index + 1} Email`}
                        required
                      />
                      <input
                        className="w-48 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => handleResidentChange(e, index)}
                        value={resident.phone}
                        name="phone"
                        type="tel"
                        placeholder={`Resident ${index + 1} Phone`}
                        required
                      />
                      <select
                        name="residentType"
                        value={resident.residentType}
                        onChange={(e) => handleResidentChange(e, index)}
                        className="w-48 ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Renter">Renter</option>
                        <option value="Owner">Owner</option>
                      </select>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white p-2 rounded-full ml-4 mt-2 text-sm"
                      onClick={addResidentInput}
                    >
                      Add Another Resident
                    </button>
                    {residents.length > 1 && (
                      <button
                        type="button"
                        className="bg-red-500 text-white p-2 rounded-full ml-4 mt-2 text-sm"
                        onClick={removeResidentInput}
                      >
                        Remove the Added Resident
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="">
                    <div className="flex items-center">
                      <strong className="mr-2">Vehicle:</strong>
                      <input
                        className="w-48 ml-5 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        placeholder="License Plate (if any)"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="">
                    <div className="flex justify-items-center items-center">
                      <strong className="mr-2">Spot No. :</strong>
                      <input
                        className="w-48 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        name="spotDetails"
                        value={formData.spotDetails}
                        placeholder="Example: P1-240"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button color="success" type="submit">
                  Save the Details
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
      <div className="h-dvh bg-slate-50 dark:bg-slate-800 rounded-lg table-auto overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {unitFilesData.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Unit Number</Table.HeadCell>
                <Table.HeadCell>Registered Residents</Table.HeadCell>
                <Table.HeadCell>Vehicle & Spot Details</Table.HeadCell>
                {currentUser.isAdmin && <Table.HeadCell>Edit</Table.HeadCell>}
              </Table.Head>

              <Table.Body className="divide-y">
                {unitFilesData.map((unitData) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={unitData._id}
                  >
                    <Table.Cell className="p-4 font-medium text-gray-900 dark:text-gray-200">
                      {unitData.unitNumber}
                    </Table.Cell>
                    <Table.Cell className="p-4">
                      {unitData.residents && (
                        <Table className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
                          <Table.Head>
                            <Table.HeadCell className="text-center bg-slate-400 text-white dark:bg-slate-900 dark:text-gray-200">
                              Registered Residents
                            </Table.HeadCell>
                          </Table.Head>
                          <Table.Body className="divide-y">
                            <Table.Row className="bg-slate-100 dark:bg-slate-800">
                              <Table.Cell className="font-semibold">
                                Name
                              </Table.Cell>
                              <Table.Cell className="font-semibold">
                                Email
                              </Table.Cell>
                              <Table.Cell className="font-semibold">
                                Phone
                              </Table.Cell>
                              <Table.Cell className="font-semibold">
                                Resident Type
                              </Table.Cell>
                            </Table.Row>
                            {unitData.residents.map((resident, index) => (
                              <Table.Row
                                key={index}
                                className="bg-white dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                <Table.Cell className="text-teal-500 dark:text-teal-300">
                                  {resident.name}
                                </Table.Cell>
                                <Table.Cell className="text-gray-600 dark:text-gray-400">
                                  {resident.email}
                                </Table.Cell>
                                <Table.Cell className="text-gray-600 dark:text-gray-400">
                                  {resident.phone}
                                </Table.Cell>
                                <Table.Cell className="text-gray-800 dark:text-gray-200">
                                  {resident.residentType}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      )}
                    </Table.Cell>
                    <Table.Cell className="p-4">
                      <p>
                        {unitData.licensePlate ? unitData.licensePlate : 'N/A'}
                      </p>
                      <p>
                        {unitData.spotDetails ? unitData.spotDetails : 'N/A'}
                      </p>
                    </Table.Cell>
                    {currentUser.isAdmin && (
                      <Table.Cell className="p-4">
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/edit/${unitData._id}`}
                        >
                          <span>Edit</span>
                        </Link>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
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
          <p className="flex justify-center items-center">
            No Residents Created, Request the Admin to enter the Details of the
            residents
          </p>
        )}
      </div>
    </>
  );
}
