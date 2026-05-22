import { useNavigate } from "react-router-dom";
import { useDrawer } from "../context/DrawerContext";
import MenuBar from "../icons/Menu-bar.png";
import BackArrow from "../icons/Back arrow.png";

interface PageHeaderProps {
  showBack?: boolean;
  backTo?: string;
  onBack?: () => void;
}

export default function PageHeader({ showBack = false, backTo, onBack }: PageHeaderProps) {
  const { setOpen } = useDrawer();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token") || !!localStorage.getItem("role");

  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      <div className="flex items-center gap-2">

        {isLoggedIn && (
          <button onClick={() => setOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl"
            aria-label="Open menu">
            <img src={MenuBar} alt="menu" className="w-6 h-6 object-contain" />
          </button>
        )}


        {!isLoggedIn && (
          <>
            <button onClick={() => navigate("/LoginPage")}
              className="px-4 py-1.5 rounded-full border border-[#515DB6] text-[#515DB6] text-sm font-semibold hover:bg-[#515DB6]/5 transition-colors">
              Login
            </button>
            <button onClick={() => navigate("/CreateAcc1")}
              className="px-4 py-1.5 rounded-full bg-[#515DB6] text-white text-sm font-semibold hover:bg-[#3D3B8E] transition-colors">
              Register
            </button>
          </>
        )}
      </div>

      <div className="flex-1" />

      {showBack && (
        <button
          onClick={() => { if (onBack) onBack(); else if (backTo) navigate(backTo); else navigate(-1); }}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:scale-110 transition">
          <img src={BackArrow} alt="Back" className="w-6 h-6 object-contain" />
        </button>
      )}
    </div>
  );
}