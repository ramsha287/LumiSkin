"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Image side */}
        <div className="flex-shrink-0 md:w-1/2">
          <img
            src="/footer.jpeg" // Your image path
            alt="true.Kind Logo"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Text columns side */}
        <div className="flex flex-col md:flex-row justify-between gap-10 text-sm text-gray-700 md:w-1/2">
          {/* Explore */}
          <div className="flex flex-col space-y-2">
            <h5 className="font-bold text-gray-900">EXPLORE</h5>
            <a href="#shop" className="hover:underline">Shop</a>
            <a href="#philosophy" className="hover:underline">Philosophy</a>
            <a href="#gallery" className="hover:underline">Gallery</a>
            <a href="#journal" className="hover:underline">Journal</a>
            <a href="#signup" className="hover:underline">Sign Up/Login</a>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col space-y-2">
            <h5 className="font-bold text-gray-900">FOLLOW US</h5>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Facebook
            </a>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col space-y-2">
            <h5 className="font-bold text-gray-900">CONTACT US</h5>
            <a href="mailto:tk@brandsofsbia.com" className="hover:underline">tk@brandsofsbia.com</a>
            <a href="tel:1112222333" className="hover:underline">111-222-2333</a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="max-w-7xl mx-auto border-t border-gray-200 mt-10 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} true.Kind. Cleanse. Curevate. Natural Skincare.
        <br />
        Honest products that truly work.
      </div>
    </footer>
  );
}
