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

import JobHome from "./pages/JobSeekerSide/jobHome";
import JobApplicants from "./pages/JobSeekerSide/jobApplicants";
import JobProfile from "./modules/Profile/pages/jobProfile";

export default function App() {
  const { profile } = useProfile();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#F8FAF9]">
        
        {profile && profile.role === "company" && <SidebarCom />}
        {profile && profile.role === "user" && <SidebarJob />}

        <main className="flex-1 overflow-y-auto">
          <Routes>
            
            <Route 
              path="/" 
              element={
                !profile ? <Navigate to="/LoginPage" /> : 
                profile.role === "company" ? <Navigate to="/comHome" /> : <Navigate to="/jobHome" />
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
        </main>

      </div>
    </BrowserRouter>
  );
}