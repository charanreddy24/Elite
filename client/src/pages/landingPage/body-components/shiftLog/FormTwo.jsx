import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Table } from 'flowbite-react';

const FormTwo = ({
  loggedTime,
  quillData,
  logs,
  handleLogSaveChanges,
  setQuillData,
  handleRefresh,
}) => {
  return (
    <form
      className="bg-white dark:bg-gray-500 w-full h-4/5 rounded-lg  p-4 overflow-y-auto"
      onSubmit={handleLogSaveChanges}
    >
      <div className="flex flex-col justify-center items-center">
        <p className="mb-2">Logged at: {loggedTime}</p>
        <ReactQuill
          className=" h-40 w-full"
          type="text"
          name="description"
          required
          theme="snow"
          value={quillData.description}
          onChange={(value) =>
            setQuillData({ ...quillData, description: value })
          }
        />
      </div>
      <div className="flex justify-end">
        <button
          className="mt-20 justify-center self-center bg-emerald-500 dark:bg-emerald-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={handleRefresh}
        >
          update log time
        </button>
        <button
          className="mt-20 justify-center self-center bg-emerald-300 dark:bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="submit"
        >
          Enter The Log
        </button>
      </div>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <Table hoverable className="w-full dark:text-white">
          <Table.Head className="dark:text-white">
            <Table.HeadCell className="border border-slate-300 w-1/6">
              Time
            </Table.HeadCell>
            <Table.HeadCell className="border border-slate-300">
              Description
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {logs.map((log, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="border border-slate-300">
                  {log.time}
                </Table.Cell>
                <Table.Cell className="border border-slate-300">
                  <div dangerouslySetInnerHTML={{ __html: log.description }} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </form>
  );
};

export default FormTwo;
