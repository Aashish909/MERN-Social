import React from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { PostData } from '../context/postContext'; // Import PostData instead of UserData
import {Loading} from "../components/Loading";

const Home = () => {
  const { posts, loading } = PostData(); 
 

  return (
   <>
    {
      loading ? 
      (<Loading/>

      ):(
         <div>
      <AddPost type={"post"} />
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            type={"post"}
            post={post} // Pass the entire post object
          />
        ))
      ) : (
        <h1 className="text-center py-10 text-gray-500">
          {posts ? "No Posts Found" : "Loading posts..."}
        </h1>
      )}
    </div>)
    }
   </>
  );
};

export default Home;
