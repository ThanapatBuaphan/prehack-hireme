import { useMemo, useState } from "react";
import JobCard, { type JobPosting } from "../components/jobCard";
import JobDetail from "../components/jobDetail";
import { useDrawer } from "../../../context/DrawerContext";
// import SearchBar from "../components/searchBar";

const initialJobs: JobPosting[] = [
  {
    id: 1,
    company: "A Co.,Ltd.",
    title: "Manager",
    location: "Bangkok, Thailand",
    employmentType: "Full Time",
    postedLabel: "2 days ago",
    description: "Lead product delivery with a practical, hands-on team.",
    requirements: ["team leadership", "roadmap planning", "clear communication"],
    salary: "30000 - 45000 THB/Month",
    accentClassName: "bg-[#eadf2d]",
    keywordText: "operations product planning people",
  },
  {
    id: 2,
    company: "B Co.,Ltd.",
    title: "Software Engineer",
    location: "Bangkok, Thailand",
    employmentType: "Part Time",
    postedLabel: "3 days ago",
    description: "Build simple job seeker features with React and TypeScript.",
    requirements: ["React", "TypeScript", "REST API basics"],
    salary: "18000 - 26000 THB/Month",
    accentClassName: "bg-[#4f874f]",
    keywordText: "frontend web react typescript javascript",
  },
  {
    id: 3,
    company: "C Co.,Ltd.",
    title: "CEO Assistant",
    location: "Bangkok, Thailand",
    employmentType: "Full Time",
    postedLabel: "4 days ago",
    description: "Support leadership with research, schedules, and reporting.",
    requirements: ["research", "documents", "organization"],
    salary: "24000 - 32000 THB/Month",
    accentClassName: "bg-[#d96565]",
    keywordText: "assistant business admin reports",
  },
  {
    id: 4,
    company: "DataLink",
    title: "Data Analyst",
    location: "Nonthaburi, Thailand",
    employmentType: "Hybrid",
    postedLabel: "5 days ago",
    description: "Turn hiring and business data into clear dashboards.",
    requirements: ["SQL", "spreadsheets", "dashboard storytelling"],
    salary: "26000 - 38000 THB/Month",
    accentClassName: "bg-[#467bb8]",
    keywordText: "analytics sql dashboards data reporting",
  },
  {
    id: 5,
    company: "AppWorks",
    title: "Mobile Developer",
    location: "Chiang Mai, Thailand",
    employmentType: "Remote",
    postedLabel: "6 days ago",
    description: "Build cross-platform mobile applications.",
    requirements: ["Flutter", "Firebase", "UI Design"],
    salary: "25000 - 40000 THB/Month",
    accentClassName: "bg-[#9b59b6]",
    keywordText: "mobile flutter firebase ui",
  },
  {
    id: 6,
    company: "BugLess",
    title: "QA Tester",
    location: "Pathum Thani, Thailand",
    employmentType: "Hybrid",
    postedLabel: "1 week ago",
    description: "Test application flows and report bugs.",
    requirements: ["Testing", "Bug Reports", "Attention to Detail"],
    salary: "18000 - 26000 THB/Month",
    accentClassName: "bg-[#16a085]",
    keywordText: "qa testing bugs reports",
  },
  {
    id: 7,
    company: "CloudSync",
    title: "DevOps Engineer",
    location: "Bangkok, Thailand",
    employmentType: "Full Time",
    postedLabel: "1 week ago",
    description: "Manage CI/CD and cloud deployment pipelines.",
    requirements: ["Docker", "AWS", "Linux"],
    salary: "35000 - 55000 THB/Month",
    accentClassName: "bg-[#34495e]",
    keywordText: "devops docker aws cloud",
  },
  {
    id: 8,
    company: "Pixel Studio",
    title: "UI Designer",
    location: "Khon Kaen, Thailand",
    employmentType: "Part Time",
    postedLabel: "8 days ago",
    description: "Design modern interfaces for recruitment apps.",
    requirements: ["Figma", "Typography", "Wireframes"],
    salary: "20000 - 30000 THB/Month",
    accentClassName: "bg-[#e67e22]",
    keywordText: "ui ux figma design",
  },
];

function matchesSearch(job: JobPosting, query: string) {
  const searchText = [
    job.title,
    job.company,
    job.location,
    job.employmentType,
    job.description,
    job.keywordText,
    ...job.requirements,
  ]
    .join(" ")
    .toLowerCase();

  return searchText.includes(query.trim().toLowerCase());
}

export default function JobHomePage() {
  const { setOpen } = useDrawer();
  const searchValue = "";
  const [jobs, setJobs] = useState(initialJobs);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(
    initialJobs[0]?.id ?? null
  );

  const visibleJobs = useMemo(
    () => jobs.filter((job) => matchesSearch(job, searchValue)),
    [jobs, searchValue],
  );

  const selectedJob =
    visibleJobs.find((job) => job.id === selectedJobId) ?? null;

  function applyJob(jobId: number) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId
          ? { ...job, applied: true }
          : job
      )
    );
  }

  return (
    <main className="h-screen min-w-0 overflow-hidden bg-white">
      <section className="mx-auto flex h-full w-full max-w-[1100px] min-w-0 flex-col px-3 py-4 sm:px-6 lg:px-9 lg:py-7">
        <div className="mb-4 flex items-center gap-4 border-b border-[#eeeeee] bg-white px-3 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-2xl"
          >
            ☰
          </button>

          <h1 className="font-serif text-base font-semibold text-black">
            Job Home
          </h1>
        </div>

        {/* <div className="w-full max-w-[552px]">
          <SearchBar value={searchValue} onChange={setSearchValue} />
        </div> */}

        <div className="mt-7 grid min-h-0 flex-1 min-w-0 gap-6 lg:grid-cols-[minmax(320px,380px)_minmax(360px,1fr)] lg:gap-10">
          <section className="flex min-h-0 min-w-0 flex-col">
            <h1 className="shrink-0 px-2 pb-2 text-[21px] font-semibold text-black">
              All Job Postings
            </h1>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-6 pr-1">
              {visibleJobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;

                return (
                  <div key={job.id} className="min-w-0 space-y-2">
                    <JobCard
                      job={job}
                      isSelected={isSelected}
                      onSelect={() =>
                        setSelectedJobId((currentId) =>
                          currentId === job.id ? null : job.id
                        )
                      }
                    />

                    {isSelected && (
                      <JobDetail
                        job={job}
                        compact
                        className="lg:hidden"
                        onApply={() => applyJob(job.id)}
                      />
                    )}
                  </div>
                );
              })}

              {visibleJobs.length === 0 && (
                <p className="rounded-md border border-[#e6e6e6] bg-[#fbfbfb] px-4 py-6 text-sm text-[#777777]">
                  No jobs match that search.
                </p>
              )}
            </div>
          </section>

          <JobDetail
            job={selectedJob}
            className="hidden min-h-0 lg:flex"
            onApply={() => {
              if (selectedJob) {
                applyJob(selectedJob.id);
              }
            }}
          />
        </div>
      </section>
    </main>
  );
}
