import React from 'react';
import TimePickerDropdown from '/src/components/TimePicker.jsx';
import { Textarea, Checkbox } from 'flowbite-react';

const FormOne = ({
  startTime,
  endTime,
  users,
  formOneData,
  handleFormOneInputChange,
  handleCheckboxChange,
  handleFormOneSave,
}) => {
  return (
    <form
      onSubmit={handleFormOneSave}
      className="flex flex-col gap-2 h-4/5 sm:shrink-0 overflow-y-auto"
    >
      <div className="text-sm p-4 w-full bg-white dark:bg-gray-800 rounded-lg flex flex-col ">
        <div className="flex self-center mb-4">
          <TimePickerDropdown
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={(time) =>
              handleFormOneInputChange({
                target: { name: 'startTime', value: time },
              })
            }
            onEndTimeChange={(time) =>
              handleFormOneInputChange({
                target: { name: 'endTime', value: time },
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4 place-items-center">
          <div className="flex flex-col">
            <div className="flex items-center">
              <strong>Shift Start Time:</strong>
              <span className="ml-5">{startTime}</span>
            </div>
            <div className="flex items-center">
              <strong>Shift End Time:</strong>
              <span className="ml-7">{endTime}</span>
            </div>
            <div className="flex items-center">
              <strong>Equipment Received:</strong>
              <Textarea
                className="ml-2 bg-gray-50 border border-gray-300 
              text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
              p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="equipment"
                value={formOneData.equipment}
                onChange={handleFormOneInputChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <strong className="mr-2">Relieved:</strong>
              <select
                className="w-full ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="relieved"
                value={formOneData.relieved}
                onChange={handleFormOneInputChange}
                required
              >
                <option value="">Select Type</option>
                {users.map((user, index) => (
                  <option value={user.username} key={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <strong className="text-xs">To be Relieved By:</strong>
              <select
                className="w-full ml-2 bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="toBeRelievedBy"
                value={formOneData.toBeRelievedBy}
                onChange={handleFormOneInputChange}
                required
              >
                <option value="">Select Type</option>
                {users.map((user) => (
                  <option value={user.username} key={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col self-center mt-4">
          <strong>Uniform Report:</strong>
          <p className="mt-2 mb-2">I confirm that I have the below uniform</p>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Checkbox
                name="whiteShirt"
                checked={formOneData.uniform.whiteShirt}
                onChange={handleCheckboxChange}
                required
              />
              <p className="ml-2">White Shirt</p>
            </div>
            <div className="flex items-center">
              <Checkbox
                name="blackTie"
                checked={formOneData.uniform.blackTie}
                onChange={handleCheckboxChange}
              />
              <p className="ml-2">Tie</p>
            </div>
            <div className="flex items-center">
              <Checkbox
                name="badgeID"
                checked={formOneData.uniform.badgeID}
                onChange={handleCheckboxChange}
              />
              <p className="ml-2">Badge ID</p>
            </div>
            <div className="flex items-center">
              <Checkbox
                name="blackPants"
                checked={formOneData.uniform.blackPants}
                onChange={handleCheckboxChange}
              />
              <p className="ml-2">Black Pants</p>
            </div>
            <div className="flex items-center">
              <Checkbox
                name="securityLogoBlazer"
                checked={formOneData.uniform.securityLogoBlazer}
                onChange={handleCheckboxChange}
              />
              <p className="ml-2">Security Logo Blazer / Jacket / Vest</p>
            </div>
          </div>
        </div>
        <button
          className="mt-4 justify-center self-center bg-emerald-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default FormOne;
