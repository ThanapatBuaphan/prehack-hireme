import Location from "../../../icons/Location.png";
import { CompanyMark, type JobPosting } from "./jobCard";

type JobDetailProps = {
  job: JobPosting | null;
  compact?: boolean;
  className?: string;
  isApplying?: boolean;
  applyError?: string | null;
  onApply?: () => void;
};

export default function JobDetail({
  job,
  compact = false,
  className = "",
  isApplying = false,
  applyError,
  onApply,
}: JobDetailProps) {
  if (!job) {
    return (
      <section
        className={`flex min-h-[360px] min-w-0 items-center justify-center border border-[#ececec] bg-white px-6 py-8 text-sm text-[#7c7c7c] shadow-[0_2px_2px_rgba(15,23,42,0.16)] ${className}`}
      >
        No matching job postings.
      </section>
    );
  }

  return (
    <section
      className={`flex min-w-0 flex-col bg-white shadow-[0_2px_2px_rgba(15,23,42,0.16)] ${compact
        ? "rounded-lg border border-[#e8e8e8] px-4 py-4"
        : "min-h-[520px] border-l border-[#e8e8e8] px-4 py-2 sm:px-5 lg:px-3"
        } ${className}`}
    >
      <h2 className="pb-6 text-[21px] font-semibold text-black">Job Details</h2>

      <div className="flex min-w-0 items-start gap-4">
        <CompanyMark job={job} />
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-black">{job.company}</p>
          <p className="truncate text-[21px] font-medium leading-8 text-black">
            {job.title}
          </p>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-[#969696]">
            <img src={Location} alt="" className="h-4 w-4 object-contain" />
            <span className="truncate">
              {job.location} * {job.employmentType}
            </span>
          </p>
        </div>
      </div>

      <p className="pb-7 pt-7 text-sm text-[#969696]">
        Posted {job.postedLabel}.
      </p>

      <div className="space-y-9 text-[15px]">
        <div>
          <h3 className="font-semibold text-black">Job Description</h3>
          <p className="pt-2 text-black">{job.description}</p>
        </div>

        <div>
          <h3 className="font-semibold text-black">Requirements</h3>
          <ul className="pt-1 text-[#969696]">
            {job.requirements.map((requirement) => (
              <li key={requirement}>* {requirement}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-black">Salary</h3>
          <p className="text-[#969696]">{job.salary}</p>
        </div>
      </div>

      <button
        type="button"
        disabled={job.applied || isApplying}
        onClick={onApply}
        className={`${compact ? "mt-7" : "mt-auto"} h-9 w-full rounded-md text-sm font-semibold text-white transition ${job.applied
            ? "cursor-not-allowed bg-[#9c9c9c]"
            : "bg-[#6d35d3] hover:bg-[#5b29bc]"
          }`}
      >
        {job.applied ? "Applied" : isApplying ? "Applying..." : "Apply"}
      </button>

      {applyError && (
        <p className="pt-2 text-sm text-[#b42318]">{applyError}</p>
      )}
    </section>
  );
}
