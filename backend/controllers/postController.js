import { Post } from "../models/postModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const newPost = async (req, res) => {
  try {
    const { caption } = req.body;
    if (!caption) {
      return res.status(400).json({
        success: false,
        message: "Please provide captions",
      });
    }
    const ownerId = req.user._id;

    const file = req.file;

    const fileUrl = getDataUrl(file);

    let option;

    const type = req.query.type;
    if (type === "reel") {
      option = {
        resource_type: "video",
      };
    } else {
      option = {
        resource_type: "image",
      };
    }

    const myCloud = await cloudinary.v2.uploader.upload(
      fileUrl.content,
      option
    );

    const post = await Post.create({
      caption,
      post: {
        id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      type,
      owner: ownerId,
    });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ type: "post" })
      .populate("owner", "-password")
      .populate("comments.user", "-password")
      .sort({ createdAt: -1 });

    const reels = await Post.find({ type: "reel" })
      .populate("owner", "-password")
      .populate("comments.user", "-password")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found",
      });
    }

    res.status(200).json({
      success: true,
      posts,
      reels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Please provide post id",
      });
    }

    const post = await Post.findById(postId).populate("owner", "-password");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
    await cloudinary.v2.uploader.destroy(post.post.id);
    await post.deleteOne();
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
      res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        likes: post.likes.length,
      });
    } else {
      post.likes.push(req.user._id);
      res.status(200).json({
        success: true,
        message: "Post liked successfully",
        likes: post.likes.length,
      });
    }

    await post.save();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // post.comments.comment =req.body.comment;

    post.comments.push({
      user: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const deleteComment = async (req, res) => {
//     try {
//         const post =await Post.findById(req.params.id);

//          if (!post) {
//            return res.status(404).json({
//              success: false,
//              message: "Post not found",
//            });
//          }

//          if(!req.body.commentId){
//             return res.status(404).json({
//                 success: false,
//                 message: "Comment id is required",
//               });
//          }

//          const commentIndex =post.comments.findIndex((item) => item._id.toString() === req.body.commentId.toString());

//          if(commentIndex === -1){
//             return res.status(404).json({
//                 success: false,
//                 message: "Comment not found",
//               });
//          }
//          const comment = post.comments[commentIndex];

//         if (!comment) {
//           return res.status(500).json({
//             success: false,
//             message: "Comment object is undefined even though index exists",
//           });
//         }
//          if(post.owner.toString() === req.user._id.toString() || comment.user.toString() === req.user._id.toString()){

//             post.comments.splice(commentIndex, 1);

//             await post.save();

//             res.status(200).json({
//                 success: true,
//                 message: "Comment deleted successfully",
//             })
//          } else {
//             return res.status(403).json({
//                 success: false,
//                 message: "You are not authorized to delete this comment",
//               });
//          }

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }
// }

// export const deleteComment = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     console.log("Post ID:", req.params.id);

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     if (!req.query.commentId) {
//       return res.status(400).json({
//         success: false,
//         message: "Comment id is required",
//       });
//     }

//     // const { commentId } = req.query;

//     const commentIndex = post.comments.findIndex(
//       (item) => item._id.toString() === req.query.commentId.toString()
//     );

//     if (commentIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     const comment = post.comments[commentIndex];

//     if (!comment) {
//       return res.status(500).json({
//         success: false,
//         message: "Comment is undefined even after matching index",
//       });
//     }

//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: User not authenticated",
//       });
//     }

//     // Check if user is owner of post or comment
//     const isPostOwner = post.owner.toString() === req.user._id.toString();
//     const isCommentOwner = comment.user.toString() === req.user._id.toString();

//     if (isPostOwner || isCommentOwner) {
//       post.comments.splice(commentIndex, 1);
//       await post.save();
//       return res.status(200).json({
//         success: true,
//         message: "Comment deleted successfully",
//       });
//     } else {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to delete this comment",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Server Error",
//     });
//   }
// };

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!req.query.commentId)
      return res.status(404).json({ message: "Please give comment id" });

    if (!post)
      return res.status(404).json({
        message: "No Post with this id",
      });

    if (!req.query.commentId)
      return res.status(404).json({
        message: "Please give comment id",
      });

    const commentIndex = post.comments.findIndex(
      (item) => item._id.toString() === req.query.commentId.toString()
    );

    if (commentIndex === -1) {
      return res.status(400).json({
        message: "Comment not found",
      });
    }

    const comment = post.comments[commentIndex];

    if (
      post.owner.toString() === req.user._id.toString() ||
      comment.user.toString() === req.user._id.toString()
    ) {
      post.comments.splice(commentIndex, 1);

      await post.save();

      return res.json({
        message: "Comment deleted",
      });
    } else {
      return res.status(400).json({
        message: "Yor are not allowed to delete this comment",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editCaption = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this post",
      });
    }

    post.caption = req.body.caption;
    await post.save();
    res.status(200).json({
      success: true,
      message: "Caption updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
