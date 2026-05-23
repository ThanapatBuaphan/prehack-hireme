import axios from "axios";
import api from "../../../services/api";
import type { JobPosting } from "../components/jobCard";

export type ApplyStatus = "pending" | "accepted" | "rejected";

export type IncomingApplication = {
  id: number;
  message: string;
  status: ApplyStatus | string;
  createdAt: string;
  userId: number;
  companyId: number;
  postId: number | null;
  companyhire?: {
    id: number;
    companyName: string;
    logo?: string | null;
    email: string;
  } | null;
  post?: {
    id: number;
    jobtitle: string;
    location: string;
    requirements: string;
    Salary: number;
    description?: string | null;
    createdAt: string;
    companyId: number;
  } | null;
};

type ApplicationsResponse = {
  data: IncomingApplication[];
};

type AvailableJobPost = {
  id: number;
  companyId: number;
  companyName?: string | null;
  companyLogo?: string | null;
  logo?: string | null;
  jobtitle: string;
  location: string;
  requirements?: string | null;
  Salary: number;
  description?: string | null;
  createdAt: string;
};

type AvailableJobPostsResponse = {
  data: AvailableJobPost[];
};

export type CreateApplyPayload = {
  userId: number;
  companyId: number;
  postId: number;
  message: string;
};

export function getEasyApplicationErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (!axios.isAxiosError<{ message?: string }>(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  const details = {
    status: error.response?.status,
    message: error.response?.data?.message,
    response: error.response?.data,
  };

  console.error("Easy Application API error:", details);

  return details.message || fallbackMessage;
}

export async function getJobSeekerApplications(userId: number) {
  try {
    const response = await api.get<ApplicationsResponse>(`/applies/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed GET /applies/user request:", { userId, error });
    throw error;
  }
}

export async function createJobApplication(payload: CreateApplyPayload) {
  try {
    const response = await api.post("/applies", payload);
    return response.data;
  } catch (error) {
    console.error("Failed POST /applies request:", { payload, error });
    throw error;
  }
}

export async function deleteJobApplication(applyId: number) {
  try {
    const response = await api.delete(`/applies/${applyId}`);
    return response.data;
  } catch (error) {
    console.error("Failed DELETE /applies request:", { applyId, error });
    throw error;
  }
}

function formatPostedLabel(createdAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt));
}

function formatRequirements(requirements?: string | null) {
  if (!requirements?.trim()) {
    return ["Requirements not provided"];
  }

  return requirements
    .split(/\r?\n|,/)
    .map((requirement) => requirement.trim())
    .filter(Boolean);
}

function formatAvailableJobPost(post: AvailableJobPost): JobPosting {
  const company = post.companyName?.trim() || "Company";
  const requirements = formatRequirements(post.requirements);

  return {
    id: post.id,
    companyId: post.companyId,
    company,
    companyLogo: post.companyLogo ?? post.logo ?? null,
    title: post.jobtitle || "Untitled job",
    location: post.location || "Location not provided",
    employmentType: "Job post",
    postedLabel: formatPostedLabel(post.createdAt),
    description: post.description?.trim() || "Description not provided.",
    requirements,
    salary: `${post.Salary.toLocaleString()} THB`,
    accentClassName: "bg-[#6d35d3]",
    keywordText: [
      company,
      post.jobtitle,
      post.location,
      post.description,
      ...requirements,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export async function getAvailableJobPosts(): Promise<JobPosting[]> {
  const response = await api.get<AvailableJobPostsResponse>("/posts");
  return response.data.data.map(formatAvailableJobPost);
}
