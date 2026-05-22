import api from "../../../services/api";
import type { UserProfile, CompanyProfile } from "../types/profile.types";

// User
export const getUserProfile = () =>
  api.get<{ user: UserProfile }>("/api/user/profile").then((r) => r.data.user);

export const updateUserProfile = (formData: FormData) =>
  api.patch<{ user: UserProfile }>("/api/user/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data.user);

export const upsertUserLocation = (data: {
  name?: string; address?: string; city?: string; country?: string; postalCode?: string;
}) => api.post("/api/user/profile/location", data).then((r) => r.data);

export const addEducation = (data: {
  schoolName: string; grade: string; major?: string; joinedAt: string; endedAt: string;
}) => api.post("/api/user/profile/education", data).then((r) => r.data);

export const updateEducation = (id: number, data: Partial<{
  schoolName: string; grade: string; major: string; joinedAt: string; endedAt: string;
}>) => api.patch(`/api/user/profile/education/${id}`, data).then((r) => r.data);

export const deleteEducation = (id: number) =>
  api.delete(`/api/user/profile/education/${id}`).then((r) => r.data);

export const addWorkExperience = (data: {
  companyName: string; role: string; workinghere?: boolean; joinedAt: string; endedAt?: string;
}) => api.post("/api/user/profile/work-experience", data).then((r) => r.data);

export const updateWorkExperience = (id: number, data: Partial<{
  companyName: string; role: string; workinghere: boolean; joinedAt: string; endedAt: string | null;
}>) => api.patch(`/api/user/profile/work-experience/${id}`, data).then((r) => r.data);

export const deleteWorkExperience = (id: number) =>
  api.delete(`/api/user/profile/work-experience/${id}`).then((r) => r.data);

// Company
export const getCompanyProfile = () =>
  api.get<{ company: CompanyProfile }>("/api/company/profile").then((r) => r.data.company);

export const updateCompanyProfile = (formData: FormData) =>
  api.patch<{ company: CompanyProfile }>("/api/company/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data.company);

export const upsertCompanyLocation = (data: {
  name?: string; address?: string; city?: string; country?: string; postalCode?: string;
}) => api.post("/api/company/profile/location", data).then((r) => r.data);
