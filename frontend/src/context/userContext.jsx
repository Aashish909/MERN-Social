import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";



const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

    
  async function registerUser(formData, navigate, getAllPosts) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", formData);
      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      navigate("/"); 
      getAllPosts()
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }


  async function loginUser(email, password, getAllPosts) {
    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      getAllPosts()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function logoutUser() {
    try {
      const { data } = await axios.get("/api/auth/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      setIsAuth(false);
      setUser({});
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me", {
        withCredentials: true,
      });

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  // async function followUser(id, fetchUser) {
  //     try {
  //       const {data} =await axios.post(`/api/user/follow/${id}`)
  //       toast.success(data.message);
  //       fetchUser()
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //     }
  // }
  const followUser = async (id, fetchUser) => {
    try {
      const { data } = await axios.post(`/api/user/follow/${id}`);
      console.log("Follow success:", data);
      toast.success(data.message);
      if (fetchUser) fetchUser(); 
    } catch (error) {
      console.error(
        "Follow user error:",
        error.response?.data || error.message
      );
      toast.error(error.response.data.message);
    }
  };


  async function updateProfilePic(id, formData, setFile) {
      try {
        const {data} =await axios.put('/api/user/'+id, formData)
        toast.success(data.message);
        setFile(null)
        fetchUser()
      } catch (error) {
        toast.error(error.response.data.message);

      }
  }
  
  async function updateProfileName(id, name, setShowInput) {
    try {
      const { data } = await axios.put("/api/user/" + id, {name});
      toast.success(data.message);
      setShowInput(false);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function updateProfileBio(id, bio, setShowInput) {
    try {
      const { data } = await axios.put("/api/user/" + id, {bio});
      toast.success(data.message);
      setShowInput(false);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(()=>{
    fetchUser()
  },[])

  return (
    <UserContext.Provider
      value={{
        loginUser,
        fetchUser,
        user,
        setUser,
        isAuth,
        setIsAuth,
        loading,
        registerUser,
        logoutUser,
        followUser,
        updateProfilePic,
        updateProfileName,
        updateProfileBio
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
