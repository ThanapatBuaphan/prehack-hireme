export type ApplicantStatus = "Pending" | "Accepted" | "Rejected";

export type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  education: string;
  workExperience: string;
  status: ApplicantStatus;
  resume?: string | null;
};

export function getStatusClasses(status: ApplicantStatus) {
  if (status === "Rejected") {
    return "bg-red-100 text-red-700";
  }

  if (status === "Pending") {
    return "bg-[#fff3a8] text-[#79651c]";
  }

  return "bg-[#c9f7e7] text-[#137157]";
}

type ApplicantAvatarProps = {
  avatarUrl?: string | null;
  alt?: string;
  large?: boolean;
};

export function ApplicantAvatar({
  avatarUrl,
  alt = "",
  large = false,
}: ApplicantAvatarProps) {
  const avatarSize = large
    ? "h-16 w-16 sm:h-[72px] sm:w-[72px]"
    : "h-12 w-12 sm:h-[58px] sm:w-[58px]";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alt}
        className={`shrink-0 border border-[#9aaeff] bg-[#fbfcff] object-cover ${avatarSize}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative shrink-0 border border-[#9aaeff] bg-[#fbfcff] text-[#8da3ff] ${avatarSize}`}
    >
      <span className="absolute left-1/2 top-[10px] h-4 w-4 -translate-x-1/2 rounded-full border border-current bg-[#dfe7ff]" />
      <span
        className={`absolute left-1/2 rounded-t-full border border-current bg-[#dfe7ff] ${large
          ? "bottom-[10px] h-5 w-10 -translate-x-1/2"
          : "bottom-[9px] h-4 w-8 -translate-x-1/2"
          }`}
      />
      <span className="absolute -left-px -top-px h-3 w-3 border-l-0 border-t-0 bg-white" />
      <span className="absolute -right-px -top-px h-3 w-3 border-r-0 border-t-0 bg-white" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b-0 border-l-0 bg-white" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b-0 border-r-0 bg-white" />
    </div>
  );
}

type ApplicantCardProps = {
  applicant: Applicant;
  isSelected: boolean;
  onSelect: () => void;
};

export default function ApplicantCard({
  applicant,
  isSelected,
  onSelect,
}: ApplicantCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`grid w-full min-w-0 grid-cols-[48px_minmax(0,1fr)] items-center gap-2.5 border px-2 py-2 text-left transition hover:border-[#b9c7ff] hover:bg-[#fbfcff] hover:shadow-[0_3px_8px_rgba(15,23,42,0.12)] sm:grid-cols-[58px_minmax(0,1fr)_auto] sm:gap-4 sm:px-3 ${isSelected
        ? "border-[#8da7ff] bg-[#f4f7ff] shadow-[0_4px_12px_rgba(85,113,214,0.18)] ring-1 ring-[#dce5ff]"
        : "border-[#ededed] bg-white shadow-[0_2px_3px_rgba(15,23,42,0.14)]"
        }`}
    >
      <ApplicantAvatar avatarUrl={applicant.avatarUrl} alt={applicant.name} />

      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-black">
          {applicant.name}
        </span>
        <span className="block truncate text-sm text-[#9a9a9a]">
          {applicant.email}
        </span>
      </span>

      <span
        className={`col-start-2 w-fit rounded-full px-2.5 py-1 text-xs font-medium sm:col-start-auto sm:px-3 ${getStatusClasses(
          applicant.status,
        )}`}
      >
        {applicant.status}
      </span>
    </button>
  );
}
