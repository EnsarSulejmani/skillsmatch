"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStudentById, Student, updateStudent } from "@/api/students";
import { getMe } from "@/api/auth";
import { getUserId } from "@/api/authSession";
import { getAllJobs, Job } from "@/api/jobs";

export default function SingleStudentProfile() {
  const { profile } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Session check on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const me = await getMe();
        // Defensive: if response is not an object or missing userId, treat as session expired
        if (!me || typeof me !== "object" || !me.userId) {
          setError("Session expired. Please log in again.");
          setSessionUserId(null);
        } else {
          setSessionUserId(me.userId);
        }
      } catch (err: any) {
        setError("Session expired. Please log in again.");
        setSessionUserId(null);
      } finally {
        setSessionChecked(true);
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    if (!profile || !sessionChecked) return;
    if (error) return;
    setLoading(true);
    setError(null);
    getStudentById(profile as string)
      .then((data) => {
        setStudent(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profile, sessionChecked]);

  useEffect(() => {
    if (!student) return;
    async function fetchCompletedJobs() {
      try {
        const allJobs: Job[] = await getAllJobs();
        const completed = allJobs.filter(
          (job) =>
            job.status === "completed" &&
            job.applicants &&
            student &&
            job.applicants.includes(student.studentId)
        );
        setCompletedJobs(completed);
      } catch (err: any) {
        setCompletedJobs([]);
      }
    }
    fetchCompletedJobs();
  }, [student]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) {
      console.error("No student object found, aborting save.");
      return;
    }
    // Check session before update
    try {
      const me = await getMe();
      if (!me || me.userId !== student.studentId) {
        setError("Session expired. Please log in again.");
        return;
      }
    } catch {
      setError("Session expired. Please log in again.");
      return;
    }
    const url = `${
      process.env.NEXT_PUBLIC_API_URL || "https://localhost:7091/api"
    }/students/${student.studentId}`;
    const payload = {
      name: student.name,
      bio: student.bio,
      location: student.location,
      skills: student.skills,
      profileImageUrl: student.profileImageUrl,
    };
    try {
      await updateStudent(student.studentId, payload);
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      console.error("Error updating student profile:", err);
      // Handle session expiry or unauthorized errors
      if (
        err.status === 401 ||
        err.status === 403 ||
        (err.message &&
          (err.message.includes("401") || err.message.includes("403")))
      ) {
        setError("Session expired. Please log in again.");
        // Optionally, redirect to login page:
        // window.location.href = "/login";
      } else if (
        err.message &&
        err.message.toLowerCase().includes("not found")
      ) {
        setError(
          "Student not found (404). Check if the student ID exists in the backend DB."
        );
      } else {
        setError(err.message || "Failed to update student profile");
      }
    }
  };

  if (loading || !sessionChecked) return <div>Loading...</div>;
  if (error || !student)
    return <div className="text-red-500">{error || "Student not found."}</div>;

  const canEdit = sessionUserId === student.studentId;

  return (
    <div className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl mt-12 border border-blue-100">
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-blue-200">
        <div className="flex items-center gap-4">
          {student.profileImageUrl && (
            <img
              src={student.profileImageUrl}
              alt={student.name}
              className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover shadow"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              {student.name}
            </h1>
            <div className="flex gap-2 mt-1">
              {student.skills &&
                student.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        </div>
        {canEdit && (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        )}
      </div>
      {isEditing ? (
        <form
          className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-inner border border-blue-100"
          onSubmit={handleSave}
        >
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Name
              </label>
              <input
                type="text"
                value={student.name}
                onChange={(e) =>
                  setStudent({ ...student, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                value={student.profileImageUrl || ""}
                onChange={(e) =>
                  setStudent({ ...student, profileImageUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                placeholder="Profile Image URL"
                required
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Location
              </label>
              <input
                type="text"
                value={student.location || ""}
                onChange={(e) =>
                  setStudent({ ...student, location: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                placeholder="Location"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={student.skills?.join(", ") || ""}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0),
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Bio
            </label>
            <textarea
              value={student.bio || ""}
              onChange={(e) => setStudent({ ...student, bio: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition self-end"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow-inner border border-blue-100">
          <div className="flex gap-6">
            <div className="flex-1">
              <p className="text-gray-700">
                <span className="font-semibold text-blue-800">Email:</span>{" "}
                {student.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-blue-800">Location:</span>{" "}
                {student.location}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                <span className="font-semibold text-blue-800">Skills:</span>{" "}
                {student.skills?.join(", ")}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold text-blue-800">Bio:</span>{" "}
              {student.bio}
            </p>
          </div>
        </div>
      )}
      {/* Completed Jobs Section */}
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">
          Completed Jobs
        </h2>
        {completedJobs.length === 0 ? (
          <p className="text-gray-500">No completed jobs yet.</p>
        ) : (
          <ul className="space-y-4">
            {completedJobs.map((job) => (
              <li
                key={job.id}
                className="p-4 bg-gray-100 rounded-xl shadow border border-blue-100"
              >
                <h3 className="font-semibold text-lg text-blue-800">
                  {job.title}
                </h3>
                <p className="text-gray-700">{job.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Logout Button for session management */}
      {canEdit && (
        <button
          className="mt-8 bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-red-500 hover:to-red-700 transition"
          onClick={async () => {
            try {
              // Dynamically import logoutApi to avoid circular deps
              const { logoutApi } = await import("@/api/auth");
              await logoutApi();
              localStorage.removeItem("userId");
              window.location.href = "/login";
            } catch (err) {
              alert("Logout failed. Please try again.");
            }
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}
