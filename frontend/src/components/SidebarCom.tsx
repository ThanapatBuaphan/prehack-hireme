import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import Logout from "../icons/Logout.png";
import Home from "../icons/Home.png";
import MyPosts from "../icons/My Post.png";
import Applicants from "../icons/Applicants.png";
import MyProfile from "../icons/My Profile.png";

export default function SidebarCompany() {
  const { logout } = useProfile();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/comHome", icon:Home },
    { label: "My Posts", path: "/comMyPost", icon:MyPosts },
    { label: "Applicants", path: "/comApplicants", icon:Applicants },
    { label: "My Profile", path: "/comProfile", icon:MyProfile },
  ];

  const sidebarContent = (
    <>
      <div className="flex flex-col gap-10 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`flex items-center gap-4 text-[17px] transition-colors
                ${isActive ? "font-semibold text-black" : "text-gray-600 hover:text-black"}`}
            >
              
              <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded">
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => {
          setIsMobileSidebarOpen(false);
          logout();
        }}
        className="flex items-center gap-4 text-[17px] text-gray-600 transition-colors hover:text-red-500 w-full text-left pb-4"
      >
        
        <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded">
           <img src={Logout} alt="Logout" className="w-6 h-6" />
        </div>
        <span>Logout</span>
      </button>
    </>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-gray-200 bg-white px-4 shadow-sm md:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isMobileSidebarOpen}
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white"
        >
          <span className="h-0.5 w-5 bg-black" />
          <span className="h-0.5 w-5 bg-black" />
          <span className="h-0.5 w-5 bg-black" />
        </button>
      </header>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col justify-between bg-white px-8 py-12 shadow-[4px_0_10px_rgba(0,0,0,0.03)] md:flex">
        {sidebarContent}
      </aside>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/45"
          />

          <aside className="relative z-10 flex h-full w-[min(260px,82vw)] flex-col justify-between bg-white px-8 py-12 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
