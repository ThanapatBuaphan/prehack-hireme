import { useNavigate } from "react-router-dom";

interface CancelButtonProps {
  label?: string;
  className?: string;
}

export default function CancelButton({ 
  label = "Cancel", 
  className = "" 
}: CancelButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-100 transition-colors ${className}`}
    >
      {label}
    </button>
  );
}