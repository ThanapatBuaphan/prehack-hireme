import { useProfile } from "../context/ProfileContext";
import { Navigate } from "react-router-dom";
import JobHome from "../modules/easyApplication/pages/jobHomePage";
import ComHome from "../modules/ืSearchAndFilter/pages/comHome";

export default function HomeRedirect() {
  const { profile } = useProfile();
  if (profile?.role === "company") return <ComHome />;
  return <JobHome />;
}