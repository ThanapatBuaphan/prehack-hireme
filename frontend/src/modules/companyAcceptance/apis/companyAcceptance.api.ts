import api from "../../../services/api";

export type ApplyStatusValue = "accepted" | "rejected";

export type IncomingApplicantApply = {
  id: number;
  status: string;
  message: string;
  userapply: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string | null;
    avatar?: string | null;
    resume?: string | null;
    educations?: Array<{
      schoolName: string;
      grade: string;
      major?: string | null;
    }>;
    workexperinces?: Array<{
      companyName: string;
      role: string;
    }>;
  };
};

export async function getIncomingApplicants(companyId: number) {
  try {
    const response = await api.get<{
      data: IncomingApplicantApply[];
    }>(`/company-acceptance/company/${companyId}`);

    if (!Array.isArray(response.data?.data)) {
      throw new Error("Applicants response.data.data is not an array.");
    }

    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function updateApplyStatus(
  applyId: number,
  status: ApplyStatusValue,
) {
  return api.patch(`/company-acceptance/${applyId}/status`, { status });
}
