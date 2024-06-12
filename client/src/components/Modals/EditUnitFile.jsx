import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'flowbite-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditUnitFile() {
  const [showModal, setShowModal] = useState(true);
  const [residents, setResidents] = useState([
    { name: '', email: '', phone: '', residentType: '' },
  ]);
  const [formData, setFormData] = useState({
    unitNumber: '',
    residents: [],
    licensePlate: '',
    spotDetails: '',
  });

  const [unitFileData, setUnitFileData] = useState([]);
  const navigate = useNavigate();
  const { unitFileId } = useParams();

  useEffect(() => {
    const fetchUnitFile = async () => {
      try {
        const res = await fetch(
          `/api/unitFile/getUnitFiles?unitFileId=${unitFileId}`,
        );
        const data = await res.json();

        if (res.ok) {
          setUnitFileData(data.unitFiles);
          const updatedFormData = { ...data.unitFiles[0] };
          setFormData(updatedFormData);
          setResidents(data.unitFiles[0].residents);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchUnitFile();
  }, [unitFileId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedFormData = { ...formData, residents };
      const res = await fetch(`/api/unitFile/updateUnitFile/${unitFileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        toast.success('Resident information updated successfully');
        setShowModal(false);
        navigate(-1);
      }
    } catch (error) {
      toast.failure('Update unsuccessful, something went wrong');
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

  const handleClose = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <>
      {showModal && (
        <Modal show={showModal} size="lg" onClose={handleClose} popup>
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
                      className="w-48 ml-2 opacity-30 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:bg-red-100"
                      type="text"
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleInputChange}
                      required
                      disabled
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
                  Update the Details
                </Button>
                <Button color="gray" onClick={handleClose}>
                  No, cancel
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
