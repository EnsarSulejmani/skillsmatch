"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Job {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number;
  status: "open" | "in-progress" | "completed" | "cancelled";
  createdBy: string;
}

export default function SingleJob() {
  const { singlejob } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  // Simulate session: is a student logged in?
  const isStudentLoggedIn = true;

  useEffect(() => {
    // Simulate fetching job data by ID
    setJob({
      id: singlejob as string,
      title: "Web Development Project",
      description:
        "Looking for a student to help with a modern web development project. You will work with React, Tailwind CSS, and collaborate with a dynamic team. Great opportunity to build your portfolio!",
      skillsRequired: ["React", "Tailwind CSS", "Teamwork"],
      budget: 500,
      status: "open",
      createdBy: "Acme Corp",
    });
  }, [singlejob]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100 py-12">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700 line-clamp-2">
            {job.title}
          </h1>
          <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800 capitalize">
            {job.status}
          </span>
        </div>
        <p className="text-gray-700 text-lg line-clamp-6">{job.description}</p>
        <div>
          <span className="font-semibold text-gray-600">Skills Required:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="bg-blue-300 text-white px-3 py-1 rounded-full text-sm shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="font-semibold text-gray-600">Budget:</span>
            <span className="ml-2 text-xl font-bold text-blue-600">
              ${job.budget}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Posted by:</span>
            <span className="ml-2 text-blue-500 font-medium">
              {job.createdBy}
            </span>
          </div>
        </div>
        {isStudentLoggedIn && job.status === "open" && (
          <button
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg text-lg font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition-colors duration-300"
            onClick={() => {}}
          >
            Apply for this Job
          </button>
        )}
      </div>
    </div>
  );
}
