import React, { useEffect, useState } from "react";
import { BsChat, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import TimeAgo from "react-timeago";
import { UserData } from "../context/userContext";
import { PostData } from "../context/postContext";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import SimpleModal from "./SimpleModal";
import axios from "axios";
import toast from "react-hot-toast";
import { LoadingAnimation } from "./Loading";
import { SocketData } from "../context/socketContext";

const PostCard = ({ type, post }) => {
  const [isLike, setIsLike] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const { user } = UserData();
  const { likePost, addComment, deletePost, fetchPosts } = PostData();

  useEffect(() => {
    for (let i = 0; i < post.likes.length; i++) {
      if (post.likes[i] === user._id) {
        setIsLike(true);
      }
    }
  }, [post, user._id]);

  const handleLike = async () => {
    likePost(post._id);
    setIsLike(!isLike);
  };

  const [comment, setComment] = useState("");
  const addCommentHandler = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(post._id, comment, setComment);
  };

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const deleteHandler = () => {
    deletePost(post._id);
  };

  const [showInput, setShowInput] = useState(false);
  const [caption, setCaption] = useState(post.caption ? post.caption : "");
  const editHandler = () => {
    setShowModal(false);
    setShowInput(true);
  };

  const [captionLoading, setCaptionLoading] = useState(false);
  async function updateHandler() {
    setCaptionLoading(true);
    try {
      const { data } = await axios.put(`/api/post/${post._id}`, { caption });
      toast.success(data.message);
      post.caption = caption;
      setShowInput(false);
      fetchPosts();
      setCaptionLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setCaptionLoading(false);
    }
  }

  const { onlineUsers } = SocketData();

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 mb-6 max-w-2xl mx-auto border border-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out">
      <SimpleModal isOpen={showModal} onClose={closeModal}>
        <div className="bg-white rounded-lg shadow-lg p-4 w-40 flex flex-col gap-3">
          <button
            onClick={editHandler}
            className="text-left px-3 py-2 rounded hover:bg-blue-100 text-blue-600 font-semibold transition"
          >
            Edit
          </button>
          <button
            onClick={deleteHandler}
            className="text-left px-3 py-2 rounded hover:bg-red-100 text-red-600 font-semibold transition"
          >
            Delete
          </button>
        </div>
      </SimpleModal>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/user/${post.owner._id}`}
            className="relative flex items-center gap-2"
          >
            <img
              src={post.owner.profilePic.url}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400 ring-offset-2 hover:ring-blue-600 transition-all duration-200"
            />
            {onlineUsers.includes(post.owner._id) && (
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
            )}
          </Link>
          <div>
            <Link to={`/user/${post.owner._id}`}>
              <p className="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                {post.owner.name}
              </p>
            </Link>
            <p className="text-xs text-gray-500">
              <span>
                <TimeAgo date={post?.createdAt} />
              </span>
            </p>
          </div>
        </div>
        {post.owner._id === user._id && (
          <button
            onClick={() => setShowModal(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <BsThreeDotsVertical size={18} />
          </button>
        )}
      </div>

      {/* Media */}
      <div className="mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        {type === "post" ? (
          <img
            src={post?.post?.url || post?.url}
            alt="Post"
            className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-300 ease-in-out"
          />
        ) : (
          <video controls className="w-full h-auto max-h-[500px] object-cover">
            <source src={post.post.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Caption */}
      {showInput ? (
        <>
          <textarea
            typeof="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="1"
            autoFocus
            placeholder="Update Your caption"
            className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <div className="flex gap-3 mt-2">
            <button
              onClick={updateHandler}
              disabled={captionLoading}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {captionLoading ? <LoadingAnimation /> : "Update"}
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="mb-4 text-gray-700 text-sm leading-relaxed">
          {post.caption}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mb-2 px-1 border-t border-b border-gray-100 py-2">
        <button
          onClick={handleLike}
          className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-red-500 transition-colors py-1 rounded-lg hover:bg-gray-50"
        >
          <span className="text-xl">
            {isLike ? (
              <IoHeartSharp className="text-red-500 animate-pulse" />
            ) : (
              <IoHeartOutline />
            )}
          </span>
          <span className="text-sm font-medium">{post.likes.length} Likes</span>
        </button>
        <button
          onClick={() => setShowComment(!showComment)}
          className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-500 transition-colors py-1 rounded-lg hover:bg-gray-50"
        >
          <BsChat />
          <span className="text-sm font-medium">
            {post.comments.length} Comment
          </span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-green-500 transition-colors py-1 rounded-lg hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Comments and Input */}
      {showComment && (
        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                user={user}
                id={comment._id}
                owner={post.owner._id}
                postId={post._id}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No comments yet</p>
          )}

          {/* New Comment Input */}
          <div className="flex items-center gap-3 mt-4">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={addCommentHandler}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

const Comment = ({ comment, user, owner, postId }) => {
  if (!comment?.user) return null;

  const { deleteComment } = PostData();

  const deleteCommentHandler = () => {
    deleteComment(postId, comment._id);
  };

  return (
    <div className="flex items-start gap-3 group">
      <Link to={`/user/${comment.user._id}`}>
        <img
          src={comment.user.profilePic?.url || "/default.jpg"}
          alt="user"
          className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 px-4 py-2 rounded-2xl rounded-tl-none inline-block">
          <Link to={`/user/${comment.user._id}`}>
            <p className="font-semibold text-gray-800 text-sm hover:text-blue-600 cursor-pointer">
              {comment.user.name}
            </p>
          </Link>
          <p className="text-gray-700 text-sm break-words">{comment.comment}</p>
        </div>
        <div className="mt-1 ml-2 flex items-center gap-4 text-xs text-gray-500">
          <button className="hover:text-blue-500 transition-colors">
            Like
          </button>
          <button className="hover:text-blue-500 transition-colors">
            Reply
          </button>
          <span>
            <TimeAgo date={comment?.createdAt} />
          </span>
          {(comment?.user?._id === user?._id || owner === user?._id) && (
            <button
              onClick={deleteCommentHandler}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
            >
              <AiOutlineDelete size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



