"use client";
import { useState } from "react";
import { login, registerStudent, registerBusiness } from "@/api/auth";
import { saveAuthSession } from "@/api/authSession";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<"student" | "business">("student");

  // Student registration states
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentSkills, setStudentSkills] = useState<string[]>([]);
  const [studentLevel, setStudentLevel] = useState("");
  const [studentBio, setStudentBio] = useState("");

  // Business registration states
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPassword, setBusinessPassword] = useState("");
  const [businessBio, setBusinessBio] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessIndustry, setBusinessIndustry] = useState("");

  // Error and loading states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Placeholder options
  const skillOptions = ["HTML", "CSS", "JavaScript", "React", "Python"];
  const studentLevels = ["Undergraduate", "Graduate", "Senior", "Junior"];
  const locationOptions = ["New York", "London", "Berlin", "Tokyo", "Remote"];

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
      const student = {
        firstName: studentFirstName,
        lastName: studentLastName,
        email: studentEmail,
        password: studentPassword,
        skills: studentSkills,
        level: studentLevel,
        bio: studentBio,
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
        name: businessName,
        email: businessEmail,
        password: businessPassword,
        bio: businessBio,
        location: businessLocation,
        industry: businessIndustry,
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
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={studentFirstName}
                  onChange={(e) => setStudentFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={studentLastName}
                  onChange={(e) => setStudentLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <label key={skill} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={studentSkills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setStudentSkills([...studentSkills, skill]);
                        else
                          setStudentSkills(
                            studentSkills.filter((s) => s !== skill)
                          );
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Level
              </label>
              <select
                required
                value={studentLevel}
                onChange={(e) => setStudentLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Level</option>
                {studentLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                required
                value={studentBio}
                onChange={(e) => setStudentBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                required
                value={businessBio}
                onChange={(e) => setBusinessBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                list="location-list"
                required
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search or select location"
              />
              <datalist id="location-list">
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                required
                value={businessIndustry}
                onChange={(e) => setBusinessIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter industry"
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
      </div>
    </div>
  );
}
