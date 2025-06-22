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
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{student.name}</h1>
        {canEdit && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      {isEditing ? (
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          <input
            type="text"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            className="px-3 py-2 border rounded"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
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
              className="w-full px-3 py-2 border rounded"
              required
            />
            <span className="text-xs text-gray-400">Comma separated</span>
          </div>
          <input
            type="text"
            value={student.location || ""}
            onChange={(e) =>
              setStudent({ ...student, location: e.target.value })
            }
            className="px-3 py-2 border rounded"
            placeholder="Location"
            required
          />
          <textarea
            value={student.bio || ""}
            onChange={(e) => setStudent({ ...student, bio: e.target.value })}
            className="px-3 py-2 border rounded"
            rows={3}
            required
          />
          <input
            type="text"
            value={student.profileImageUrl || ""}
            onChange={(e) =>
              setStudent({ ...student, profileImageUrl: e.target.value })
            }
            className="px-3 py-2 border rounded"
            placeholder="Profile Image URL"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {student.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Skills:</span>{" "}
            {student.skills && student.skills.length > 0
              ? student.skills.join(", ")
              : ""}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Location:</span> {student.location}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Bio:</span> {student.bio}
          </p>
        </div>
      )}
      {/* Completed Jobs Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Completed Jobs</h2>
        {completedJobs.length === 0 ? (
          <p className="text-gray-500">No completed jobs yet.</p>
        ) : (
          <ul className="space-y-4">
            {completedJobs.map((job) => (
              <li key={job.id} className="p-4 bg-gray-100 rounded shadow">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-700">{job.description}</p>
                {/* Example: <Link href={`/jobs/${job.id}`} className="text-blue-500 underline">View Job</Link> */}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Logout Button for session management */}
      {canEdit && (
        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
