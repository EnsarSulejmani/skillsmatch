"use client";
import { useState, useEffect } from "react";
import {
  login,
  registerStudent,
  registerBusiness,
  getMe,
  logout,
} from "@/api/auth";
import {
  saveAuthSession,
  isLoggedIn,
  getUserType,
  getUserId,
  clearAuthSession,
} from "@/api/authSession";
import { getSkills, getLocations } from "@/api/referenceData";
import { toStudentRegistrationPayload } from "@/api/students";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<"student" | "business">("student");

  // Student registration states
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentSkills, setStudentSkills] = useState<string[]>([]);
  const [studentLevel, setStudentLevel] = useState("");
  const [studentBio, setStudentBio] = useState("");

  // Business registration states
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPassword, setBusinessPassword] = useState("");

  // Error and loading states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Placeholder options
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  // Fetch skills and locations
  useEffect(() => {
    getSkills()
      .then(setSkillOptions)
      .catch(() =>
        setSkillOptions(["HTML", "CSS", "JavaScript", "React", "Python"])
      );
    getLocations()
      .then(setLocationOptions)
      .catch(() =>
        setLocationOptions(["New York", "London", "Berlin", "Tokyo", "Remote"])
      );
  }, []);

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const email = (e.target as any).email.value;
      const password = (e.target as any).password.value;
      const auth = await login(email, password);
      saveAuthSession(auth);
      // Optionally redirect or reload
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // Student registration handler
  async function handleStudentRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Only send required fields per API docs
      const student = {
        userType: "student",
        name: studentName,
        email: studentEmail,
        password: studentPassword,
      };
      const auth = await registerStudent(student);
      saveAuthSession(auth);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  // Business registration handler
  async function handleBusinessRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const business = {
        userType: "business",
        name: businessName,
        email: businessEmail,
        password: businessPassword,
      };
      const auth = await registerBusiness(business);
      saveAuthSession(auth);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">
          Welcome to SkillsMatch, Where your job is one click away
        </h1>
        {/* Mode Toggle */}
        <div className="mb-4 flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              mode === "login"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mode === "register"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        {/* User Type Toggle for Register */}
        {mode === "register" && (
          <div className="mb-4 flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                userType === "student"
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500 border border-green-500"
              }`}
              onClick={() => setUserType("student")}
            >
              Student
            </button>
            <button
              className={`px-4 py-2 rounded ${
                userType === "business"
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500 border border-green-500"
              }`}
              onClick={() => setUserType("business")}
            >
              Business
            </button>
          </div>
        )}
        {/* Forms */}
        {mode === "login" && (
          <form
            className="bg-white p-8 rounded shadow-md w-96"
            onSubmit={handleLogin}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
        {mode === "register" && userType === "student" && (
          <form
            className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
            onSubmit={handleStudentRegister}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register as Student"}
            </button>
          </form>
        )}
        {mode === "register" && userType === "business" && (
          <form
            className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
            onSubmit={handleBusinessRegister}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={businessPassword}
                onChange={(e) => setBusinessPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register as Business"}
            </button>
          </form>
        )}
        {/* Session Test Buttons - For Backend Testing */}
        <div className="mt-4 flex flex-col items-center">
          {isLoggedIn() && (
            <>
              <button
                className="bg-gray-200 px-4 py-2 rounded mb-2"
                onClick={async () => {
                  try {
                    const me = await getMe();
                    alert(`Logged in as ${me.userType} (ID: ${me.userId})`);
                  } catch (err: any) {
                    alert("Session invalid or expired");
                    clearAuthSession();
                    window.location.reload();
                  }
                }}
              >
                Test Session (GET /auth/me)
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
