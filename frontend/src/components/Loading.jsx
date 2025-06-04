import React from "react";

export const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <h1 className="text-2xl font-semibold text-blue-600">MERN Social</h1>
      </div>
      <p className="mt-4 text-gray-500 text-sm">Loading, please wait...</p>
    </div>
  );
};

export const LoadingAnimation = () => {
  return (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
};
