import { apiFetch } from "./httpClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export interface AuthResponse {
  token: string;
  userType: "student" | "business";
  userId: string;
}

export async function login(email: string, password: string) {
  return apiFetch<AuthResponse>(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerStudent(student: any) {
  return apiFetch<AuthResponse>(`${API_BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ ...student, userType: "student" }),
  });
}

export async function registerBusiness(business: any) {
  return apiFetch<AuthResponse>(`${API_BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ ...business, userType: "business" }),
  });
}
