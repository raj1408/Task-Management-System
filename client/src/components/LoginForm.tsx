"use client";
import React, { useState } from "react";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="bg-slate-900 text-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-3xl mb-6">Welcome Back!</h2>

        <form>
          <div className="relative mb-6">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer w-full px-4 pt-6 pb-2 bg-transparent border border-gray-400 rounded focus:outline-none focus:border-green-400"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-placeholder-shown:text-gray-500 peer-focus:top-2
                peer-focus:text-sm peer-focus:text-green-400"
            >
              Email Address *
            </label>
          </div>

          <div className="relative mb-4">
            <input
              id="password"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full px-4 pt-6 pb-2 bg-transparent border border-gray-400 rounded focus:outline-none focus:border-green-400"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-placeholder-shown:text-gray-500 peer-focus:top-2
                peer-focus:text-sm peer-focus:text-green-400"
            >
              Password *
            </label>
            <div className="text-right text-sm text-green-400 mt-1">
              <a href="#">Forgot Password?</a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-emerald-500 text-white font-bold py-3 rounded hover:bg-emerald-600 transition"
          >
            LOG IN
          </button>
        </form>

        {/* 🔗 Sign-up Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
