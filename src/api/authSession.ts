import { AuthResponse } from "./auth";

const TOKEN_KEY = "skillsmatch_token";
const USER_TYPE_KEY = "skillsmatch_userType";
const USER_ID_KEY = "skillsmatch_userId";

export function saveAuthSession(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USER_TYPE_KEY, auth.userType);
  localStorage.setItem(USER_ID_KEY, auth.userId);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function getAuthToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

export function getUserType(): "student" | "business" | null {
  return typeof window !== "undefined"
    ? (localStorage.getItem(USER_TYPE_KEY) as any)
    : null;
}

export function getUserId(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem(USER_ID_KEY)
    : null;
}

export function isLoggedIn(): boolean {
  return !!getAuthToken();
}
