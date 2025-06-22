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
    <div className="w-full flex justify-around items-center shadow p-4 bg-white">
      <Link href="/" passHref>
        <Image
          src="/images/skilssmatchlogo.png"
          width={50}
          height={50}
          alt="Logo"
        />
      </Link>
      <div className="flex items-center space-x-5">
        <Link href="/" className="text-lg font-semibold">
          Home
        </Link>
        <Link href="/students" className="text-lg font-semibold">
          Student
        </Link>
        <Link href="/businesses" className="text-lg font-semibold">
          Business
        </Link>
      </div>
      {loggedIn && userId ? (
        <div className="flex items-center space-x-3">
          <Link
            href={profileLink}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isStudent()
              ? "Student Profile"
              : isBusiness()
              ? "Business Profile"
              : "My Profile"}
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </Link>
      )}
    </div>
  );
}
