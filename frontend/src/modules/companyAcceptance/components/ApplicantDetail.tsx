import BackArrow from "../../../icons/Back arrow.png";
import MenuBar from "../../../icons/Menu-bar.png";
import {
  ApplicantAvatar,
  getStatusClasses,
  type Applicant,
  type ApplicantStatus,
} from "./ApplicantCard";

type ApplicantDetailProps = {
  applicant: Applicant | null;
  isDetailOpen: boolean;
  isFinalStatus: boolean;
  loading: boolean;
  updatingStatus: boolean;
  onBack: () => void;
  onUpdateStatus: (status: Extract<ApplicantStatus, "Accepted" | "Rejected">) => void;
};

function getResumeFileName(url: string | null) {
  if (!url) return "No resume uploaded";

  return url.split("/").pop() ?? "Resume file";
}

export default function ApplicantDetail({
  applicant,
  isDetailOpen,
  isFinalStatus,
  loading,
  updatingStatus,
  onBack,
  onUpdateStatus,
}: ApplicantDetailProps) {
  return (
    <aside
      className={`h-full min-h-[calc(100dvh-3rem)] min-w-0 flex-col border border-[#edf0f4] px-3 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.16)] sm:min-h-[calc(100dvh-4.5rem)] sm:px-5 sm:py-4 lg:flex lg:min-h-0 ${isDetailOpen ? "flex" : "hidden"
        }`}
    >
      <div className="grid grid-cols-[36px_1fr_36px] items-center pb-3 sm:pb-4 lg:block">
        <img
          src={MenuBar}
          alt="Menu"
          className="h-7 w-7 object-contain lg:hidden"
        />
        <h2 className="text-center font-serif text-[17px] font-semibold text-black lg:text-left">
          Applicant Detail
        </h2>
        <button
          type="button"
          aria-label="Back to applicants"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center justify-self-end rounded-md transition hover:bg-[#f8faff] lg:hidden"
        >
          <img
            src={BackArrow}
            alt=""
            aria-hidden="true"
            className="h-7 w-7 object-contain"
          />
        </button>
      </div>

      {applicant ? (
        <>
          <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
            <div className="flex min-w-0 flex-wrap items-start gap-3 sm:gap-4">
              <ApplicantAvatar
                avatarUrl={applicant.avatarUrl}
                alt={applicant.name}
                large
              />

              <div className="min-w-0 pt-1">
                <p className="text-sm font-medium text-black">{applicant.name}</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                    applicant.status,
                  )}`}
                >
                  {applicant.status}
                </span>
                <p className="mt-1 break-all text-sm leading-4 text-[#9a9a9a]">
                  {applicant.email}
                </p>
                <p className="text-sm leading-4 text-[#9a9a9a]">
                  {applicant.phone}
                </p>
              </div>
            </div>

            <dl className="min-w-0 space-y-4 text-sm sm:space-y-5">
              <div>
                <dt className="font-medium text-black">Education</dt>
                <dd className="max-w-sm leading-4 text-[#9a9a9a]">
                  {applicant.education}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-black">Work Experience</dt>
                <dd className="max-w-sm leading-4 text-[#9a9a9a]">
                  {applicant.workExperience}
                </dd>
              </div>

              <div className="grid min-w-0 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <dt className="font-medium text-black">Resume</dt>
                  <dd className="truncate text-[#9a9a9a]">
                    {applicant.resume
                      ? getResumeFileName(applicant.resume)
                      : "No resume uploaded"}
                  </dd>
                </div>

                <a
                  href={applicant.resume ?? "#"}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-8 w-full items-center justify-center rounded-md border border-[#1684dd] px-3 text-sm font-semibold text-[#006caf] transition sm:w-auto ${applicant.resume
                    ? "hover:bg-[#eef8ff]"
                    : "pointer-events-none cursor-not-allowed opacity-50"
                    }`}
                >
                  Download
                </a>
              </div>
            </dl>
          </div>

          <div className="mt-auto grid gap-2.5 border-t border-[#f1f3f6] pt-4 sm:grid-cols-2 sm:gap-4 sm:pt-5 lg:mt-auto">
            <button
              type="button"
              onClick={() => onUpdateStatus("Accepted")}
              disabled={isFinalStatus || updatingStatus}
              className={`rounded-md px-4 py-2 font-medium text-white transition-all ${isFinalStatus || updatingStatus
                ? "cursor-not-allowed bg-green-300"
                : "bg-green-500 hover:bg-green-600"
                }`}
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onUpdateStatus("Rejected")}
              disabled={isFinalStatus || updatingStatus}
              className={`rounded-md px-4 py-2 font-medium text-white transition-all ${isFinalStatus || updatingStatus
                ? "cursor-not-allowed bg-red-300"
                : "bg-red-500 hover:bg-red-600"
                }`}
            >
              Reject
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center border border-dashed border-[#e5e7eb] bg-[#fbfcff] px-5 py-10 text-sm text-[#6b7280]">
          {loading
            ? "Loading applicant detail..."
            : "Select an applicant to view details."}
        </div>
      )}
    </aside>
  );
}
