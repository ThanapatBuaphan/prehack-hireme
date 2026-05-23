import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import PageHeader from "../../../components/PageHeader";
import HireMe from "../../../icons/HireMe.png";

interface Post {
  id: number;
  jobtitle: string;
  _count?: { applies: number };
}

interface Applicant {
  id: number;
  status: string;
  userapply: { firstName: string; lastName: string; avatar?: string | null };
  post?: { jobtitle: string } | null;
}

const statusStyle = (s: string) => {
  if (s === "pending")  return "bg-yellow-100 text-yellow-700";
  if (s === "accepted") return "bg-green-100 text-green-700";
  if (s === "rejected") return "bg-red-100 text-red-600";
  return "bg-blue-100 text-blue-600";
};

export default function ComHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/company/profile"),
      api.get("/api/company/applicants").catch(() => ({ data: { applies: [] } })),
    ]).then(([profileRes, appRes]) => {
      setPosts(profileRes.data.company.posts ?? []);
      setApplicants(appRes.data.applies ?? []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-full p-3 sm:p-6">
      <PageHeader />

      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 px-2">
        <img src={HireMe} alt="HireMe" className="w-30 h-30 sm:w-50 sm:h-50 object-contain shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[#515DB6] font-bold text-l sm:text-2xl">Your career journey starts here!</p>
          <p className="text-gray-400 text-m sm:text-xl">Discover opportunities and take the next step toward your future.</p>
        </div>
        <button onClick={() => navigate("/comCreatePost")}
          className="hidden sm:block px-6 py-3 rounded-full bg-[#515DB6] hover:bg-[#3D3B8E] text-white font-bold shadow-md transition-colors shrink-0">
          + Create New Post
        </button>
      </div>

      {/* Mobile: single column, Desktop: 2 cards side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* My Job Posts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
          <h2 className="font-bold text-gray-800 text-lg">My Job Posts (Summary)</h2>
          {loading ? <p className="text-sm text-gray-400">Loading...</p>
          : posts.length === 0 ? <p className="text-sm text-gray-400 italic">No posts yet</p>
          : (
            <>
              {posts.slice(0, 3).map((post) => (
                <div key={post.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => navigate("/comMyPost")}>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{post.jobtitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{post._count?.applies ?? 0} applicants</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 font-semibold">Active</span>
                </div>
              ))}
              <button onClick={() => navigate("/comMyPost")}
                className="text-sm text-[#515DB6] hover:underline text-center font-medium pt-1">
                View All Posts
              </button>
            </>
          )}
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
          <h2 className="font-bold text-gray-800 text-lg">Recent Applicants</h2>
          {loading ? <p className="text-sm text-gray-400">Loading...</p>
          : applicants.length === 0 ? <p className="text-sm text-gray-400 italic">No applicants yet</p>
          : (
            <>
              {applicants.slice(0, 3).map((app) => (
                <div key={app.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-700">
                      {app.userapply.firstName} {app.userapply.lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{app.post?.jobtitle ?? "—"}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ml-3 ${statusStyle(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))}
              <button onClick={() => navigate("/comApplicants")}
                className="text-sm text-[#515DB6] hover:underline text-center font-medium pt-1">
                View All Posts
              </button>
            </>
          )}
        </div>

      </div>

      {/* Mobile: Create button at bottom */}
      <div className="sm:hidden mt-5 flex justify-center">
        <button onClick={() => navigate("/comCreatePost")}
          className="px-8 py-3 rounded-full bg-[#515DB6] text-white font-bold shadow-md text-sm w-full max-w-xs">
          + Create New Post
        </button>
      </div>
    </div>
  );
}

