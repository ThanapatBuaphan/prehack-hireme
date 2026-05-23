import { useEffect, useState } from "react";
import { useProfile } from "../../../context/ProfileContext";
import { useDrawer } from "../../../context/DrawerContext";

import {
  getIncomingApplicants,
  updateApplyStatus,
  type ApplyStatusValue,
  type IncomingApplicantApply,
} from "../apis/companyAcceptance.api";
import ApplicantCard, {
  type Applicant,
  type ApplicantStatus,
} from "../components/ApplicantCard";
import ApplicantDetail from "../components/ApplicantDetail";
import MenuBar from "../../../icons/Menu-bar.png";

function formatStatus(status: string): ApplicantStatus {
  if (status.toLowerCase() === "accepted") {
    return "Accepted";
  }

  if (status.toLowerCase() === "rejected") {
    return "Rejected";
  }

  return "Pending";
}

function formatApplicant(apply: IncomingApplicantApply): Applicant {
  const applicant = apply.userapply;
  const education = applicant.educations?.[0];
  const workExperience = applicant.workexperinces?.[0];
  const fullName = `${applicant.firstName} ${applicant.lastName}`.trim();

  return {
    id: apply.id,
    name: fullName || "Unnamed applicant",
    email: applicant.email ?? "Email not provided",
    phone: applicant.phoneNumber ?? "Phone not provided",
    avatarUrl: applicant.avatar ?? null,
    education: education
      ? [education.schoolName, education.major, education.grade]
        .filter(Boolean)
        .join(", ")
      : "Education not provided",
    workExperience: workExperience
      ? `${workExperience.role} at ${workExperience.companyName}`
      : "Work experience not provided",
    resume: applicant.resume ?? null,
    status: formatStatus(apply.status),
  };
}

export default function ComApplicants() {
  const { profile } = useProfile();
  const { setOpen } = useDrawer();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const selectedApplicant =
    applicants.find((applicant) => applicant.id === selectedApplicantId) ??
    null;

  const isFinalStatus =
    selectedApplicant?.status === "Accepted" ||
    selectedApplicant?.status === "Rejected";

  useEffect(() => {
    async function fetchApplicants() {
      try {
        setLoading(true);
        setError(null);

        if (!profile?.companyId) {
          throw new Error("A company profile is required to load applicants.");
        }

        const incomingApplicants = await getIncomingApplicants(profile.companyId);

        if (!Array.isArray(incomingApplicants)) {
          throw new Error("getIncomingApplicants did not return an array.");
        }

        const formattedApplicants = incomingApplicants.map(formatApplicant);

        setApplicants(formattedApplicants);
        setSelectedApplicantId(formattedApplicants[0]?.id ?? null);
        setIsDetailOpen(false);
      } catch (error) {
        console.error("Failed to load incoming applicants:", error);
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplicants();
  }, [profile]);

  async function updateSelectedStatus(
    status: ApplicantStatus,
    apiStatus: ApplyStatusValue,
  ) {
    if (!selectedApplicant || isFinalStatus) {
      return;
    }

    setUpdatingStatus(true);
    setError(null);

    try {
      await updateApplyStatus(selectedApplicant.id, apiStatus);
      setApplicants((currentApplicants) =>
        currentApplicants.map((applicant) =>
          applicant.id === selectedApplicant.id
            ? { ...applicant, status }
            : applicant,
        ),
      );
    } catch {
      setError("Failed to update applicant status.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  function handleDetailStatus(status: Extract<ApplicantStatus, "Accepted" | "Rejected">) {
    updateSelectedStatus(
      status,
      status === "Accepted" ? "accepted" : "rejected",
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f7fb] px-2.5 py-3 sm:px-4 sm:py-5 lg:flex lg:h-screen lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-7">
      <section className="mx-auto grid min-h-0 w-full min-w-0 gap-3 border border-[#e5e7eb] bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.18)] sm:gap-5 sm:p-5 lg:h-full lg:grid-cols-[minmax(300px,0.98fr)_minmax(360px,1.02fr)] lg:gap-6 lg:overflow-hidden lg:p-6">
        <div
          className={`h-full min-h-0 min-w-0 flex-col border border-[#edf0f4] px-2.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.16)] sm:min-h-[420px] sm:px-4 sm:py-4 lg:flex lg:min-h-0 ${isDetailOpen ? "hidden" : "flex"
            }`}
        >
          <div className="grid grid-cols-[36px_1fr_36px] items-center pb-3 sm:pb-4 lg:block">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden"
            >
              <img
                src={MenuBar}
                alt="Menu"
                className="h-7 w-7 object-contain"
              />
            </button>
            <h1 className="text-center font-serif text-[17px] font-semibold text-black lg:px-1 lg:text-left">
              Applicants
            </h1>
            <span aria-hidden="true" className="lg:hidden" />
          </div>

          <div className="min-w-0 space-y-2.5 overflow-y-auto pr-0.5 sm:space-y-3.5 sm:pr-1 lg:min-h-0 lg:flex-1">
            {loading && (
              <p className="border border-[#ededed] bg-[#fbfcff] px-4 py-5 text-sm text-[#6b7280]">
                Loading applicants...
              </p>
            )}

            {!loading && error && (
              <p className="border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-700">
                {error}
              </p>
            )}

            {!loading && !error && applicants.length === 0 && (
              <p className="border border-[#ededed] bg-[#fbfcff] px-4 py-5 text-sm text-[#6b7280]">
                No applicants yet.
              </p>
            )}

            {!loading &&
              !error &&
              applicants.map((applicant) => {
                const isSelected = applicant.id === selectedApplicantId;

                return (
                  <ApplicantCard
                    key={applicant.id}
                    applicant={applicant}
                    isSelected={isSelected}
                    onSelect={() => {
                      setSelectedApplicantId(applicant.id);
                      setIsDetailOpen(true);
                    }}
                  />
                );
              })}
          </div>
        </div>

        <ApplicantDetail
          applicant={selectedApplicant}
          isDetailOpen={isDetailOpen}
          isFinalStatus={isFinalStatus}
          loading={loading}
          updatingStatus={updatingStatus}
          onBack={() => setIsDetailOpen(false)}
          onUpdateStatus={handleDetailStatus}
        />
      </section>
    </main>
  );
}
