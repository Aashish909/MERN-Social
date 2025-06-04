import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router";
import {Loading} from "../components/Loading";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/user/all?search=" + search.trim());
      console.log("Search string:", search);
      console.log("Returned data:", data);
      setUsers(data.users);
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchUsers();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-xl mx-auto">
      <div className="w-full flex gap-2">
        <input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchUsers}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      <div className="w-full mt-6">
        {loading && <p className="text-gray-500">
          <Loading/>
          </p>}
        {error && <p className="text-red-500">{error}</p>}

        {users.length > 0 ? (
          <div className="mt-4 space-y-2">
            {users.map((user) => (
              <div className="flex items-center gap-3">
                <Link to={`/user/${user._id}`}>
                  <img
                    src={user.profilePic.url}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-offset-1"
                  />
                </Link>
                <div>
                  <Link to={`/user/${user._id}`}>
                    <p className="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                      {user.name}
                    </p>
                  </Link>
                  <p className="text-xs text-gray-500">
                    {/* <span>
                      <TimeAgo date={user?.createdAt} />
                    </span> */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-400 mt-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
