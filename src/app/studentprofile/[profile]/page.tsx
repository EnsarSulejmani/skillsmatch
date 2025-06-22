"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  level: string;
  bio: string;
}

export default function SingleStudentProfile() {
  const { profile } = useParams();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  // Placeholder: Replace with real session/user logic
  const sessionUserId = "1"; // Simulate logged-in user with id '1'

  useEffect(() => {
    // Simulate fetching from .NET Core Web API
    // Replace with real API call
    const fetchStudent = async () => {
      // Example: await fetch(`/api/student/${profile}`)
      // Simulated data:
      setStudent({
        id: profile as string,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@email.com",
        skills: ["React", "TypeScript", "CSS"],
        level: "Graduate",
        bio: "Passionate about web development and design.",
      });
    };
    fetchStudent();
  }, [profile]);

  useEffect(() => {
    // Simulate fetching completed jobs for this student
    // Replace with real API call
    setCompletedJobs([
      {
        id: "job1",
        title: "Website Redesign for Local Bakery",
        description:
          "Redesigned and modernized the bakery's website using React and Tailwind CSS.",
      },
      {
        id: "job2",
        title: "Data Analysis for Marketing",
        description:
          "Analyzed marketing data and provided actionable insights using Python.",
      },
    ]);
  }, [profile]);

  if (!student) return <div>Loading...</div>;

  const canEdit = sessionUserId === student.id;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {student.firstName} {student.lastName}
        </h1>
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
        <form className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={student.firstName}
              onChange={(e) =>
                setStudent({ ...student, firstName: e.target.value })
              }
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={student.lastName}
              onChange={(e) =>
                setStudent({ ...student, lastName: e.target.value })
              }
              className="flex-1 px-3 py-2 border rounded"
            />
          </div>
          <input
            type="email"
            value={student.email}
            onChange={(e) => setStudent({ ...student, email: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <input
              type="text"
              value={student.skills.join(", ")}
              onChange={(e) =>
                setStudent({ ...student, skills: e.target.value.split(",") })
              }
              className="w-full px-3 py-2 border rounded"
            />
            <span className="text-xs text-gray-400">Comma separated</span>
          </div>
          <input
            type="text"
            value={student.level}
            onChange={(e) => setStudent({ ...student, level: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <textarea
            value={student.bio}
            onChange={(e) => setStudent({ ...student, bio: e.target.value })}
            className="px-3 py-2 border rounded"
            rows={3}
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
            {student.skills.join(", ")}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Level:</span> {student.level}
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
    </div>
  );
}
