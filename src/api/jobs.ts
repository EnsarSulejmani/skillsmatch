import { apiFetch } from "./httpClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export interface Job {
  jobId: string;
  createdBy: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number;
  status: "open" | "in-progress" | "completed" | "cancelled";
  applicants: string[];
}

export async function getAllJobs() {
  return apiFetch<Job[]>(`${API_BASE}/jobs`);
}

export async function getJobById(id: string) {
  return apiFetch<Job>(`${API_BASE}/jobs/${id}`);
}

export async function createJob(job: Partial<Job>) {
  return apiFetch<Job>(`${API_BASE}/jobs`, {
    method: "POST",
    body: JSON.stringify(job),
  });
}

export async function updateJob(id: string, job: Partial<Job>) {
  return apiFetch<Job>(`${API_BASE}/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(job),
  });
}

export async function deleteJob(id: string) {
  return apiFetch<void>(`${API_BASE}/jobs/${id}`, {
    method: "DELETE",
  });
}

export async function applyToJob(jobId: string, studentId: string) {
  return apiFetch<void>(`${API_BASE}/jobs/${jobId}/apply`, {
    method: "POST",
    body: JSON.stringify({ studentId }),
  });
}
