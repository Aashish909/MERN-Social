import { useEffect, useState } from "react";
import { UserData } from "../context/userContext";
import { useNavigate, useParams } from "react-router";
import { PostData } from "../context/postContext";
import PostCard from "../components/PostCard";
import axios from "axios";
import { Loading } from "../components/Loading";
import Modal from "../components/Modal";

const UserAccount = ({ user: loggedInUser }) => {
  const navigate = useNavigate();
  const { logoutUser } = UserData();
  const { posts, reels } = PostData();
  const [user, setUser] = useState({
    followers: [],
    followings: [],
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    if (!params.id) return;
    try {
      const { data } = await axios.get("/api/user/" + params.id);
     
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user:", error.response || error.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

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
    if (followers && followers.includes(loggedInUser._id)) {
      setFollowed(true);
    }
  }, [user]);

    
  const [showFollower, setShowFollower]=useState(false)
  const [showFollowing, setShowFollowing] = useState(false);
    const [followersData, setFollowersData] = useState([])
    const [followingsData, setFollowingsData] = useState([])

  async function followData() {
    try {
        const {data} = await axios.get(`/api/user/followData/${user._id}`)

        console.log("Follow data:", data);
        setFollowersData(data.followers);
        setFollowingsData(data.followings);
    } catch (error) {
        console.log("Error fetching follow data:", error.response || error.message);
    }
  }
  useEffect(()=>{
    followData()
  },[user])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && (
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
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mb-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
                    <img
                      src={user.profilePic?.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xl font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {user.gender}
                    </p>
                  </div>
                  <div className="flex justify-between w-full px-6 mt-4 text-center">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowFollower(true)}
                    >
                      <p className="text-sm text-gray-700 font-medium">
                        {user.followers.length}
                      </p>
                      <span className="text-gray-500 text-xs">Followers</span>
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowFollowing(true)}
                    >
                      <p className="text-sm text-gray-700 font-medium">
                        {user.followings.length}
                      </p>
                      <span className="text-gray-500 text-xs">Following</span>
                    </div>
                    {user._id !== loggedInUser._id && (
                      <button
                        onClick={followHandler}
                        className="cursor-pointer bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                      >
                        {followed ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>
                  {user._id === loggedInUser._id && (
                    <button
                      onClick={handleLogout}
                      className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Logout
                    </button>
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

export default UserAccount;
