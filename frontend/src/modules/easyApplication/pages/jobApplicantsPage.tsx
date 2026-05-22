import { useState } from "react";
import ApplicationCard, {
  type JobApplication,
} from "../components/applicationCard";
import { useDrawer } from "../../../context/DrawerContext";

const mockApplications: JobApplication[] = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: "TechCorp",
    status: "Pending",
    postedDate: "20 May 2026",
  },
  {
    id: 2,
    jobTitle: "Backend Developer",
    company: "Bigbluk Co.",
    status: "Accepted",
    postedDate: "17 May 2026",
  },
  {
    id: 3,
    jobTitle: "Data Analysis",
    company: "DataLink",
    status: "Rejected",
    postedDate: "15 May 2026",
  },
  {
    id: 4,
    jobTitle: "Full Stack Developer",
    company: "BioTech",
    status: "Accepted",
    postedDate: "10 May 2026",
  },
  {
    id: 5,
    jobTitle: "UX/UI Design",
    company: "Eletric Arts Co. LTD",
    status: "Pending",
    postedDate: "9 May 2026",
  },
  {
    id: 6,
    jobTitle: "Mobile Developer",
    company: "AppWorks",
    status: "Pending",
    postedDate: "7 May 2026",
  },
  {
    id: 7,
    jobTitle: "QA Tester",
    company: "BugLess",
    status: "Accepted",
    postedDate: "5 May 2026",
  },
  {
    id: 8,
    jobTitle: "UI Designer",
    company: "CreativeHub",
    status: "Rejected",
    postedDate: "3 May 2026",
  },
  {
    id: 9,
    jobTitle: "DevOps Intern",
    company: "CloudNine",
    status: "Pending",
    postedDate: "1 May 2026",
  },
];

export default function JobApplicantsPage() {
  const { setOpen } = useDrawer();
  const [applications, setApplications] = useState(mockApplications);

  function deleteApplication(applicationId: number) {
    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== applicationId),
    );
  }

  return (
    <main className="h-screen min-w-0 overflow-hidden bg-white">
      <section className="mx-auto flex h-full w-full max-w-[980px] min-w-0 flex-col px-3 py-4 sm:px-6 md:py-5 lg:px-9 lg:py-7">
        <div className="mb-4 flex items-center gap-4 border-b border-[#eeeeee] bg-white px-3 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-2xl"
          >
            ☰
          </button>

          <h1 className="font-serif text-base font-semibold text-black">
            My Applications
          </h1>
        </div>

        <h1 className="mb-6 hidden font-serif text-base font-semibold text-black md:block">
          My Applications
        </h1>

        <div className="hidden min-h-[42px] grid-cols-[minmax(180px,1.4fr)_minmax(120px,0.8fr)_100px_118px_68px] items-center gap-3 border-x border-b border-[#ececec] bg-white px-6 text-sm text-[#8d8d8d] shadow-[0_2px_2px_rgba(15,23,42,0.16)] md:grid">
          <span>Job Title</span>
          <span>Company</span>
          <span>Status</span>
          <span>Posted Date</span>
          <span>Action</span>
        </div>

        <div className="min-h-0 flex-1 min-w-0 space-y-3 overflow-y-auto pb-6 md:space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onDelete={() => deleteApplication(application.id)}
            />
          ))}

          {applications.length === 0 && (
            <p className="border border-[#ececec] bg-[#fbfbfb] px-5 py-8 text-sm text-[#777777]">
              No applications to show.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
