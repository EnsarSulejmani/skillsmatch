import { apiFetch } from "./httpClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  level: string;
  bio: string;
  appliedJobs: string[];
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
  return apiFetch<Student>(`${API_BASE}/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });
}

export async function deleteStudent(id: string) {
  return apiFetch<void>(`${API_BASE}/students/${id}`, {
    method: "DELETE",
  });
}
