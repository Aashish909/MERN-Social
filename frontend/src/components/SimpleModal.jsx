import React from "react";

const SimpleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    
    <div
      className="fixed inset-0 bg-opacity-75 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
    >
    
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 relative">
    
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl font-bold focus:outline-none"
          aria-label="Close modal"
          autoFocus
        >
          &times;
        </button>

     
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default SimpleModal;
