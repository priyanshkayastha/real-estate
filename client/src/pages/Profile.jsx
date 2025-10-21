import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [uploading, setUploading] = useState(false);
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
  });

  const [message, setMessage] = useState(""); // Success messages
  const [errorMessage, setErrorMessage] = useState(""); // Error messages

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");
    setMessage("");

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(`/api/upload/${currentUser._id}`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || !result.avatar) {
        setErrorMessage(result.message || "Image upload failed");
        return;
      }

      setUploadedAvatar(result.avatar);
      setMessage("Image uploaded successfully!");
    } catch (err) {
      setErrorMessage(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (uploading) {
      setErrorMessage("Please wait for image upload to complete");
      return;
    }

    dispatch(updateUserStart());

    try {
      const updateData = {
        ...formData,
        avatar: uploadedAvatar || currentUser.avatar,
      };

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setErrorMessage(data.message || "Update failed");
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setMessage("Profile updated successfully!");
      setUploadedAvatar(null);
    } catch (err) {
      setErrorMessage(err.message || "Update failed");
      dispatch(updateUserFailure(err.message));
    }
  };

  const displayAvatar = uploadedAvatar || currentUser.avatar;

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="relative self-center">
          <img
            src={displayAvatar}
            alt="avatar"
            className="rounded-full h-24 w-24 object-cover cursor-pointer"
            onClick={() => !uploading && fileRef.current.click()}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="text-white text-xs text-center">Uploading...</div>
            </div>
          )}
        </div>

        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password (leave blank to keep current)"
          className="border p-3 rounded-lg"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {uploading ? "Uploading Image..." : "Update"}
        </button>
        <div className="flex justify-between">
          <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
            Delete Account
          </span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>

        {/* Messages */}
        <div className="flex flex-col items-center mt-2 gap-1">
          {message && <span className="text-green-700 text-sm">{message}</span>}
          {errorMessage && (
            <span className="text-red-700 text-sm">{errorMessage}</span>
          )}
        </div>
      </form>

      {/* <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Current Avatar: {currentUser.avatar?.substring(0, 50)}...</p>
        {uploadedAvatar && <p>New Avatar: {uploadedAvatar.substring(0, 50)}...</p>}
      </div> */}
    </div>
  );
};

export default Profile;
