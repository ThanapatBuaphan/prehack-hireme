import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../services/auth.service";

interface Education {
  id: number;
  school: string;
  degree: string;
  graduationYear: string;
}

interface WorkExperience {
  id: number;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
}

export default function CreateAcc3user() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state?.formData || {};
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [educations, setEducations] = useState<Education[]>([
    { id: 1, school: "", degree: "", graduationYear: "" },
  ]);

  const [experiences, setExperiences] = useState<WorkExperience[]>([
    { id: 1, jobTitle: "", company: "", startDate: "", endDate: "", currentlyWorking: false },
  ]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Education handlers ──
  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      { id: Date.now(), school: "", degree: "", graduationYear: "" },
    ]);
  };

  const removeEducation = (id: number) => {
    if (educations.length === 1) return;
    setEducations((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    setEducations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
    setErrors((prev) => ({ ...prev, [`edu_${id}_${field}`]: "" }));
  };

  // ── Experience handlers ──
  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      { id: Date.now(), jobTitle: "", company: "", startDate: "", endDate: "", currentlyWorking: false },
    ]);
  };

  const removeExperience = (id: number) => {
    if (experiences.length === 1) return;
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExperience = (id: number, field: keyof WorkExperience, value: string | boolean) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  // ── Resume handler ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: "" }));
    } else if (file) {
      setErrors((prev) => ({ ...prev, resume: "Only PDF files are accepted." }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: "" }));
    } else if (file) {
      setErrors((prev) => ({ ...prev, resume: "Only PDF files are accepted." }));
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Submit ──
  const handleCreate = async () => {
    setApiError("");
    setIsLoading(true);
    try {
      await registerUser({
        firstName: prevData.firstName || "",
        lastName: prevData.lastName || "",
        email: prevData.email || "",
        password: prevData.password || "",
        confirmPassword: prevData.confirmPassword || "",
        gender: "unspecified",
        phoneNumber: "",
      });
      navigate("/");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Registration failed. Please try again.";
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8 flex flex-col items-center">

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 bg-[#0455E2] border-[#0455E2] text-white transition-all">
                {step < 3 ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  3
                )}
              </div>
              {idx < 2 && <div className="w-10 border-t-2 border-dashed border-[#0455E2]" />}
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Your Profile</h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Add your background to help employers find you.
        </p>

        <div className="w-full flex flex-col gap-6">

          {/* ── Education Section ── */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#0455E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Education
              </h2>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 text-xs font-semibold text-[#0455E2] border border-[#0455E2] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {educations.map((edu, index) => (
                <div key={edu.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
                  {educations.length > 1 && (
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {educations.length > 1 && (
                    <p className="text-xs font-semibold text-gray-400 mb-3">#{index + 1}</p>
                  )}
                  <div className="flex flex-col gap-3">
                    {/* School */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">School / University</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                        placeholder="e.g. Chulalongkorn University"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    {/* Degree & Year */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          placeholder="e.g. Bachelor's"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.graduationYear}
                          onChange={(e) => updateEducation(edu.id, "graduationYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="e.g. 2024"
                          maxLength={4}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Work Experience Section ── */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#0455E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Work Experience
              </h2>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 text-xs font-semibold text-[#0455E2] border border-[#0455E2] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
                  {experiences.length > 1 && (
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {experiences.length > 1 && (
                    <p className="text-xs font-semibold text-gray-400 mb-3">#{index + 1}</p>
                  )}
                  <div className="flex flex-col gap-3">
                    {/* Job Title & Company */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)}
                          placeholder="e.g. Frontend Developer"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                    {/* Start & End Date */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          disabled={exp.currentlyWorking}
                          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                            ${exp.currentlyWorking
                              ? "border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-200 bg-white focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100"
                            }`}
                        />
                      </div>
                    </div>
                    {/* Currently Working Here */}
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking}
                        onChange={(e) => {
                          updateExperience(exp.id, "currentlyWorking", e.target.checked);
                          if (e.target.checked) updateExperience(exp.id, "endDate", "");
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[#0455E2] accent-[#0455E2] cursor-pointer"
                      />
                      <span className="text-xs font-medium text-gray-600">Currently Work Here</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Resume Section ── */}
          <div className="w-full">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-[#0455E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </h2>
            <p className="text-xs text-gray-500 mb-3">Upload your resume here</p>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all
                ${resumeFile
                  ? "border-[#0455E2] bg-blue-50"
                  : errors.resume
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-gray-50 hover:border-[#0455E2] hover:bg-blue-50/40"
                }`}
            >
              {resumeFile ? (
                <>
                  <svg className="w-10 h-10 text-[#0455E2] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-[#0455E2]">{resumeFile.name}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to replace</p>
                </>
              ) : (
                <>
                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-600">Click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">or drag and drop your file here</p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {errors.resume
              ? <p className="text-red-500 text-xs mt-1">{errors.resume}</p>
              : <p className="text-xs text-gray-400 mt-2">PDF file only</p>
            }
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mt-4 w-full px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {apiError}
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200
            ${isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-[#0455E2] hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-200"
            }`}
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Creating...
            </>
          ) : (
            <>
              Create Account
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>

        {/* Sign In Link */}
        <p className="mt-5 text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-[#0455E2] font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
