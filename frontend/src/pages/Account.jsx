import { useEffect, useState } from "react";
import { UserData } from "../context/userContext";
import { useNavigate } from "react-router";
import { PostData } from "../context/postContext";
import PostCard from "../components/PostCard";
import axios from "axios";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { logoutUser, fetchUser, updateProfilePic, updateProfileName, updateProfileBio } = UserData();
  const { posts, reels,loading } = PostData();

  const [activeTab, setActiveTab] = useState("posts");

  let myPosts = posts?.filter((post) => post.owner._id === user._id) || [];
  let myReels = reels?.filter((reel) => reel.owner._id === user._id) || [];

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
 const [followed, setFollowed] = useState(false);
 const { followUser } = UserData();
 const followHandler = () => {
   setFollowed(!followed);
   followUser(user._id, fetchUser);
 };

 const followers = user.followers;

 useEffect(() => {
   if (followers && followers.includes(user._id)) {
     setFollowed(true);
   }
 }, [user]);

 const [showFollower, setShowFollower] = useState(false);
 const [showFollowing, setShowFollowing] = useState(false);
 const [followersData, setFollowersData] = useState([]);
 const [followingsData, setFollowingsData] = useState([]);

 async function followData() {
   try {
     const { data } = await axios.get(`/api/user/followData/${user._id}`);

     console.log("Follow data:", data);
     setFollowersData(data.followers);
     setFollowingsData(data.followings);
   } catch (error) {
     console.log(
       "Error fetching follow data:",
       error.response || error.message
     );
   }
 }
 useEffect(() => {
   followData();
 }, [user]);


const [file, setFile] = useState(null);

const changeFileHandler = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFile(selectedFile);
  }
};

const changeImageHandler=()=>{
  const formData = new FormData();

  formData.append("file", file);
  updateProfilePic(user._id, formData, setFile);
}
const [showInput, setShowInput] = useState(false);
const [name, setName] = useState(user.name);
const [bio, setBio] = useState(user.bio);


const UpdateName=()=>{
  updateProfileName(user._id, name, setShowInput);
}
const UpdateBio = () => {
  updateProfileBio(user._id, bio, setShowInput);
};

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showUpdatePassword, setShowUpdatePassword] = useState( false);
 

  async function updatePasswordHandler(e) {
    e.preventDefault();
      try {
        const { data } = await axios.post("/api/user/" + user._id, {
          oldPassword,
          newPassword,
        })
        toast.success(data.message);
        setOldPassword("");
        setNewPassword("");
        setShowUpdatePassword(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
  }

  return (
    <>
      {user && (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
              {showFollower && (
                <Modal
                  value={followersData}
                  title={"Followers"}
                  onClose={() => setShowFollower(false)}
                />
              )}
              {showFollowing && (
                <Modal
                  value={followingsData}
                  title={"Followings"}
                  onClose={() => setShowFollowing(false)}
                />
              )}

              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mb-8 border border-gray-200">
                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Picture with Add Icon */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-600 shadow-md">
                    <img
                      src={user.profilePic?.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-500 border-2 border-white rounded-full p-1">
                      <span className="text-white text-xs font-bold"></span>
                    </div>
                  </div>

                  {/* File Input & Update Button */}
                  <div className="flex flex-col items-center space-y-2">
                    <input
                      type="file"
                      onChange={changeFileHandler}
                      className="file:mr-4 file:py-1 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-100 file:text-blue-800
          hover:file:bg-blue-200 transition"
                    />
                    <button
                      onClick={changeImageHandler}
                      className="bg-blue-600 text-white py-1.5 px-5 rounded-full hover:bg-blue-700 text-sm font-medium transition"
                    >
                      Update Picture
                    </button>
                  </div>

                  {/* Name, Email, Gender, Bio with Edit */}
                  <div className="text-center space-y-2 w-full px-2">
                    {showInput ? (
                      <>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border rounded-md px-3 py-2 text-sm"
                        />
                        <div className="flex justify-center gap-4 mt-1">
                          <button
                            onClick={UpdateName}
                            className="text-blue-600 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setShowInput(false)}
                            className="text-red-500 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-1">
                        {user.name}
                        <button
                          onClick={() => setShowInput(true)}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <CiEdit />
                        </button>
                      </h2>
                    )}

                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {user.gender}
                    </p>

                    {showInput ? (
                      <>
                        <input
                          type="text"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full border rounded-md px-3 py-2 text-sm"
                        />
                        <div className="flex justify-center gap-4 mt-1">
                          <button
                            onClick={UpdateBio}
                            className="text-blue-600 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setShowInput(false)}
                            className="text-red-500 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-700 italic flex items-center justify-center gap-1">
                        {user.bio}
                        <button
                          onClick={() => setShowInput(true)}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <CiEdit />
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-around w-full px-6 mt-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        {myPosts.length}
                      </p>
                      <span className="text-gray-500 text-xs">Posts</span>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowFollower(true)}
                    >
                      <p className="text-lg font-semibold text-gray-700">
                        {user.followers.length}
                      </p>
                      <span className="text-gray-500 text-xs">Followers</span>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowFollowing(true)}
                    >
                      <p className="text-lg font-semibold text-gray-700">
                        {user.followings.length}
                      </p>
                      <span className="text-gray-500 text-xs">Following</span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="mt-6 bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition font-medium"
                  >
                    Logout
                  </button>

                  {/* Update Password Toggle */}
                  <button
                    onClick={() => setShowUpdatePassword(!showUpdatePassword)}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    {showUpdatePassword
                      ? "Cancel Password Update"
                      : "Update Password"}
                  </button>

                  {/* Update Password Form */}
                  {showUpdatePassword && (
                    <form
                      onSubmit={updatePasswordHandler}
                      className="mt-3 w-full space-y-2"
                    >
                      <input
                        type="password"
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        required
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white w-full py-2 rounded-md hover:bg-green-700 text-sm font-semibold transition"
                      >
                        Save Password
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Tab Switch Buttons */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === "posts"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab("reels")}
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === "reels"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  Reels
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "posts" && (
                <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    My Posts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {myPosts.length > 0 ? (
                      myPosts.map((post) => (
                        <PostCard key={post._id} post={post} type={"post"} />
                      ))
                    ) : (
                      <p className="text-gray-500">No posts yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reels" && (
                <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    My Reels
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {myReels.length > 0 ? (
                      myReels.map((reel) => (
                        <PostCard key={reel._id} post={reel} type={"reel"} />
                      ))
                    ) : (
                      <p className="text-gray-500">No reels yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Account;
