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

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="w-[360px] bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 border-t-5 border-blue-500">
      {/* top Section - Status + Title + description*/}
      <div className="w-full p-2 flex flex-col space-y-2">
        <p className="rounded-full text-sm px-2 py-1 bg-green-300 text-white w-fit">
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </p>
        <Link
          href={`/businessprofile/${job.createdBy}`}
          passHref
          className="text-blue-500"
        >
          <span className="text-gray-500">Posted by:</span>{" "}
          {job.businessName || job.createdBy}
        </Link>

        <h2 className="text-xl font-bold min-h-[2.8em] line-clamp-2">
          {job.title}
        </h2>
        <p className="text-gray-600 min-h-[5.6em] line-clamp-4">
          {job.description}
        </p>
      </div>
      {/* End of Top Section */}

      {/* Skills Section */}
      <div className="overflow-x-scroll">
        <div className="flex space-x-2 p-2">
          {job.skillsRequired.map((skill) => (
            <span
              key={skill}
              className="bg-blue-300 text-white px-3 py-1 rounded-sm text-sm whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      {/* End of Skills Section */}

      {/* Bottom Section - Budget + Apply Button */}
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">${job.budget}</p>
        <Link
          href={`/job/${job.jobId}`}
          className="bg-blue-500 text-white px-2 py-1 rounded text-base shadow-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Read More
        </Link>
        {/* End of Bottom Section */}
      </div>
    </div>
  );
}
