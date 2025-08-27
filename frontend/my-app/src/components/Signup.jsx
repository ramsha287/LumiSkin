"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { register } from "../store/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      router.push("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
      console.error(err);
    }
  };

  const blobColors = ["#b2967d"];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b bg-[#b2967d]">

      {/* Form Box */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl shadow-xl p-8 bg-white/70 backdrop-blur-md border border-white/30"
        style={{
          backgroundImage: "url('/auth.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 8px 25px rgba(101, 67, 33, 0.4), 0 4px 10px rgba(60, 34, 17, 0.3)", 
  
        }}

      >
        <h2 className="text-3xl font-extrabold text-center text-[#5a3e36] mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-1/2 px-4 py-3 rounded-xl border border-white/40 bg-white/30 placeholder-[#e6beae] text-[#b2967d] focus:outline-none focus:ring-2 focus:ring-[#e6beae]"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-1/2 px-4 py-3 rounded-xl border border-white/40 bg-white/30 placeholder-[#e6beae] text-[#b2967d] focus:outline-none focus:ring-2 focus:ring-[#e6beae]"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/30 placeholder-[#e6beae] text-[#b2967d] focus:outline-none focus:ring-2 focus:ring-[#e6beae]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/30 placeholder-[#e6beae] text-[#b2967d] focus:outline-none focus:ring-2 focus:ring-[#e6beae]"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/30 placeholder-[#e6beae] text-[#b2967d] focus:outline-none focus:ring-2 focus:ring-[#e6beae]"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-[#5a3e36] hover:bg-[#a17f66] shadow-md transition-colors"
          >
            Register
          </button>
        </form>
      </div>


    </div>
  );
};

export default Signup;
