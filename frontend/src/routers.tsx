import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import CreateAcc1 from "./pages/CreateAcc1";
import CreateAcc2com from "./pages/CreateAcc2com";
import CreateAcc2user from "./pages/CreateAcc2user";
import CreateAcc3com from "./pages/CreateAcc3com";
import CreateAcc3user from "./pages/CreateAcc3user";

//Company
import ComHome from "./pages/CompanySide/comHome";
import ComMyPost from "./pages/CompanySide/comMyPost";
import ComApplicants from "./pages/CompanySide/comApplicants";
import ComCreatePost from "./pages/CompanySide/comCreatePost";
import ComMyPostEdit from "./pages/CompanySide/comMyPostEdit";
import ComProfile from "./pages/CompanySide/comProfile";
import ComProfileEdit from "./pages/CompanySide/comProfileEdit";

//Job seeker
import JobHome from "./pages/JobSeekerSide/jobHome";
import JobApplicants from "./pages/JobSeekerSide/jobApplicants";
import JobProfile from "./pages/JobSeekerSide/jobProfile";
import JobProfileEdit from "./pages/JobSeekerSide/jobProfileEdit";



const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/CreateAcc1", element: <CreateAcc1/>},
      { path: "/CreateAcc2com", element: <CreateAcc2com/>},
      { path: "/CreateAcc2user", element: <CreateAcc2user/>},
      { path: "/CreateAcc3com", element: <CreateAcc3com/>},
      { path: "/CreateAcc3user", element: <CreateAcc3user/>},

      // ฝั่ง Company
      { path: "comHome", element: <ComHome /> },
      { path: "comMyPost", element: <ComMyPost /> },
      { path: "comCreatePost", element: <ComCreatePost /> },
      { path: "comApplicants", element: <ComApplicants /> },
      { path: "comMyPostEdit", element: <ComMyPostEdit /> },
      { path: "comProfile", element: <ComProfile /> },
      { path: "comProfileEdit", element: <ComProfileEdit /> },
      
      // ฝั่ง Job Seeker
      { path: "jobHome", element: <JobHome /> },
      { path: "jobApplicants", element: <JobApplicants /> },
      { path: "jobProfile", element: <JobProfile /> },
      { path: "jobProfileEdit", element: <JobProfileEdit /> },
      

      { path: "*", element: <NotFound/>}
    ],
  },
]);

export default mainRouter;