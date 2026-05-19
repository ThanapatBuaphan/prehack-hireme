import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// 📌 Import หน้าต่างๆ เข้ามาที่นี่แทน
import LoginPage from "./pages/LoginPage";
import ComHome from "./pages/CompanySide/comHome";
import ComMyPost from "./pages/CompanySide/comMyPost";
import JobHome from "./pages/JobSeekerSide/jobHome";
import JobApplicants from "./pages/JobSeekerSide/jobApplicants";

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { path: "/", element: <LoginPage /> },
      
      // ฝั่ง Company
      { path: "comHome", element: <ComHome /> },
      { path: "comMyPost", element: <ComMyPost /> },
      // ... (เพิ่มหน้าของ Company ที่เหลือตรงนี้)
      
      // ฝั่ง Job Seeker
      { path: "jobHome", element: <JobHome /> },
      { path: "jobApplicants", element: <JobApplicants /> },
      // ... (เพิ่มหน้าของ Job Seeker ที่เหลือตรงนี้)
    ],
  },
]);

export default mainRouter;