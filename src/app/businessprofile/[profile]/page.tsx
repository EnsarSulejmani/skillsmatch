"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessById, Business, updateBusiness } from "@/api/businesses";
import { getAllJobs, Job, createJob } from "@/api/jobs";
import { getUserId, getUserType } from "@/api/authSession";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionUserId = getUserId();
  const userType = getUserType();
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const skillOptions = ["React", "TypeScript", "Python", "UI/UX", "Marketing"];

  useEffect(() => {
    setLoading(true);
    getBusinessById(profile as string)
      .then(setBusiness)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    getAllJobs()
      .then((allJobs) =>
        setJobs(allJobs.filter((j) => j.createdBy === profile))
      )
      .catch(() => {});
  }, [profile]);

  if (loading) return <div>Loading...</div>;
  if (error || !business)
    return <div className="text-red-500">{error || "Business not found."}</div>;

  const canEdit =
    sessionUserId === business.businessId && userType === "business";

  const handleJobCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobLoading(true);
    setJobError(null);
    try {
      const created = await createJob({
        ...newJob,
        // Do not send createdBy, backend will use session
        status: "open",
      });
      setJobs([created, ...jobs]);
      setNewJob({
        title: "",
        description: "",
        skillsRequired: [],
        budget: 0,
        status: "open",
      });
    } catch (err: any) {
      setJobError(err.message);
    } finally {
      setJobLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    try {
      await updateBusiness(business.businessId, {
        name: business.name,
        bio: business.bio,
        location: business.location,
        industry: business.industry,
        skills: business.skills,
        profileImageUrl: business.profileImageUrl,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update business profile");
    }
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
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          <input
            type="text"
            value={business.name}
            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            value={business.location}
            onChange={(e) =>
              setBusiness({ ...business, location: e.target.value })
            }
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            value={business.industry}
            onChange={(e) =>
              setBusiness({ ...business, industry: e.target.value })
            }
            className="px-3 py-2 border rounded"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <input
              type="text"
              value={business.skills?.join(", ") || ""}
              onChange={(e) =>
                setBusiness({
                  ...business,
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
          <textarea
            value={business.bio || ""}
            onChange={(e) => setBusiness({ ...business, bio: e.target.value })}
            className="px-3 py-2 border rounded"
            rows={3}
            required
          />
          <input
            type="text"
            value={business.profileImageUrl || ""}
            onChange={(e) =>
              setBusiness({ ...business, profileImageUrl: e.target.value })
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
              {jobLoading ? "Posting Job..." : "Post Job"}
            </button>
            {jobError && <p className="text-red-500 text-sm">{jobError}</p>}
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
