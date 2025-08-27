"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { User, Menu, X } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { Great_Vibes } from "next/font/google";

const playfair = Playfair_Display({
  weight: "700",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="relative inline-block">
          {/* Shining logo text */}
          <Link
            href="/"
            className={`${greatVibes.className} relative text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1d3557] via-[#457b9d] to-[#a8dadc] animate-[shine_20s_infinite] select-none`}
            style={{
              backgroundSize: "200% auto",
              backgroundPosition: "200% center",
            }}
          >
            LumiSkin
          </Link>
        </div>



        {/* Desktop Navigation */}
        <div className={`${playfair.className} hidden md:flex items-center space-x-8 text-black font-semibold`}>
          {isAuthenticated ? (
            <>
              <Link href="/analysis" className=" transition-colors">
                DermaScan
              </Link>
              <Link href="/routine" className=" transition-colors">
                SkinRoutine
              </Link>
              <Link href="/ingredient-check" className=" transition-colors">
                Ingredients Analyzer
              </Link>

              {/* User menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2  transition-colors">
                  <User size={20} />
                  <span>{user?.firstName || "User"}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-gray-200 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-gray-700">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className=" transition-colors">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute right-4 top-16 bg-opacity-70 backdrop-blur-sm w-48 z-50">
          <div className={`${playfair.className} px-2 pt-2 pb-3 space-y-1 sm:px-3 text-black`}>
            {isAuthenticated ? (
              <>

                <Link href="/analysis" className="block px-3 py-2 transition-colors">
                  DermaScan
                </Link>
                <Link href="/routine" className="block px-3 py-2transition-colors">
                  SkinRoutine
                </Link>
                <Link href="/ingredient-check" className="block px-3 py-2  transition-colors">
                  Ingredient Analyzer
                </Link>
                <Link href="/profile" className="block px-3 py-2  transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2  transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2  transition-colors">
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2  transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
