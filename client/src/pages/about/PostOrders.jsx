import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';

const PostOrders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const [quillContent, setQuillContent] = useState(
    '<p>No Post Orders. Please inform the Supervisor to Update the Post Orders </p>',
  );

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/infoPages/getPostOrders');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        if (data && data.content) {
          setQuillContent(data.content);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchContent();
  }, []);

  const handleEditButton = () => {
    setIsEditMode(true);
  };

  const handleSaveButton = async (e) => {
    e.preventDefault();
    setIsEditMode(false);
    try {
      const res = await fetch('/api/infoPages/postOrders', {
        method: 'PUT',
        body: JSON.stringify({
          content: quillContent,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      toast.success('Succesfully Updated the information');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 h-5/6 overflow-auto p-6 rounded-lg shadow-lg">
      {/* header */}
      <div className="flex items-center justify-center">
        <h1 className="font-bold underline mb-4 mt-2 text-2xl text-gray-800 dark:text-gray-200">
          Post Orders
        </h1>
      </div>
      {currentUser.isAdmin && (
        <div className="flex items-center justify-center mb-4">
          {!isEditMode && (
            <Button
              className="font-bold bg-gradient-to-b from-slate-700 to-gray-900"
              outline
              onClick={handleEditButton}
            >
              Edit
            </Button>
          )}
        </div>
      )}
      {/* body */}
      <div className="p-4">
        {isEditMode ? (
          <form onSubmit={handleSaveButton}>
            <ReactQuill
              value={quillContent}
              onChange={setQuillContent}
              modules={modules}
            />
            <div className="flex justify-center mt-4">
              <Button
                className="font-bold bg-gradient-to-b from-slate-700 to-gray-900"
                outline
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md dark:text-white h-2/3">
            <div
              className="prose dark:prose-dark flex flex-col items-center dark:text-white "
              dangerouslySetInnerHTML={{ __html: quillContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostOrders;
