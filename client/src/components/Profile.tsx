"use client";

import { useState } from "react";
import Image from "next/image";

const Profile = () => {
  const [name, setName] = useState("Raj Saini");
  const [email, setEmail] = useState("raj@example.com");
  const [password, setPassword] = useState("password123");
  const [profilePic, setProfilePic] = useState(
    "/images/man-cartoon-characters-using-phone.webp"
  );
  const [editing, setEditing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Simulate API call
    setEditing(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-slate-900 text-white rounded-xl shadow space-y-6">
      <h1 className="text-3xl font-bold text-center">My Profile</h1>

      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <Image
            src={profilePic}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover border-2 border-emerald-400"
          />
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              title="Upload new profile picture"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm text-gray-300">Name</label>
          {editing ? (
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          ) : (
            <p className="bg-slate-800 p-2 rounded">{name}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Email</label>
          {editing ? (
            <input
              type="email"
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          ) : (
            <p className="bg-slate-800 p-2 rounded">{email}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-300">Password</label>
          {editing ? (
            <input
              type="password"
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={password}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your password"
            />
          ) : (
            <p className="bg-slate-800 p-2 rounded">{password}</p>
          )}
        </div>

        <div className="text-right">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-500"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
