import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./middlewares/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import CreateAcc1 from "./pages/CreateAcc1";
import CreateAcc2com from "./pages/CreateAcc2com";
import CreateAcc2user from "./pages/CreateAcc2user";
import CreateAcc3com from "./pages/CreateAcc3com";
import CreateAcc3user from "./pages/CreateAcc3user";

import ComHome from "./pages/CompanySide/comHome";
import ComMyPost from "./pages/CompanySide/comMyPost";
import ComApplicants from "./modules/companyAcceptance/pages/comApplicantsPage";
import ComCreatePost from "./pages/CompanySide/comCreatePost";
import ComMyPostEdit from "./pages/CompanySide/comMyPostEdit";
import ComProfile from "./modules/Profile/pages/comProfile";

//Job seeker
import JobHome from "./modules/easyApplication/pages/jobHomePage";
import JobApplicants from "./modules/easyApplication/pages/jobApplicantsPage";
import JobProfile from "./modules/Profile/pages/jobProfile";

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/LoginPage" replace /> },

      // Public routes
      { path: "LoginPage", element: <LoginPage /> },
      { path: "CreateAcc1", element: <CreateAcc1 /> },
      { path: "CreateAcc2com", element: <CreateAcc2com /> },
      { path: "CreateAcc2user", element: <CreateAcc2user /> },
      { path: "CreateAcc3com", element: <CreateAcc3com /> },
      { path: "CreateAcc3user", element: <CreateAcc3user /> },

      // ฝั่ง Company routes
      { path: "comHome", element: <ProtectedRoute role="company"><ComHome /></ProtectedRoute> },
      { path: "comMyPost", element: <ProtectedRoute role="company"><ComMyPost /></ProtectedRoute> },
      { path: "comCreatePost", element: <ProtectedRoute role="company"><ComCreatePost /></ProtectedRoute> },
      { path: "comApplicants", element: <ProtectedRoute role="company"><ComApplicants /></ProtectedRoute> },
      { path: "comMyPostEdit", element: <ProtectedRoute role="company"><ComMyPostEdit /></ProtectedRoute> },
      { path: "/comProfile", element: <Navigate to="/company/profile/me" replace /> },
      { path: "/company/profile/:id", element: <ComProfile /> },

      // ฝั่ง Job seeker
      { path: "jobHome", element: <ProtectedRoute role="user"><JobHome /></ProtectedRoute> },
      { path: "jobApplicants", element: <ProtectedRoute role="user"><JobApplicants /></ProtectedRoute> },
      { path: "/jobProfile", element: <Navigate to="/user/profile/me" replace /> },
      { path: "/user/profile/:id", element: <JobProfile /> },
      
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default mainRouter;
