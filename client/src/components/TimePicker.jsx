import React, { useState } from 'react';

function TimePickerDropdown({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSaveTime = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        id="dropdownTimepickerButton"
        className="text-white bg-slate-400 dark:bg-slate-300 hover:bg-slate-600 active:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-violet-400 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown open/close
      >
        Shift Time
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div
          className="z-10 bg-slate-200 rounded-lg shadow w-auto dark:bg-gray-700 p-3 mt-2 items-center justify-center"
          id="dropdownTimepicker"
        >
          <div className="max-w-[16rem] mx-auto grid grid-cols-2 gap-4 mb-2">
            <div>
              <label
                htmlFor="start-time"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Start time:
              </label>
              <input
                type="time"
                id="start-time"
                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                min="09:00"
                max="18:00"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="end-time"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                End time:
              </label>
              <input
                type="time"
                id="end-time"
                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                min="09:00"
                max="18:00"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                required
              />
            </div>
            <button
              id="saveTimeButton"
              type="button"
              className="text-white rounded bg-slate-400 hover:bg-slate-600 dark:text-white text-sm hover:underline p-0"
              onClick={handleSaveTime}
            >
              Save time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePickerDropdown;
