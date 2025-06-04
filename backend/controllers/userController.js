import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const followAndUnfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user._id.toString() === loggedInUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow/unfollow yourself",
      });
    }
    if (loggedInUser.followings.includes(user._id)) {
      // Unfollow the user
      loggedInUser.followings = loggedInUser.followings.filter(
        (id) => id.toString() !== user._id.toString()
      );
      user.followers = user.followers.filter(
        (id) => id.toString() !== loggedInUser._id.toString()
      );

      await loggedInUser.save();
      await user.save();
      res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      // Follow the user
      loggedInUser.followings.push(user._id);
      user.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await user.save();
      res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }

    // await loggedInUser.save();
    // await user.save();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userFollowerAndFollowingData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "-password")
      .populate("followings", "-password");

    const followers = user.followers;
    const followings = user.followings;

    res.status(200).json({
      success: true,
      followers,
      followings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const { name } = req.body;
    if (name) {
      user.name = name;
    }
    const { bio } = req.body;
    if (bio) {
      user.bio = bio;
    }
    const file = req.file;
    if (file) {
      const fileUrl = getDataUrl(file);

      await cloudinary.v2.uploader.destroy(user.profilePic.id);

      const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

      user.profilePic.id = myCloud.public_id;
      user.profilePic.url = myCloud.secure_url;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const users = await User.find({
      name: {
        $regex: search,
        $options: "i",
      },
      _id: {
        $ne: req.user._id,
      },
    }).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
