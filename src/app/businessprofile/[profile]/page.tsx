"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Job {
  jobId: string;
  createdBy: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number;
  status: "open" | "in-progress" | "completed" | "cancelled";
  applicants: string[];
}

interface Business {
  businessId: string;
  name: string;
  email: string;
  password: string;
  reviews: number;
  bio: string;
  jobsPosted: string[];
  location: string;
  skills: string[];
  verified: boolean;
  industry: string;
}

export default function BusinessProfile() {
  const { profile } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: "",
    description: "",
    skillsRequired: [],
    budget: 0,
    status: "open",
  });
  // Placeholder: Replace with real session/user logic
  const sessionUserId = "1";
  const skillOptions = ["React", "TypeScript", "Python", "UI/UX", "Marketing"];

  useEffect(() => {
    // Simulate fetching from .NET Core Web API
    setBusiness({
      businessId: profile as string,
      name: "Acme Corp",
      email: "contact@acme.com",
      password: "",
      reviews: 4.7,
      bio: "We connect students with real-world projects.",
      jobsPosted: ["job1", "job2"],
      location: "New York",
      skills: ["React", "UI/UX"],
      verified: true,
      industry: "Tech",
    });
    setJobs([
      {
        jobId: "job1",
        createdBy: profile as string,
        title: "Landing Page Redesign",
        description:
          "Looking for a student to redesign our landing page using Next.js and Tailwind CSS.",
        skillsRequired: ["React", "UI/UX"],
        budget: 500,
        status: "open",
        applicants: [],
      },
      {
        jobId: "job2",
        createdBy: profile as string,
        title: "Market Research",
        description:
          "Need a student to conduct market research for our new product line.",
        skillsRequired: ["Marketing"],
        budget: 300,
        status: "completed",
        applicants: [],
      },
    ]);
  }, [profile]);

  if (!business) return <div>Loading...</div>;

  const canEdit = sessionUserId === business.businessId;

  const handleJobCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newJob.title ||
      !newJob.description ||
      !newJob.skillsRequired ||
      !newJob.budget
    )
      return;
    setJobs([
      {
        jobId: Date.now().toString(),
        createdBy: business.businessId,
        title: newJob.title,
        description: newJob.description,
        skillsRequired: newJob.skillsRequired,
        budget: Number(newJob.budget),
        status: "open",
        applicants: [],
      },
      ...jobs,
    ]);
    setNewJob({
      title: "",
      description: "",
      skillsRequired: [],
      budget: 0,
      status: "open",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{business.name}</h1>
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
          <input
            type="text"
            value={business.name}
            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="email"
            value={business.email}
            onChange={(e) =>
              setBusiness({ ...business, email: e.target.value })
            }
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={business.location}
            onChange={(e) =>
              setBusiness({ ...business, location: e.target.value })
            }
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={business.industry}
            onChange={(e) =>
              setBusiness({ ...business, industry: e.target.value })
            }
            className="px-3 py-2 border rounded"
          />
          <textarea
            value={business.bio}
            onChange={(e) => setBusiness({ ...business, bio: e.target.value })}
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
            <span className="font-semibold">Email:</span> {business.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Location:</span> {business.location}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Industry:</span> {business.industry}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Bio:</span> {business.bio}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Verified:</span>{" "}
            {business.verified ? "Yes" : "No"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Reviews:</span> {business.reviews}
          </p>
        </div>
      )}
      {/* Create Job Section */}
      {canEdit && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Create a New Job</h2>
          <form onSubmit={handleJobCreate} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Job Title"
              value={newJob.title || ""}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <textarea
              placeholder="Job Description"
              value={newJob.description || ""}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
              className="px-3 py-2 border rounded"
              rows={2}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Required
              </label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <label key={skill} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={newJob.skillsRequired?.includes(skill) || false}
                      onChange={(e) => {
                        if (e.target.checked)
                          setNewJob({
                            ...newJob,
                            skillsRequired: [
                              ...(newJob.skillsRequired || []),
                              skill,
                            ],
                          });
                        else
                          setNewJob({
                            ...newJob,
                            skillsRequired: (
                              newJob.skillsRequired || []
                            ).filter((s) => s !== skill),
                          });
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <input
              type="number"
              placeholder="Budget"
              value={newJob.budget || ""}
              onChange={(e) =>
                setNewJob({ ...newJob, budget: Number(e.target.value) })
              }
              className="px-3 py-2 border rounded"
              required
              min={0}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Job
            </button>
          </form>
        </div>
      )}
      {/* Previous Jobs Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Previous Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.jobId} className="p-4 bg-gray-100 rounded shadow">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-700">{job.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-300 text-white px-3 py-1 rounded-sm text-sm whitespace-nowrap"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Budget: ${job.budget}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Status: {job.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
