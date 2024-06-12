import { Alert, Button, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';

export default function CommentSection({ incidentReportId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          incidentReportId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `/api/comment/getIncidentReportComments/${incidentReportId}`,
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [incidentReportId]);
  return (
    <div>
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 dark:text-white text-sm m-5">
          <p>Signed in as:</p>
          <img
            className="h-8 w-8 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={'/dashboard?tab=profile'}
            className="text-sm dark:text-teal-300 text-cyan-600 hover:underline"
          >
            {' '}
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-white rounded-md p-3"
        >
          <Textarea
            placeholder="Add an additional information / Follow-up"
            rows="10"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-center items-center mt-5">
            <Button
              outline
              className="bg-gradient-to-b from-slate-700 to-gray-900"
              type="submit"
            >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="ml-5 my-5 ">No Additional Information</p>
      ) : (
        <>
          <div className="ml-5 text-sm my-5 flex items-center gap-1">
            <p>Additional Information:</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
}
