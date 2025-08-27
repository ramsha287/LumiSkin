"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "../store/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await dispatch(login(formData)).unwrap();
      console.log("Login response: ",res)
      router.push("/"); // redirect after successful login
    } catch (err) {
      setError(err.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#b2967d]">
      {/* Login Form Box */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl shadow-xl p-8 bg-white/70 backdrop-blur-md border border-white/30"
        style={{
          backgroundImage: "url('/auth.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow:
            "0 10px 30px rgba(101, 67, 33, 0.45), 0 6px 12px rgba(60, 34, 17, 0.35)",
        }}
      >
        <h2 className="text-3xl font-extrabold text-center text-[#5a3e36] mb-6 drop-shadow-sm">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 placeholder-[#a97c50] text-[#5a3e36] focus:outline-none focus:ring-2 focus:ring-[#e6beae]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 placeholder-[#a97c50] text-[#5a3e36] focus:outline-none focus:ring-2 focus:ring-[#e6beae]"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-[#5a3e36] hover:bg-[#3d2923] shadow-md transition-colors"
          >
            Login
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-6 text-center text-sm text-[#5a3e36]">
          <p>
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#b2967d] font-semibold hover:underline"
            >
              Sign Up
            </a>
          </p>
          <p className="mt-2">
            <a
              href="/forgot-password"
              className="text-[#a97c50] hover:underline"
            >
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
