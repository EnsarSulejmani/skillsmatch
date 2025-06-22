import { apiFetch } from "./httpClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7091/api";

export async function getSkills(): Promise<string[]> {
  return apiFetch<string[]>(`${API_BASE}/skills`);
}

export async function getLocations(): Promise<string[]> {
  return apiFetch<string[]>(`${API_BASE}/locations`);
}
