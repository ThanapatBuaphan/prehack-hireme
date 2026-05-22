import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useDrawer } from "../context/DrawerContext";

import Home from "../icons/Home.png";
import MyApplications from "../icons/My Applications.png";
import MyProfile from "../icons/My Profile.png";
import Logout from "../icons/Logout.png";

const menuItems = [
  { label: "Home", path: "/jobHome", icon: Home },
  { label: "My Applications", path: "/jobApplicants", icon: MyApplications },
  { label: "My Profile", path: "/jobProfile", icon: MyProfile },
];

function NavItems({ onNav }: { onNav?: () => void }) {
  const location = useLocation();
  const { logout } = useProfile();

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
      <button onClick={logout}
        className="flex items-center gap-4 text-[17px] text-gray-600 hover:text-red-500 text-left pb-4">
        <img src={Logout} alt="Logout" className="w-6 h-6 object-contain" />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default function SidebarJobSeeker() {
  const { open, setOpen } = useDrawer();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] bg-white shadow-[4px_0_10px_rgba(0,0,0,0.03)] flex-col py-12 px-8 sticky top-0 h-screen">
        <NavItems />
      </aside>

      {/* Mobile drawer overlay */}
      <div className={`md:hidden fixed inset-0 z-50 flex transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* Drawer panel */}
        <div
          className={`relative z-10 w-[260px] h-full bg-white flex flex-col py-12 px-8 shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <svg width="14" height="14" fill="none" stroke="#374151" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <NavItems onNav={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}