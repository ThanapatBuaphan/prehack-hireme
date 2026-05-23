import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService, type Post } from "../../services/post.service";

export default function ComMyPost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    postService.getMyPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    setDeletingId(id);
    try {
      await postService.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">

        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">My Job Posts</h1>
          <button onClick={() => navigate("/comCreatePost")}
            className="px-3 sm:px-5 py-2 rounded-lg bg-[#515DB6] hover:bg-[#3D3B8E] text-white text-xs sm:text-sm font-semibold transition-colors">
            + New Post
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-8 text-center">No posts yet</p>
        ) : (
          <>
            {/* Mobile & Tablet: Card layout */}
            <div className="flex flex-col gap-3 lg:hidden">
              {posts.map((post) => (
                <div key={post.id}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-700 text-sm">{post.jobtitle}</p>
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold shrink-0">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{post._count?.applies ?? 0} applicants</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() => navigate("/comMyPostEdit", { state: { post } })}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#515DB6] transition-colors">
                      <img src="/src/icons/pencil.png" alt="Edit" className="w-4 h-4 object-contain" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors disabled:opacity-40">
                      <img src="/src/icons/bin.png" alt="Delete" className="w-4 h-4 object-contain" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PC: Table layout */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-left">
                    <th className="pb-3 font-medium pl-2">Job Title</th>
                    <th className="pb-3 font-medium text-center">Applicants</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                    <th className="pb-3 font-medium text-center">Posted Date</th>
                    <th className="pb-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pl-2 font-medium text-gray-700">{post.jobtitle}</td>
                      <td className="py-4 text-center text-gray-500">{post._count?.applies ?? 0}</td>
                      <td className="py-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                          Active
                        </span>
                      </td>
                      <td className="py-4 text-center text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate("/comMyPostEdit", { state: { post } })}
                            className="text-gray-400 hover:text-[#515DB6] transition-colors"
                            title="Edit">
                            <img src="/src/icons/pencil.png" alt="Edit" className="w-5 h-5 object-contain" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                            title="Delete">
                            <img src="/src/icons/bin.png" alt="Delete" className="w-5 h-5 object-contain" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}