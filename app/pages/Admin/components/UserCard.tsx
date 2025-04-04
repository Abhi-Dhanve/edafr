import React, { use, useState } from 'react';
import api from '../../../shared/hooks/api';

const UserCard = ({ user }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleXClick = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };


  const { mutate } = api.useDeleteUser(); 
  const handleConfirm = (userId) => {
    return () => {
      mutate(userId, {
        onSuccess: () => {
          console.log(`User with ID ${user.id} deleted successfully`);
          setShowConfirm(false);
        },
        onError: (error) => {
          console.error("Error deleting user:", error);
          setShowConfirm(false);
        },
      });
      console.log(`Deleting user with ID: ${userId}`);
    };
  };

  return (
    <div className="bg-[rgb(40,25,30)] p-4 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="text-white font-medium">{user.name}</h3>
        <p className="text-white text-sm">{user.email}</p>
        <p className="text-white text-sm">
          {user.createdAt.slice(0,10)} {user.createdAt.slice(11,-5)}
        </p>
        <p className="text-white text-sm">
          Active Sessions:
        </p>
      </div>
      <div className="relative">
        {!showConfirm ? (
          <button onClick={handleXClick}>
            X
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleConfirm(user.id)}
              className="text-white bg-red-500 px-2 py-1 rounded"
            >
              Confirm
            </button>
            <button 
              onClick={handleCancel}
              className="text-white bg-gray-500 px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;