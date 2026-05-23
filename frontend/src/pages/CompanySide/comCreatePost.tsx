import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/post.service";

export default function ComCreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    jobtitle: "", location: "", requirements: "", Salary: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.jobtitle || !form.location || !form.requirements || !form.Salary) {
      setError("Please fill in all required fields."); return;
    }
    setError("");
    setLoading(true);
    try {
      await postService.createPost({
        jobtitle: form.jobtitle,
        location: form.location,
        requirements: form.requirements,
        Salary: parseFloat(form.Salary),
        description: form.description || undefined,
      });
      navigate("/comMyPost");
    } catch {
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-3 sm:p-6 flex items-start justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-2xl p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create New Post</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 mb-5 sm:mb-6">
          Fill in the details below to post a new job and find the right talent.
        </p>

        <div className="mb-5 sm:mb-6">
          <h2 className="font-semibold text-gray-700 mb-1">Job Details</h2>
          <p className="text-xs text-gray-400 mb-4">Add the basic information about the job you want to post.</p>

          {/* Job Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input name="jobtitle" value={form.jobtitle} onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#515DB6]/30" />
          </div>

          {/* Address + Salary: 1 col on mobile, 2 col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Bangkok, Thailand"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#515DB6]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary <span className="text-red-500">*</span>
              </label>
              <input name="Salary" value={form.Salary} onChange={handleChange}
                placeholder="e.g. 35000" type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#515DB6]/30" />
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements <span className="text-red-500">*</span>
            </label>
            <input name="requirements" value={form.requirements} onChange={handleChange}
              placeholder="e.g. React, TypeScript, Teamwork"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#515DB6]/30" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="e.g. This role needs to do..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#515DB6]/30 resize-none" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button onClick={() => navigate("/comMyPost")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#515DB6] hover:bg-[#3D3B8E] text-white text-sm font-semibold transition-colors disabled:opacity-60">
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}