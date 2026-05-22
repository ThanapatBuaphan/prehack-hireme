import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useProfile } from "./context/ProfileContext";

import SidebarCom from "./components/SidebarCom";
import SidebarJob from "./components/SidebarJob";

import LoginPage from "./pages/LoginPage";
import CreateAcc1 from "./pages/CreateAcc1";
import CreateAcc2com from "./pages/CreateAcc2com";
import CreateAcc3com from "./pages/CreateAcc3com";
import CreateAcc2user from "./pages/CreateAcc2user";
import CreateAcc3user from "./pages/CreateAcc3user";
import NotFound from "./pages/NotFound";

import ComHome from "./pages/CompanySide/comHome";
import ComCreatePost from "./pages/CompanySide/comCreatePost";
import ComMyPost from "./pages/CompanySide/comMyPost";
import ComMyPostEdit from "./pages/CompanySide/comMyPostEdit";
import ComApplicants from "./pages/CompanySide/comApplicants";
import ComProfile from "./modules/Profile/pages/comProfile";
import JobHome from "./modules/easyApplication/pages/jobHomePage";
import JobApplicants from "./modules/easyApplication/pages/jobApplicantsPage";
import JobProfile from "./modules/Profile/pages/jobProfile";

function normalizeRole(role?: string | null) {
  return role?.trim().toLowerCase();
}

export default function App() {
  const { profile } = useProfile();
  const role = normalizeRole(profile?.role);
  const isCompany = role === "company";
  const isJobSeeker =
    role === "user" || role === "jobseeker" || role === "job_seeker";

  return (
    <BrowserRouter>
      <div className="min-h-screen overflow-x-hidden bg-[#F8FAF9]">

        {isCompany && <SidebarCom />}
        {isJobSeeker && <SidebarJob />}

        <div
          className={`min-w-0 transition-all ${profile ? "pt-0 pl-0 md:pl-[260px]" : "pl-0"
            }`}
        >
          <Routes>

            <Route
              path="/"
              element={
                !profile ? <Navigate to="/LoginPage" /> :
                  isCompany ? <Navigate to="/comHome" /> : <Navigate to="/jobHome" />
              }
            />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/CreateAcc1" element={<CreateAcc1 />} />

            {/* สเตปสมัครงานฝั่งบริษัท */}
            <Route path="/CreateAcc2com" element={<CreateAcc2com />} />
            <Route path="/CreateAcc3com" element={<CreateAcc3com />} />

            {/* สเตปสมัครงานฝั่งคนหางาน */}
            <Route path="/CreateAcc2user" element={<CreateAcc2user />} />
            <Route path="/CreateAcc3user" element={<CreateAcc3user />} />

            <Route path="/comHome" element={<ComHome />} />
            <Route path="/comCreatePost" element={<ComCreatePost />} />
            <Route path="/comMyPost" element={<ComMyPost />} />

            <Route path="/comMyPostEdit/:id" element={<ComMyPostEdit />} />
            <Route path="/comApplicants" element={<ComApplicants />} />
            <Route path="/comProfile" element={<ComProfile />} />

            <Route path="/jobHome" element={<JobHome />} />
            <Route path="/jobApplicants" element={<JobApplicants />} />
            <Route path="/jobProfile" element={<JobProfile />} />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
