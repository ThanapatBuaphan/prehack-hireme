import { Outlet, useLocation } from "react-router-dom";
import { useProfile } from "./context/ProfileContext";
import SidebarCom from "./components/SidebarCom";
import SidebarJob from "./components/SidebarJob";

const AUTH_ROUTES = [
  "/",
  "/CreateAcc1",
  "/CreateAcc2com",
  "/CreateAcc2user",
  "/CreateAcc3com",
  "/CreateAcc3user",
];

export default function App() {
  const { profile } = useProfile();
  const { pathname } = useLocation();

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      {!isAuthPage && profile?.role === "company" && <SidebarCom />}
      {!isAuthPage && profile?.role === "user" && <SidebarJob />}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
