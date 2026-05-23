import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";
import { useProfile } from "../context/ProfileContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const { refetchProfile } = useProfile();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format.";
    if (!form.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setApiError("");
    setIsLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      await refetchProfile();
      if (data.role === "user") {
        navigate("/jobHome");
      } else {
        navigate("/comHome");
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || "Login failed. Please try again.";
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8 flex flex-col items-center">

        {/* Logo / Brand */}
        <div className="mb-6">
          <img src="/src/icons/HireMe.png" alt="HireMe" className="h-16 w-auto object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-7 text-center">Sign in to your account to continue</p>

        {/* Form */}
        <div className="w-full flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                ${errors.email
                  ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 bg-gray-50 focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100"
                }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all
                  ${errors.password
                    ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 bg-gray-50 focus:border-[#0455E2] focus:ring-2 focus:ring-blue-100"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="w-full px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center mt-4">
            {apiError}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
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
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Create Account */}
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/CreateAcc1")}
            className="text-[#0455E2] font-semibold hover:underline"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
}
