import api from "./api";
import type { UserProfile } from "../context/ProfileContext";

// Types

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  avatar?: File;
  resume?: File;
}

export interface UpdateCompanyPayload {
  companyName?: string;
  type?: string;
  phoneNumber?: string;
  description?: string;
  logo?: File;
}

export interface LocationPayload {
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface AddEducationPayload {
  schoolName: string;
  grade: string;
  major?: string;
  joinedAt: string;
  endedAt: string;
}

export interface AddWorkPayload {
  companyName: string;
  role: string;
  workinghere?: boolean;
  joinedAt: string;
  endedAt?: string;
}

// Service

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const role = localStorage.getItem("role");

    if (role === "company") {
      const { data } = await api.get("/api/company/profile");
      const c = data.company;
      return {
        accountId: c.accountId ?? 0,
        email: c.email,
        role: "company",
        companyId: c.id,
        companyName: c.companyName,
        logo: c.logo,
        type: c.type,
        description: c.description,
        phoneNumber: c.phoneNumber,
      };
    } else {
      const [profileRes, accountRes] = await Promise.all([
        api.get("/api/user/profile"),
        api.get("/api/user/account"),
      ]);
      const u = profileRes.data.user;
      return {
        accountId: u.accountId ?? 0,
        email: accountRes.data.email ?? "",
        role: "user",
        userId: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        gender: u.gender,
        avatar: u.avatar,
        resume: u.resume,
        phoneNumber: u.phoneNumber,
        bio: u.bio,
      };
    }
  },

  // User
  async updateUserProfile(payload: UpdateUserPayload) {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined) form.append(k, v instanceof File ? v : String(v));
    });
    const { data } = await api.patch("/api/user/profile", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.user;
  },

  async upsertUserLocation(payload: LocationPayload) {
    const { data } = await api.post("/api/user/profile/location", payload);
    return data;
  },

  async addEducation(payload: AddEducationPayload) {
    const { data } = await api.post("/api/user/profile/education", payload);
    return data;
  },

  async deleteEducation(id: number) {
    const { data } = await api.delete(`/api/user/profile/education/${id}`);
    return data;
  },

  async addWorkExperience(payload: AddWorkPayload) {
    const { data } = await api.post("/api/user/profile/work-experience", payload);
    return data;
  },

  async deleteWorkExperience(id: number) {
    const { data } = await api.delete(`/api/user/profile/work-experience/${id}`);
    return data;
  },

  // Company
  async updateCompanyProfile(payload: UpdateCompanyPayload) {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined) form.append(k, v instanceof File ? v : String(v));
    });
    const { data } = await api.patch("/api/company/profile", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.company;
  },

  async upsertCompanyLocation(payload: LocationPayload) {
    const { data } = await api.post("/api/company/profile/location", payload);
    return data;
  },
};