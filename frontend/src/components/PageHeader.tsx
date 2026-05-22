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

  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      {/* menu button mobile only */}
      <button onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl"
        aria-label="Open menu">
        <img src={MenuBar} alt="menu" className="w-6 h-6 object-contain" />
      </button>

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