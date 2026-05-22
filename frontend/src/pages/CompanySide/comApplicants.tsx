import { useState } from "react";

type ApplicantStatus = "Pending" | "Applied" | "Accepted" | "Rejected";

type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  education: string;
  workExperience: string;
  resumeFileName: string;
  status: ApplicantStatus;
};

const initialApplicants: Applicant[] = [
  {
    id: 1,
    name: "Johny Depp",
    email: "Johny@gmail.com",
    phone: "0xx-xxx-xxxx",
    education: "King Mongkut's University of Technology Thonburi",
    workExperience: "Bachelor of Computer Science",
    resumeFileName: "Johny_Depp_Resume.pdf",
    status: "Pending",
  },
  {
    id: 2,
    name: "Taylor Swift",
    email: "Taylor@gmail.com",
    phone: "0xx-xxx-xxxx",
    education: "Bangkok Creative Institute",
    workExperience: "Product Design Internship",
    resumeFileName: "Taylor_Swift_Resume.pdf",
    status: "Pending",
  },
  {
    id: 3,
    name: "Mr Beasts",
    email: "Beasts@gmail.com",
    phone: "0xx-xxx-xxxx",
    education: "Chiang Mai Technology College",
    workExperience: "Frontend Developer Trainee",
    resumeFileName: "Mr_Beasts_Resume.pdf",
    status: "Pending",
  },
  {
    id: 4,
    name: "Mr Bean",
    email: "Bean@gmail.com",
    phone: "0xx-xxx-xxxx",
    education: "Digital Business Academy",
    workExperience: "Junior Web Project Assistant",
    resumeFileName: "Mr_Bean_Resume.pdf",
    status: "Pending",
  },
  {
    id: 5,
    name: "John Wick",
    email: "Wick@gmail.com",
    phone: "0xx-xxx-xxxx",
    education: "Eastern Engineering University",
    workExperience: "Software Engineering Cooperative Student",
    resumeFileName: "John_Wick_Resume.pdf",
    status: "Pending",
  },
];

function getStatusClasses(status: ApplicantStatus) {
  if (status === "Rejected") {
    return "bg-red-100 text-red-700";
  }

  if (status === "Pending") {
    return "bg-[#fff3a8] text-[#79651c]";
  }

  return "bg-[#c9f7e7] text-[#137157]";
}

function ApplicantAvatar({ large = false }: { large?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative shrink-0 border border-[#9aaeff] bg-[#fbfcff] text-[#8da3ff] ${large ? "h-[72px] w-[72px]" : "h-[58px] w-[58px]"
        }`}
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

export default function ComApplicants() {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [selectedApplicantId, setSelectedApplicantId] = useState(
    initialApplicants[0].id,
  );

  const selectedApplicant =
    applicants.find((applicant) => applicant.id === selectedApplicantId) ??
    applicants[0];

  const isFinalStatus =
    selectedApplicant?.status === "Accepted" ||
    selectedApplicant?.status === "Rejected";

  function updateSelectedStatus(status: ApplicantStatus) {
    setApplicants((currentApplicants) =>
      currentApplicants.map((applicant) =>
        applicant.id === selectedApplicantId
          ? { ...applicant, status }
          : applicant,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-5 sm:px-5 lg:flex lg:px-8 lg:py-7">
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] w-full gap-5 border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.18)] sm:p-5 lg:grid-cols-[minmax(300px,0.98fr)_minmax(360px,1.02fr)] lg:gap-6 lg:p-6">
        <div className="flex h-full min-h-[500px] flex-col border border-[#edf0f4] px-3 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.16)] sm:px-4">
          <h1 className="px-1 pb-4 font-serif text-[17px] font-semibold text-black">
            Applicants
          </h1>

          <div className="space-y-3.5 overflow-y-auto pr-1">
            {applicants.map((applicant) => {
              const isSelected = applicant.id === selectedApplicantId;

              return (
                <button
                  key={applicant.id}
                  type="button"
                  onClick={() => setSelectedApplicantId(applicant.id)}
                  className={`grid w-full grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-4 border px-3 py-2 text-left transition hover:border-[#b9c7ff] hover:bg-[#fbfcff] hover:shadow-[0_3px_8px_rgba(15,23,42,0.12)] ${isSelected
                    ? "border-[#8da7ff] bg-[#f4f7ff] shadow-[0_4px_12px_rgba(85,113,214,0.18)] ring-1 ring-[#dce5ff]"
                    : "border-[#ededed] bg-white shadow-[0_2px_3px_rgba(15,23,42,0.14)]"
                    }`}
                >
                  <ApplicantAvatar />

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-black">
                      {applicant.name}
                    </span>
                    <span className="block truncate text-sm text-[#9a9a9a]">
                      {applicant.email}
                    </span>
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                      applicant.status,
                    )}`}
                  >
                    {applicant.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="flex h-full min-h-[500px] flex-col border border-[#edf0f4] px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.16)] sm:px-5">
          <h2 className="pb-4 font-serif text-[17px] font-semibold text-black">
            Applicant Detail
          </h2>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start gap-4">
              <ApplicantAvatar large />

              <div className="min-w-0 pt-1">
                <p className="text-sm font-medium text-black">
                  {selectedApplicant.name}
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                    selectedApplicant.status,
                  )}`}
                >
                  {selectedApplicant.status}
                </span>
                <p className="mt-1 break-all text-sm leading-4 text-[#9a9a9a]">
                  {selectedApplicant.email}
                </p>
                <p className="text-sm leading-4 text-[#9a9a9a]">
                  {selectedApplicant.phone}
                </p>
              </div>
            </div>

            <dl className="space-y-5 text-sm">
              <div>
                <dt className="font-medium text-black">Education</dt>
                <dd className="max-w-sm leading-4 text-[#9a9a9a]">
                  {selectedApplicant.education}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-black">Work Experience</dt>
                <dd className="max-w-sm leading-4 text-[#9a9a9a]">
                  {selectedApplicant.workExperience}
                </dd>
              </div>

              <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <dt className="font-medium text-black">Resume</dt>
                  <dd className="truncate text-[#9a9a9a]">
                    {selectedApplicant.resumeFileName}
                  </dd>
                </div>

                <button
                  type="button"
                  className="h-8 rounded-md border border-[#1684dd] px-3 text-sm font-semibold text-[#006caf] transition hover:bg-[#eef8ff]"
                >
                  Download
                </button>
              </div>
            </dl>
          </div>

          <div className="mt-8 grid gap-4 border-t border-[#f1f3f6] pt-5 sm:grid-cols-2 lg:mt-auto">
            <button
              onClick={() => updateSelectedStatus("Accepted")}
              disabled={isFinalStatus}
              className={`rounded-md px-4 py-2 font-medium text-white transition-all ${isFinalStatus
                ? "cursor-not-allowed bg-green-300"
                : "bg-green-500 hover:bg-green-600"
                }`}
            >
              Accept
            </button>
            <button
              onClick={() => updateSelectedStatus("Rejected")}
              disabled={isFinalStatus}
              className={`rounded-md px-4 py-2 font-medium text-white transition-all ${isFinalStatus
                ? "cursor-not-allowed bg-red-300"
                : "bg-red-500 hover:bg-red-600"
                }`}
            >
              Reject
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
