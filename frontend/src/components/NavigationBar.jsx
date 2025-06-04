import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { LiaHomeSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { BsCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { BsChat, BsChatFill } from "react-icons/bs";
import { RiAccountCircleLine, RiAccountCircleFill } from "react-icons/ri";
import { UserData } from "../context/userContext";

const NavigationBar = () => {
  const location = useLocation();
  const currentTab = location.pathname;

  const {user} =UserData()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-3 flex justify-around items-center z-50">
      <Link to="/" className="text-2xl">
        {currentTab === "/" ? (
          <MdHome className="text-blue-500" />
        ) : (
          <LiaHomeSolid className="text-gray-500" />
        )}
      </Link>
      <Link to="/search" className="text-2xl">
        {currentTab === "/search" ? (
          <FaSearch className="text-blue-500" />
        ) : (
          <IoSearchOutline className="text-gray-500" />
        )}
      </Link>
      <Link to="/reels" className="text-2xl">
        {currentTab === "/reels" ? (
          <BsCameraReelsFill className="text-blue-500" />
        ) : (
          <BsCameraReels className="text-gray-500" />
        )}
      </Link>
      <Link to="/chat" className="text-2xl">
        {currentTab === "/chat" ? (
          <BsChatFill className="text-blue-500" />
        ) : (
          <BsChat className="text-gray-500" />
        )}
      </Link>
      <Link to="/account" className="text-2xl">
        {user?.profilePic?.url ? (
          <img
            src={user.profilePic.url}
            alt="Profile"
            className={`w-8 h-8 rounded-full object-cover ${
              currentTab === "/account" ? "ring-2 ring-blue-500" : ""
            }`}
          />
        ) : currentTab === "/account" ? (
          <RiAccountCircleFill className="text-blue-500" />
        ) : (
          <RiAccountCircleLine className="text-gray-500" />
        )}
      </Link>
    </div>
  );
};

export default NavigationBar;
