import { useEffect, useState } from "react";
import JobCard, { type JobPosting } from "../components/jobCard";
import JobDetail from "../components/jobDetail";
import { useDrawer } from "../../../context/DrawerContext";
import { useProfile } from "../../../context/ProfileContext";
import MenuBar from "../../../icons/Menu-bar.png";
import {
  createJobApplication,
  getEasyApplicationErrorMessage,
  getAvailableJobPosts,
  getJobSeekerApplications,
} from "../apis/easyApplication.api";

export default function JobHomePage() {
  const { setOpen } = useDrawer();
  const { profile } = useProfile();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [availableJobs, existingApplications] = await Promise.all([
          getAvailableJobPosts(),
          profile?.userId
            ? getJobSeekerApplications(profile.userId)
            : Promise.resolve([]),
        ]);

        const appliedPostIds = new Set(
          existingApplications
            .map((application) => application.postId)
            .filter((postId): postId is number => postId !== null),
        );

        if (isMounted) {
          setJobs(
            availableJobs.map((job) => ({
              ...job,
              applied: appliedPostIds.has(job.id),
            })),
          );
          setSelectedJobId(availableJobs[0]?.id ?? null);
        }
      } catch (error) {
        console.error("Failed to load available job posts:", error);

        if (isMounted) {
          setJobs([]);
          setSelectedJobId(null);
          setLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load available job posts.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      isMounted = false;
    };
  }, [profile?.userId]);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  async function applyJob(job: JobPosting) {
    if (!profile?.userId) {
      setApplyError("A job seeker profile is required to apply.");
      return;
    }

    setApplyingJobId(job.id);
    setApplyError(null);

    try {
      await createJobApplication({
        userId: profile.userId,
        companyId: job.companyId,
        postId: job.id,
        message: "I am interested in this position.",
      });

      setJobs((currentJobs) =>
        currentJobs.map((currentJob) =>
          currentJob.id === job.id
            ? { ...currentJob, applied: true }
            : currentJob,
        ),
      );
    } catch (error) {
      console.error("Failed to apply for job:", error);
      setApplyError(
        getEasyApplicationErrorMessage(error, "Failed to apply for this job."),
      );
    } finally {
      setApplyingJobId(null);
    }
  }

  return (
    <main className="h-screen min-w-0 overflow-hidden bg-white">
      <section className="mx-auto flex h-full w-full max-w-[1100px] min-w-0 flex-col px-3 py-4 sm:px-6 lg:px-9 lg:py-7">
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
            Job Home
          </h1>
        </div>

        <div className="mt-7 grid min-h-0 flex-1 min-w-0 gap-6 lg:grid-cols-[minmax(320px,380px)_minmax(360px,1fr)] lg:gap-10">
          <section className="flex min-h-0 min-w-0 flex-col">
            <h1 className="shrink-0 px-2 pb-2 text-[21px] font-semibold text-black">
              All Job Postings
            </h1>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-6 pr-1">
              {isLoading && (
                <p className="rounded-md border border-[#e6e6e6] bg-[#fbfbfb] px-4 py-6 text-sm text-[#777777]">
                  Loading job posts...
                </p>
              )}

              {loadError && (
                <p className="rounded-md border border-[#f3c5c5] bg-[#fff7f7] px-4 py-6 text-sm text-[#b42318]">
                  {loadError}
                </p>
              )}

              {jobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;

                return (
                  <div key={job.id} className="min-w-0 space-y-2">
                    <JobCard
                      job={job}
                      isSelected={isSelected}
                      onSelect={() =>
                        setSelectedJobId((currentId) =>
                          currentId === job.id ? null : job.id,
                        )
                      }
                    />

                    {isSelected && (
                      <JobDetail
                        job={job}
                        compact
                        className="lg:hidden"
                        isApplying={applyingJobId === job.id}
                        applyError={isSelected ? applyError : null}
                        onApply={() => applyJob(job)}
                      />
                    )}
                  </div>
                );
              })}

              {!isLoading && !loadError && jobs.length === 0 && (
                <p className="rounded-md border border-[#e6e6e6] bg-[#fbfbfb] px-4 py-6 text-sm text-[#777777]">
                  No job posts available.
                </p>
              )}
            </div>
          </section>

          <JobDetail
            job={selectedJob}
            className="hidden min-h-0 lg:flex"
            isApplying={applyingJobId === selectedJob?.id}
            applyError={applyError}
            onApply={() => {
              if (selectedJob) {
                void applyJob(selectedJob);
              }
            }}
          />
        </div>
      </section>
    </main>
  );
}