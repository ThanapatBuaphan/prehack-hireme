import { useEffect, useState } from "react";
import ApplicationCard, {
  type JobApplication,
} from "../components/applicationCard";
import { useDrawer } from "../../../context/DrawerContext";
import { useProfile } from "../../../context/ProfileContext";
import MenuBar from "../../../icons/Menu-bar.png";
import {
  deleteJobApplication,
  getEasyApplicationErrorMessage,
  getJobSeekerApplications,
  type IncomingApplication,
} from "../apis/easyApplication.api";

function formatApplicationStatus(
  status: IncomingApplication["status"],
): JobApplication["status"] {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "accepted") {
    return "Accepted";
  }

  if (normalizedStatus === "rejected") {
    return "Rejected";
  }

  return "Pending";
}

function formatPostedDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatApplication(application: IncomingApplication): JobApplication {
  return {
    id: application.id,
    jobTitle: application.post?.jobtitle ?? "Job post unavailable",
    company: application.companyhire?.companyName ?? "Company unavailable",
    status: formatApplicationStatus(application.status),
    postedDate: formatPostedDate(
      application.post?.createdAt ?? application.createdAt,
    ),
  };
}

export default function JobApplicantsPage() {
  const { setOpen } = useDrawer();
  const { profile } = useProfile();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadApplications() {
      if (!profile?.userId) {
        setIsLoading(false);
        setLoadError("A job seeker profile is required to load applications.");
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const incomingApplications = await getJobSeekerApplications(profile.userId);

        if (isMounted) {
          setApplications(incomingApplications.map(formatApplication));
        }
      } catch (error) {
        console.error("Failed to load job seeker applications:", error);

        if (isMounted) {
          setLoadError(
            getEasyApplicationErrorMessage(
              error,
              "Failed to load applications.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadApplications();

    return () => {
      isMounted = false;
    };
  }, [profile?.userId]);

  async function handleDeleteApplication(applicationId: number) {
    setDeleteError(null);
    setDeletingApplicationId(applicationId);

    try {
      await deleteJobApplication(applicationId);

      setApplications((currentApplications) =>
        currentApplications.filter((application) => application.id !== applicationId),
      );
    } catch (error) {
      console.error("Failed to delete job seeker application:", error);
      setDeleteError(
        getEasyApplicationErrorMessage(
          error,
          "Failed to delete application.",
        ),
      );
    } finally {
      setDeletingApplicationId(null);
    }
  }

  return (
    <main className="h-screen min-w-0 overflow-hidden bg-white">
      <section className="mx-auto flex h-full w-full max-w-[980px] min-w-0 flex-col px-3 py-4 sm:px-6 md:py-5 lg:px-9 lg:py-7">
        <div className="mb-4 flex items-center gap-4 border-b border-[#eeeeee] bg-white px-3 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-[#f8f8f8]"
          >
            <img src={MenuBar} alt="" className="h-7 w-7 object-contain" />
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
          {isLoading && (
            <p className="border border-[#ececec] bg-[#fbfbfb] px-5 py-8 text-sm text-[#777777]">
              Loading applications...
            </p>
          )}

          {loadError && (
            <p className="border border-[#f3c5c5] bg-[#fff7f7] px-5 py-8 text-sm text-[#b42318]">
              {loadError}
            </p>
          )}

          {deleteError && (
            <p className="border border-[#f3c5c5] bg-[#fff7f7] px-5 py-4 text-sm text-[#b42318]">
              {deleteError}
            </p>
          )}

          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              isDeleting={deletingApplicationId === application.id}
              onDelete={() => void handleDeleteApplication(application.id)}
            />
          ))}

          {!isLoading && !loadError && applications.length === 0 && (
            <p className="border border-[#ececec] bg-[#fbfbfb] px-5 py-8 text-sm text-[#777777]">
              No applications to show.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
