import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerCompany } from "../services/auth.service";

export default function CreateAcc3com() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state?.formData || {};

  const [form, setForm] = useState({
    founded: "",
    companySize: "",
    address: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "founded") {
      // Auto-format DD/MM/YYYY
      const digits = value.replace(/\D/g, "");
      let formatted = digits;
      if (digits.length >= 3 && digits.length <= 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else if (digits.length >= 5) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      }
      setForm((prev) => ({ ...prev, founded: formatted }));
      setErrors((prev) => ({ ...prev, founded: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.founded && !/^\d{2}\/\d{2}\/\d{4}$/.test(form.founded)) {
      newErrors.founded = "Please use DD/MM/YYYY format.";
    }
    if (form.companySize && isNaN(Number(form.companySize))) {
      newErrors.companySize = "Must be a number.";
    }
    return newErrors;
  };

  const handleCreate = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setApiError("");
    setIsLoading(true);
    try {
      await registerCompany({
        email: prevData.email || "",
        password: prevData.password || "",
        companyName: prevData.companyName || "",
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
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 flex flex-col items-center">

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all
                  ${step < 3
                    ? "bg-[#0455E2] border-[#0455E2] text-white"
                    : "bg-[#0455E2] border-[#0455E2] text-white"
                  }`}
              >
                {step < 3 ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  3
                )}
              </div>
              {idx < 2 && (
                <div className="w-10 border-t-2 border-dashed border-[#0455E2]" />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">
          Company Details
        </h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Help job seekers learn more about your company.
        </p>

        {/* Form */}
        <div className="w-full flex flex-col gap-4">

          {/* Founded & Company Size */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Founded */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founded
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="founded"
                  value={form.founded}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none transition-all
                    ${errors.founded
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 bg-gray-50 focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100"
                    }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              {errors.founded && (
                <p className="text-red-500 text-xs mt-1">{errors.founded}</p>
              )}
            </div>

            {/* Company Size */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Size
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="companySize"
                  value={form.companySize}
                  onChange={handleChange}
                  placeholder="e.g. 200"
                  className={`w-full px-4 py-3 pr-20 rounded-xl border text-sm outline-none transition-all
                    ${errors.companySize
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 bg-gray-50 focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100"
                    }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                  employees
                </span>
              </div>
              {errors.companySize && (
                <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>
              )}
            </div>
          </div>

          {/* Company Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. 123 Sukhumvit Rd, Bangkok, Thailand"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Tell about your company — what you do, your culture, and what makes you unique..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Share what makes your company a great place to work.
            </p>
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
