import { apiFetch } from "./httpClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7091/api";

export interface Business {
  businessId: string;
  name: string;
  email: string;
  reviews: number;
  bio: string;
  jobsPosted: string[];
  location: string;
  skills: string[];
  verified: boolean;
  industry: string;
  profileImageUrl: string; // <-- add this field
}

export async function getAllBusinesses() {
  return apiFetch<Business[]>(`${API_BASE}/businesses`);
}

export async function getBusinessById(id: string) {
  return apiFetch<Business>(`${API_BASE}/businesses/${id}`);
}

export async function createBusiness(business: Partial<Business>) {
  return apiFetch<Business>(`${API_BASE}/businesses`, {
    method: "POST",
    body: JSON.stringify(business),
  });
}

export async function updateBusiness(id: string, business: Partial<Business>) {
  return apiFetch<Business>(`${API_BASE}/businesses/${id}`, {
    method: "PUT",
    body: JSON.stringify(business),
  });
}

export async function deleteBusiness(id: string) {
  return apiFetch<void>(`${API_BASE}/businesses/${id}`, {
    method: "DELETE",
  });
}
