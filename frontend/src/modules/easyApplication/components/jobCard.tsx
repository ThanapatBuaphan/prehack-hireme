import Location from "../../../icons/Location.png";

export type JobPosting = {
  id: number;
  companyId: number;
  company: string;
  companyLogo?: string | null;
  title: string;
  location: string;
  employmentType: string;
  postedLabel: string;
  description: string;
  requirements: string[];
  salary: string;
  accentClassName: string;
  keywordText: string;
  applied?: boolean;
};

type JobCardProps = {
  job: JobPosting;
  isSelected: boolean;
  onSelect: () => void;
};

function CompanyMark({ job }: { job: JobPosting }) {
  if (job.companyLogo) {
    return (
      <img
        src={job.companyLogo}
        alt={`${job.company} logo`}
        className="h-[62px] w-[62px] shrink-0 rounded-md object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-md text-2xl font-bold text-white ${job.accentClassName}`}
    >
      {job.company.charAt(0)}
    </span>
  );
}

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full min-w-0 gap-4 rounded-lg border bg-white p-3 text-left transition sm:p-4 ${isSelected
          ? "border-[#9a70eb] shadow-[0_5px_16px_rgba(82,54,135,0.16)] ring-1 ring-[#eadfff]"
          : "border-[#d5d5d5] hover:border-[#b89ae9] hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)]"
        }`}
    >
      <CompanyMark job={job} />

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-black">
          {job.company}
        </span>
        <span className="truncate text-[20px] font-medium leading-7 text-black">
          {job.title}
        </span>
        <span className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-[#969696]">
          <img src={Location} alt="" className="h-4 w-4 object-contain" />
          <span className="truncate">
            {job.location} * {job.employmentType}
          </span>
        </span>
        <span className="mt-auto pt-5 text-sm text-[#969696]">
          Posted {job.postedLabel}.
        </span>
      </span>
    </button>
  );
}

export { CompanyMark };
