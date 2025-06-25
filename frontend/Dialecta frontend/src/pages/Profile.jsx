import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setImageFile(base64Image);
    };
  };

  const handleSaveChange = async () => {
    await updateProfile({ profilePic: imageFile });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 py-8">
      <div className="bg-gray-900/90 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-800 flex flex-col items-center">
        <div className="flex items-center space-x-8 mb-6">
          <div className="relative">
            <img
              src={imageFile || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-lg"
            />
            <label htmlFor="profileImageInput" className="absolute bottom-2 right-2 bg-primary p-3 rounded-full cursor-pointer hover:bg-primary/80 shadow-lg border-2 border-gray-900">
              <Camera className="w-6 h-6 text-white" />
              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-100 mb-1">{authUser?.fullname}</h2>
            <p className="text-primary font-semibold">{authUser?.email}</p>
          </div>
        </div>
        {imageFile && (
          <div className="mt-2 flex justify-end w-full">
            <button
              onClick={handleSaveChange}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold shadow-md"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Save Change'
              )}
            </button>
          </div>
        )}
        <div className="mt-8 border-t border-gray-800 pt-6 w-full">
          <h3 className="text-xl font-bold mb-4 text-gray-100">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-gray-100 shadow">
              <p className="text-sm text-primary">Member Since</p>
              <p className="text-lg font-semibold">{new Date(authUser?.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-gray-100 shadow">
              <p className="text-sm text-primary">Account Status</p>
              <p className="text-lg text-green-600 font-semibold">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;