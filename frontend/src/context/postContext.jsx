import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PostContext =createContext();

export const PostContextProvider =({children})=>{

    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [lastCallTime, setLastCallTime] = useState(0);

    async function getAllPosts() {
        // Prevent excessive calls - only allow one call per 2 seconds
        const now = Date.now();
        if (now - lastCallTime < 2000) {
          return;
        }
        
        if (isLoading) {
          return;
        }

        setIsLoading(true);
        setLastCallTime(now);

        try {
            const {data} =await axios.get("/api/post/all")

            setPosts(data.posts);
            setReels(data.reels);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally {
            setIsLoading(false);
        }
    }   

    async function likePost(id) {
        try {
          const {data} =await axios.post(`/api/post/like/${id}`)

          toast.success(data.message);
          getAllPosts();
        } catch (error) {
          toast.error(error.response.data.message);
        }
    }
  

    const [addLoading, setAddLoading] = useState(false);
    async function addPost(formData, setFile, setCaption, setFilePrev, type) {
      try {
        setAddLoading(true);
        const { data } = await axios.post(
          `/api/post/new?type=${type}`,
          formData
        ); 
        toast.success(data.message);
        getAllPosts();
        setFile("");
        setCaption("");
        setFilePrev("");
        setAddLoading(false);
      } catch (error) {
        console.error("Frontend error:", error);
        toast.error(error.response?.data?.message );
        setAddLoading(false);
      }
    }

    async function addComment(id,comment, setComment) {
      try {
        const {data} = await axios.post(`/api/post/comment/${id}`, {comment})
        toast.success(data.message);
        getAllPosts();
        setComment('')
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

    async function deletePost(id) {
      setAddLoading(true);
      try {
       const {data} = await axios.delete(`/api/post/${id}`)
        toast.success(data.message);
        getAllPosts();
        setAddLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setAddLoading(false);
      }
    }

     async function deleteComment(postId, commentId) {
       try {
         const { data } = await axios.delete(
           `/api/post/comment/${postId}?commentId=${commentId}`
         );

         toast.success(data.message);
         getAllPosts();
       } catch (error) {
         toast.error(error.response.data.message);
       }
     }

      useEffect(() => {
        getAllPosts();
      }, []);


    return <PostContext.Provider value={{getAllPosts, reels,posts, addPost, likePost, addComment, loading, addLoading, deletePost ,deleteComment}}>{children}</PostContext.Provider>;
}


export const PostData =()=>useContext(PostContext);