import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "jobseeker" | "company" | null;

export default function CreateAcc1() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) return;
    if (selectedRole === "jobseeker") {
      navigate("/CreateAcc2user");
    } else {
      navigate("/CreateAcc2com");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 flex flex-col items-center">

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all
                  ${step === 1
                    ? "bg-[#0455E2] border-[#0455E2] text-white"
                    : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                {step}
              </div>
              {idx < 2 && (
                <div className="w-10 border-t-2 border-dashed border-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">
          Choose your account type
        </h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Select how you want to use HireMe.
        </p>

        <div className="w-full flex flex-col gap-4 mb-6">

          <button
            onClick={() => setSelectedRole("jobseeker")}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200
              ${selectedRole === "jobseeker"
                ? "border-[#0455E2] bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
              }`}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="20" r="12" fill="#90CAF9" />
                <ellipse cx="32" cy="48" rx="18" ry="10" fill="#42A5F5" />
                <rect x="24" y="30" width="16" height="10" rx="3" fill="#1565C0" />
                <rect x="20" y="33" width="24" height="4" rx="2" fill="#1976D2" />
              </svg>
            </div>

            <div className="flex-1">
              <p className="font-bold text-gray-800 text-base">Job Seeker</p>
              <p className="text-gray-500 text-sm mt-0.5">Find jobs and apply to companies</p>
            </div>

            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
              ${selectedRole === "jobseeker"
                ? "border-[#0455E2] bg-[#0455E2]"
                : "border-gray-300 bg-white"
              }`}
            >
              {selectedRole === "jobseeker" && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          {/* Company */}
          <button
            onClick={() => setSelectedRole("company")}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200
              ${selectedRole === "company"
                ? "border-[#0455E2] bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
              }`}
          >

            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="20" width="40" height="34" rx="2" fill="#90CAF9" />
                <rect x="18" y="26" width="8" height="8" rx="1" fill="#1565C0" />
                <rect x="28" y="26" width="8" height="8" rx="1" fill="#1565C0" />
                <rect x="38" y="26" width="8" height="8" rx="1" fill="#1565C0" />
                <rect x="18" y="38" width="8" height="8" rx="1" fill="#1565C0" />
                <rect x="28" y="38" width="8" height="8" rx="1" fill="#1565C0" />
                <rect x="38" y="38" width="8" height="8" rx="1" fill="#1565C0" />
                <rect x="22" y="12" width="20" height="10" rx="2" fill="#42A5F5" />
                <rect x="8" y="48" width="10" height="6" rx="1" fill="#4FC3F7" />
                <rect x="46" y="48" width="10" height="6" rx="1" fill="#4FC3F7" />
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-base">Company</p>
              <p className="text-gray-500 text-sm mt-0.5">Post jobs and manage applicants</p>
            </div>

            {/* Radio */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
              ${selectedRole === "company"
                ? "border-[#0455E2] bg-[#0455E2]"
                : "border-gray-300 bg-white"
              }`}
            >
              {selectedRole === "company" && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200
            ${selectedRole
              ? "bg-[#0455E2] hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-200"
              : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Continue
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

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
