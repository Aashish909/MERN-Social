import React, { useState } from "react";
import { PostData } from "../context/postContext";
import { FiImage } from "react-icons/fi";
import { UserData } from "../context/userContext";
import { LoadingAnimation } from "./Loading";

const AddPost = ({ type }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");

  const { addPost, addLoading } = PostData();
  const { user } = UserData();

  const changeFileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePrev(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file);
    addPost(formData, setFile, setCaption, setFilePrev, type);
  };

  return (
    <div className="bg-white w-full max-w-2xl mx-auto rounded-lg p-4 mb-4 shadow-sm shadow-gray-300">
      <form onSubmit={submitHandler}>
        <div className="flex items-start gap-3">
          {/* Profile Icon Placeholder */}
          <div className="w-10 h-10 rounded-full bg-gray-300">
            <img
              src={user.profilePic.url}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Input Section */}
          <div className="flex-1">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="2"
              placeholder="What's on your mind?"
              className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            {/* File preview */}
            {filePrev && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-300">
                {type === "post" ? (
                  <img
                    src={filePrev}
                    alt="Preview"
                    className="max-h-64 w-full object-contain"
                  />
                ) : (
                  <video
                    src={filePrev}
                    controls
                    className="max-h-64 w-full object-contain"
                  />
                )}
              </div>
            )}
            {/* Actions */}
            <div className="flex justify-between items-center mt-3">
              <label className="cursor-pointer flex items-center gap-1 text-gray-500 hover:text-blue-600 transition">
                <FiImage className="text-xl" />
                <span className="text-sm">
                  {type === "post" ? "Add Image" : "Add Video"}
                </span>
                <input
                  type="file"
                  onChange={changeFileHandler}
                  accept={type === "post" ? "image/*" : "video/*"}
                  className="hidden"
                />
              </label>
              <button
                type="submit"
                disabled={!caption || !file || addLoading}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                  !caption || !file
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {addLoading ? <LoadingAnimation /> : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
