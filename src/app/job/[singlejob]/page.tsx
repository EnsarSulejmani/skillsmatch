"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getJobById, updateJob, Job } from "@/api/jobs";
import { getUserId, isStudent } from "@/api/authSession";

export default function SingleJob() {
  const { singlejob } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const studentLoggedIn = isStudent();
  const userId = getUserId();

  useEffect(() => {
    getJobById(singlejob as string)
      .then(setJob)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [singlejob]);

  // Add edit button for business owner
  const canEdit = job && userId && job.createdBy === userId;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editJob) return;
    try {
      await updateJob(editJob.jobId, {
        title: editJob.title,
        description: editJob.description,
        skillsRequired: editJob.skillsRequired,
        budget: editJob.budget,
        status: editJob.status,
      });
      setJob(editJob);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update job");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error || !job)
    return <div className="text-red-500">{error || "Job not found."}</div>;

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
        {studentLoggedIn && job.status === "open" && (
          <button
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg text-lg font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition-colors duration-300"
            onClick={() => {
              /* TODO: Implement applyToJob */
            }}
          >
            Apply for this Job
          </button>
        )}
        {canEdit && !isEditing && (
          <button
            className="mt-6 w-full bg-yellow-500 text-white py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-yellow-600 transition-colors duration-300"
            onClick={() => {
              setEditJob(job);
              setIsEditing(true);
            }}
          >
            Edit Job
          </button>
        )}
        {isEditing && editJob && (
          <form className="flex flex-col gap-4 mt-6" onSubmit={handleSave}>
            <input
              type="text"
              value={editJob.title}
              onChange={(e) =>
                setEditJob({ ...editJob, title: e.target.value })
              }
              className="px-3 py-2 border rounded"
              required
            />
            <textarea
              value={editJob.description}
              onChange={(e) =>
                setEditJob({ ...editJob, description: e.target.value })
              }
              className="px-3 py-2 border rounded"
              rows={3}
              required
            />
            <input
              type="text"
              value={editJob.skillsRequired.join(", ")}
              onChange={(e) =>
                setEditJob({
                  ...editJob,
                  skillsRequired: e.target.value
                    .split(",")
                    .map((s) => s.trim()),
                })
              }
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              value={editJob.budget}
              onChange={(e) =>
                setEditJob({ ...editJob, budget: Number(e.target.value) })
              }
              className="px-3 py-2 border rounded"
              required
              min={0}
            />
            <select
              value={editJob.status}
              onChange={(e) =>
                setEditJob({
                  ...editJob,
                  status: e.target.value as Job["status"],
                })
              }
              className="px-3 py-2 border rounded"
              required
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mt-2"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
