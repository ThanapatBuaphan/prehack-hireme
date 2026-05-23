import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useDrawer } from "../context/DrawerContext";
import LogoutModal from "./LogoutModal";

import Home from "../icons/Home.png";
import MyPosts from "../icons/My Post.png";
import Applicants from "../icons/Applicants.png";
import MyProfile from "../icons/My Profile.png";
import Logout from "../icons/Logout.png";

const staticMenuItems = [
  { label: "Home", path: "/comHome", icon: Home },
  { label: "My Posts", path: "/comMyPost", icon: MyPosts },
  { label: "Applicants", path: "/comApplicants", icon: Applicants },
];

function NavItems({ onNav, onLogoutClick }: { onNav?: () => void; onLogoutClick: () => void }) {
  const location = useLocation();
  const { profile } = useProfile();

  const profilePath = `/company/profile/${profile?.companyId ?? "me"}`;

  const menuItems = [
    ...staticMenuItems,
    { label: "My Profile", path: profilePath, icon: MyProfile },
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-10 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={onNav}
              className={`flex items-center gap-4 text-[17px] transition-colors
                ${isActive ? "font-semibold text-black" : "text-gray-600 hover:text-black"}`}>
              <img src={item.icon} alt={item.label} className="w-6 h-6 object-contain" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <button onClick={onLogoutClick}
        className="flex items-center gap-4 text-[17px] text-gray-600 hover:text-red-500 text-left pb-4 transition-colors">
        <img src={Logout} alt="Logout" className="w-6 h-6 object-contain" />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default function SidebarCompany() {
  const { open, setOpen } = useDrawer();
  const { logout } = useProfile();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(false);
    setOpen(false);
    logout();
  };

  return (
    <>
      <aside className="hidden md:flex w-[260px] bg-white shadow-[4px_0_10px_rgba(0,0,0,0.03)] flex-col py-12 px-8 sticky top-0 h-screen">
        <NavItems onLogoutClick={() => setShowModal(true)} />
      </aside>

      <div className={`md:hidden fixed inset-0 z-50 flex transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)} />
        <div className={`relative z-10 w-[260px] h-full bg-white flex flex-col py-12 px-8 shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <svg width="14" height="14" fill="none" stroke="#374151" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <NavItems onNav={() => setOpen(false)} onLogoutClick={() => setShowModal(true)} />
        </div>
      </div>

      {showModal && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowModal(false)} />}
    </>
  );
}
