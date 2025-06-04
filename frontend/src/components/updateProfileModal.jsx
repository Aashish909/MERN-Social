import React from 'react'

const updateProfileModal = (onClose, title, value) => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {value && value.length > 0 ? (
            value.map((e, i) => (
              <Link
                key={i}
                to={`/user/${e._id}`}
                onClick={onClose}
                className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded"
              >
                <img
                  src={e.profilePic?.url}
                  alt={e.name}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium text-gray-800">{e.name}</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No followers found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default updateProfileModal