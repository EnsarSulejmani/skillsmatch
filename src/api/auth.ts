import { apiFetch } from "./httpClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7091/api";

export interface AuthResponse {
  token: string;
  userType: "student" | "business";
  userId: string;
}

/**
 * Auth API Endpoints (detailed):
 *
 * POST /api/auth/register
 *   - Register a new user (student or business)
 *   - Body: { userType: 'student'|'business', name, email, password }
 *   - Returns: { userId, userType, name, email, token }
 *
 * POST /api/auth/login
 *   - Login with email and password
 *   - Body: { email, password }
 *   - Returns: { userId, userType, name, email, token }
 *
 * GET /api/auth/me
 *   - Get current authenticated user (requires Bearer JWT)
 *   - Returns: { userId, userType, name, email }
 *
 * POST /api/auth/logout
 *   - Logout (stateless, frontend deletes token, backend for audit)
 *   - Returns: { success: true }
 */

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

export async function getMe() {
  return apiFetch<AuthResponse>(`${API_BASE}/auth/me`, {
    method: "GET",
  });
}

export function logout() {
  // Frontend-only: just clear session
  localStorage.removeItem("skillsmatch_token");
  localStorage.removeItem("skillsmatch_userType");
  localStorage.removeItem("skillsmatch_userId");
}

export async function logoutApi() {
  // Call backend logout endpoint for completeness (stateless, but for audit/logging)
  return apiFetch<{ success: boolean }>(`${API_BASE}/auth/logout`, {
    method: "POST",
  });
}
