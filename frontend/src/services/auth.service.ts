import api from "./api";
import type { UserProfile } from "../context/ProfileContext";

export interface AuthResponse {
  token: string;
  role: "user" | "company";
  profileId: number;
  email: string;
}

// ── User Register ──
export interface UserRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phoneNumber: string;
}

export async function registerUser(payload: UserRegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register/user", payload);
  authService.saveAuth(data);
  return data;
}

// ── Company Register ──
export interface CompanyRegisterPayload {
  email: string;
  password: string;
  companyName: string;
}

export async function registerCompany(payload: CompanyRegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register/company", payload);
  authService.saveAuth(data);
  return data;
}

// ── Login ──
export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  authService.saveAuth(data);
  return data;
}

// ── authService object (used by ProfileContext) ──
export const authService = {
  saveAuth(data: AuthResponse) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("profileId", String(data.profileId));
    localStorage.setItem("email", data.email);
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profileId");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  },

  getStoredUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  },

  getRole(): "user" | "company" | null {
    return localStorage.getItem("role") as "user" | "company" | null;
  },
};
