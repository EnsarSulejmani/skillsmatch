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
    <div className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl mt-12 border border-blue-100">
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-blue-200">
        <div className="flex items-center gap-4">
          {business.profileImageUrl && (
            <img
              src={business.profileImageUrl}
              alt={business.name}
              className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover shadow"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              {business.name}
            </h1>
            <div className="flex gap-2 mt-1">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                {business.industry}
              </span>
              {business.verified && (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Verified
                </span>
              )}
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
                Business Name
              </label>
              <input
                type="text"
                value={business.name}
                onChange={(e) =>
                  setBusiness({ ...business, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={business.industry}
                onChange={(e) =>
                  setBusiness({ ...business, industry: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
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
                value={business.location}
                onChange={(e) =>
                  setBusiness({ ...business, location: e.target.value })
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
                value={business.profileImageUrl || ""}
                onChange={(e) =>
                  setBusiness({ ...business, profileImageUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                placeholder="Profile Image URL"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Skills (comma separated)
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Bio
            </label>
            <textarea
              value={business.bio || ""}
              onChange={(e) =>
                setBusiness({ ...business, bio: e.target.value })
              }
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
                {business.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-blue-800">Location:</span>{" "}
                {business.location}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-blue-800">Industry:</span>{" "}
                {business.industry}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                <span className="font-semibold text-blue-800">Verified:</span>{" "}
                {business.verified ? "Yes" : "No"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-blue-800">Reviews:</span>{" "}
                {business.reviews}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-semibold text-blue-800">Skills:</span>{" "}
              {business.skills?.join(", ")}
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold text-blue-800">Bio:</span>{" "}
              {business.bio}
            </p>
          </div>
        </div>
      )}
      {/* Create Job Section */}
      {canEdit && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            Create a New Job
          </h2>
          <form
            onSubmit={handleJobCreate}
            className="flex flex-col gap-4 bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-inner"
          >
            <div className="flex gap-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newJob.title || ""}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Budget"
                  value={newJob.budget || ""}
                  onChange={(e) =>
                    setNewJob({ ...newJob, budget: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  required
                  min={0}
                />
              </div>
            </div>
            <textarea
              placeholder="Job Description"
              value={newJob.description || ""}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
              rows={2}
              required
            />
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
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
                      className="accent-blue-600"
                    />
                    <span className="text-blue-800 text-xs font-medium">
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition self-end"
            >
              {jobLoading ? "Posting Job..." : "Post Job"}
            </button>
            {jobError && (
              <p className="text-red-500 text-sm mt-2">{jobError}</p>
            )}
          </form>
        </div>
      )}
      {/* Previous Jobs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Previous Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <ul className="space-y-6">
            {jobs.map((job) => (
              <li
                key={job.jobId}
                className="p-6 bg-white rounded-xl shadow border border-blue-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-blue-800">
                    {job.title}
                  </h3>
                  <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {job.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-300 text-white px-3 py-1 rounded-sm text-sm whitespace-nowrap"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Budget: ${job.budget}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
