// Simple HTTP client using fetch, with JSON and error handling
import { getAuthToken } from "./authSession";

export async function apiFetch<T>(
  url: string,
  options?: RequestInit & { authToken?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };
  // Always attach token if present in session
  const token = options?.authToken || getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}
