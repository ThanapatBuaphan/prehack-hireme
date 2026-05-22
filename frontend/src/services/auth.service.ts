import api from "./api";

export interface AuthResponse {
  token: string;
  role: "user" | "company";
  profileId: number;
  email: string;
}

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    const { token, role, profileId, email: userEmail } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("profileId", String(profileId));
    localStorage.setItem("email", userEmail);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profileId");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
  },

  isLoggedIn: () => !!localStorage.getItem("token"),
  getRole: () => localStorage.getItem("role") as "user" | "company" | null,
  getEmail: () => localStorage.getItem("email") ?? "",
  getStoredUser: () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },
};