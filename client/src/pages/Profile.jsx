import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);
  const [loading, setLoading] = useState(false);

  // Show local preview immediately
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result); // preview
      reader.readAsDataURL(file);

      handleFileUpload(file); // send to backend
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);

    try {
      const res = await fetch(`/api/upload/${currentUser._id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.avatar) {
        setAvatarUrl(data.avatar); // confirm with Cloudinary URL
        console.log("Uploaded avatar URL:", data.avatar);
      } else if (data.error) {
        console.error("Upload error:", data.error);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          src={avatarUrl}
          alt="avatar"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          onClick={() => fileRef.current.click()}
        />

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Uploading..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
