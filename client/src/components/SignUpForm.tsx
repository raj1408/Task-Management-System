"use client";
import React, { useState } from "react";
import Link from "next/link";

const SignUpForm: React.FC = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validate = () => {
    const newErrors = { username: "", email: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!user.username.trim()) newErrors.username = "Username is required.";
    if (!emailRegex.test(user.email))
      newErrors.email = "Invalid email address.";
    if (!passwordRegex.test(user.password))
      newErrors.password =
        "Password must be at least 8 characters long and include a letter, number, and special character.";

    setErrors(newErrors);
    return !newErrors.username && !newErrors.email && !newErrors.password;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted", { ...user, profilePic });
      // TODO: Upload `profilePic` to server if needed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="bg-slate-900 text-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-3xl mb-6">
          Sign Up to manage your Tasks!
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Profile Picture Upload */}
          <div className="mb-6 text-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full mx-auto object-cover mb-2 border-2 border-emerald-400"
              />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto bg-gray-600 flex items-center justify-center text-sm mb-2">
                No Image
              </div>
            )}
            <label className="cursor-pointer text-green-400 hover:underline text-sm">
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Username */}
          <div className="relative mb-6">
            <input
              id="username"
              type="text"
              placeholder=" "
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className={`peer w-full px-4 pt-6 pb-2 bg-transparent border ${
                errors.username ? "border-red-400" : "border-gray-400"
              } rounded focus:outline-none focus:border-green-400`}
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-400"
            >
              Username *
            </label>
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative mb-6">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className={`peer w-full px-4 pt-6 pb-2 bg-transparent border ${
                errors.email ? "border-red-400" : "border-gray-400"
              } rounded focus:outline-none focus:border-green-400`}
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-400"
            >
              Email Address *
            </label>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <input
              id="password"
              type="password"
              placeholder=" "
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className={`peer w-full px-4 pt-6 pb-2 bg-transparent border ${
                errors.password ? "border-red-400" : "border-gray-400"
              } rounded focus:outline-none focus:border-green-400`}
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-400"
            >
              Password *
            </label>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-emerald-500 text-white font-bold py-3 rounded hover:bg-emerald-600 transition"
          >
            SIGN UP
          </button>
        </form>

        {/* 🔗 Login Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
