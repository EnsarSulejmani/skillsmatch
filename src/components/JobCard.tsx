import Link from "next/link";
import React from "react";

interface Job {
  jobId: string; // unique identifier for the job
  createdBy: string; // business ID that created the job
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number; // budget for the job
  status: "open" | "in-progress" | "completed" | "cancelled"; // current status of the job
  applicants: string[]; // list of student IDs who applied for the job
  businessName?: string; // for display
}

interface JobCardProps {
  job: Job;
}

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-700 border-green-300",
  "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-300",
  completed: "bg-blue-100 text-blue-700 border-blue-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="w-[340px] h-[340px] bg-white shadow rounded-xl p-5 flex flex-col gap-4 border border-blue-100 hover:shadow-lg transition-transform duration-200">
      {/* Status + Title + Business */}
      <div className="flex flex-col items-center gap-2">
        <span
          className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
            statusColors[job.status] ||
            "bg-gray-100 text-gray-700 border-gray-300"
          } mb-1`}
        >
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
        <h2 className="text-lg font-bold text-blue-900 text-center min-h-[2.2em] line-clamp-2">
          {job.title}
        </h2>
        <Link
          href={`/businessprofile/${job.createdBy}`}
          className="text-blue-700 text-xs font-medium hover:underline"
        >
          {job.businessName || job.createdBy}
        </Link>
      </div>
      {/* Description */}
      <p className="text-gray-700 text-sm min-h-[2.5em] line-clamp-2 text-center mt-1">
        {job.description}
      </p>
      {/* Skills */}
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {job.skillsRequired.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>
      {/* Budget + Read More */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-base font-semibold text-blue-800">
          ${job.budget}
        </span>
        <Link
          href={`/job/${job.jobId}`}
          className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:bg-blue-600 transition"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
