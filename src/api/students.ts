import { apiFetch } from "./httpClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7091/api";

export interface Student {
  studentId: string;
  name: string;
  email: string;
  bio?: string;
  skills?: string[];
  location?: string;
  completedJobs?: string[];
  profileImageUrl?: string;
  reviews?: number;
  industry?: string; // <-- add industry field for backend compatibility
}

export async function getAllStudents() {
  return apiFetch<Student[]>(`${API_BASE}/students`);
}

export async function getStudentById(id: string) {
  return apiFetch<Student>(`${API_BASE}/students/${id}`);
}

export async function createStudent(student: Partial<Student>) {
  return apiFetch<Student>(`${API_BASE}/students`, {
    method: "POST",
    body: JSON.stringify(student),
  });
}

export async function updateStudent(id: string, student: Partial<Student>) {
  // Only send fields allowed by backend for student update
  const body: Record<string, any> = {};
  if (student.name !== undefined) body.name = student.name;
  if (student.bio !== undefined) body.bio = student.bio;
  if (student.skills !== undefined) body.skills = student.skills;
  if (student.location !== undefined) body.location = student.location;
  if (student.profileImageUrl !== undefined)
    body.profileImageUrl = student.profileImageUrl;
  return apiFetch<Student>(`${API_BASE}/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteStudent(id: string) {
  return apiFetch<void>(`${API_BASE}/students/${id}`, {
    method: "DELETE",
  });
}

export function toStudentRegistrationPayload(student: any) {
  return {
    name: student.name,
    email: student.email,
    password: student.password,
    userType: "student",
  };
}
