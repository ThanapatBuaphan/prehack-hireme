import { useNavigate } from "react-router-dom";

interface EditButtonProps {
  to: string; 
  label?: string; 
  className?: string; 
}

export default function EditButton({
  to,
  label = "Edit",
  className = "",
}: EditButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`px-6 py-2.5 rounded-full border border-[#515DB6] bg-white text-[#515DB6] font-semibold text-sm hover:bg-[#515DB6]/5 transition-colors ${className}`}
    >
      {label}
    </button>
  );
}