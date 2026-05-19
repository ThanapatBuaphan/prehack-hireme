import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

import Home from "../icons/Home.png";
import MyApplications from "../icons/My Applications.png";
import MyProfile from "../icons/My Profile.png";
import Logout from "../icons/Logout.png";

export default function SidebarJobSeeker() {
  const { logout } = useProfile();
  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/jobHome", icon: Home },
    { label: "My Applications", path: "/jobApplicants", icon: MyApplications },
    { label: "My Profile", path: "/jobProfile", icon: MyProfile },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white shadow-[4px_0_10px_rgba(0,0,0,0.03)] fixed top-0 left-0 py-12 px-8 flex flex-col justify-between z-40">
      
      <div className="flex flex-col gap-10 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 text-[17px] transition-colors
                ${isActive ? "font-semibold text-black" : "text-gray-600 hover:text-black"}`}
            >

              <img 
                src={item.icon} 
                alt={item.label} 
                className="w-6 h-6 object-contain" 
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-4 text-[17px] text-gray-600 transition-colors hover:text-red-500 w-full text-left pb-4"
      >
        <img 
          src={Logout} 
          alt="Logout" 
          className="w-6 h-6 object-contain" 
        />
        <span>Logout</span>
      </button>

    </aside>
  );
}