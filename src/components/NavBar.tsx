"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  isLoggedIn,
  getUserType,
  getUserId,
  clearAuthSession,
  isStudent,
  isBusiness,
} from "@/api/authSession";

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"student" | "business" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    function syncAuthState() {
      const token = localStorage.getItem("skillsmatch_token");
      const type = localStorage.getItem("skillsmatch_userType");
      const id = localStorage.getItem("skillsmatch_userId");
      setLoggedIn(!!token);
      setUserType(type === "student" || type === "business" ? type : null);
      setUserId(id || null);
    }
    syncAuthState();
    // Listen for storage changes (cross-tab logout/login)
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  function handleLogout() {
    clearAuthSession();
    window.location.href = "/";
  }

  let profileLink = "/";
  if (userType === "student" && userId)
    profileLink = `/studentprofile/${userId}`;
  if (userType === "business" && userId)
    profileLink = `/businessprofile/${userId}`;

  return (
    <nav className="w-full flex justify-between items-center shadow-lg p-4 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 sticky top-0 z-50">
      <Link href="/" passHref className="flex items-center gap-2 group">
        <Image
          src="/images/skilssmatchlogo.png"
          width={48}
          height={48}
          alt="Logo"
          className="rounded-full border-2 border-blue-300 shadow group-hover:scale-105 transition"
        />
        <span className="ml-2 text-2xl font-extrabold text-blue-800 tracking-tight hidden sm:inline">
          SkillsMatch
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-lg font-semibold text-blue-800 hover:text-blue-600 transition"
        >
          View Jobs
        </Link>
        <Link
          href="/students"
          className="text-lg font-semibold text-blue-800 hover:text-blue-600 transition"
        >
          View Students
        </Link>
        <Link
          href="/businesses"
          className="text-lg font-semibold text-blue-800 hover:text-blue-600 transition"
        >
          View Businesses
        </Link>
      </div>
      {loggedIn && userId ? (
        <div className="flex items-center gap-4">
          <Link
            href={profileLink}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition"
          >
            {isStudent()
              ? "Student Profile"
              : isBusiness()
              ? "Business Profile"
              : "My Profile"}
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-400 to-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-red-500 hover:to-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
