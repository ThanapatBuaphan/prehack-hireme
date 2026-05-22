import Bin from "../../../icons/Bin.png";

export type JobApplication = {
  id: number;
  jobTitle: string;
  company: string;
  status: "Pending" | "Accepted" | "Rejected";
  postedDate: string;
};

type ApplicationCardProps = {
  application: JobApplication;
  isDeleting?: boolean;
  onDelete: () => void;
};

function getStatusClassName(status: JobApplication["status"]) {
  if (status === "Rejected") {
    return "bg-[#ffb4b4] text-[#a72929]";
  }

  if (status === "Accepted") {
    return "bg-[#c9f7e7] text-[#137157]";
  }

  return "bg-[#fff0a3] text-[#9d7612]";
}

export default function ApplicationCard({
  application,
  isDeleting = false,
  onDelete,
}: ApplicationCardProps) {
  return (
    <>
      <div className="hidden min-h-[58px] grid-cols-[minmax(180px,1.4fr)_minmax(120px,0.8fr)_100px_118px_68px] items-center gap-3 border-x border-b border-[#ececec] bg-white px-6 text-sm text-black shadow-[0_2px_2px_rgba(15,23,42,0.16)] md:grid">
        <span className="truncate">{application.jobTitle}</span>
        <span className="truncate">{application.company}</span>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(
            application.status,
          )}`}
        >
          {application.status}
        </span>
        <span>{application.postedDate}</span>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={`Delete ${application.jobTitle} application`}
          className="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img src={Bin} alt="" className="h-5 w-5 object-contain" />
        </button>
      </div>

      <article className="min-w-0 border border-[#ececec] bg-white p-4 shadow-[0_2px_3px_rgba(15,23,42,0.14)] md:hidden">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-base font-medium text-black">
              {application.jobTitle}
            </h2>
            <p className="truncate pt-1 text-sm text-[#686868]">
              {application.company}
            </p>
          </div>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            aria-label={`Delete ${application.jobTitle} application`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <img src={Bin} alt="" className="h-5 w-5 object-contain" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(
              application.status,
            )}`}
          >
            {application.status}
          </span>
          <span className="text-[#686868]">{application.postedDate}</span>
        </div>
      </article>
    </>
  );
}
