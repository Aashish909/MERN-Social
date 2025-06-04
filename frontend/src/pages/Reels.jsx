import React from 'react'
import AddPost from '../components/AddPost'
import { PostData } from '../context/postContext'
import PostCard from '../components/PostCard'
import {Loading} from '../components/Loading'

const Reels = () => {
  const {reels, loading} =PostData()
  console.log("Reels:",reels);

  return (
   <>
    {loading ? (<Loading/>):( <div>
      <AddPost type={"reel"} />
      {reels.length > 0 ? (
        reels.map((reel) => <PostCard key={reel.id} post={reel} />)
      ) : (
        <h1 className="text-center py-10 text-gray-500">
          {reels ? "No Reels Found" : "Loading Reels..."}
        </h1>
      )}
    </div>)}
   </>
  );
}

export default Reels