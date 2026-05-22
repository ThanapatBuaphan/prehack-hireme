import { Outlet } from "react-router-dom";
import { useProfile } from "./context/ProfileContext";
import SidebarCom from "./components/SidebarCom";
import SidebarJob from "./components/SidebarJob";

export default function App() {
  const { profile } = useProfile();
  const role = normalizeRole(profile?.role);
  const isCompany = role === "company";
  const isJobSeeker =
    role === "user" || role === "jobseeker" || role === "job_seeker";

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      {profile && profile.role === "company" && <SidebarCom />}
      {profile && profile.role === "user" && <SidebarJob />}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
