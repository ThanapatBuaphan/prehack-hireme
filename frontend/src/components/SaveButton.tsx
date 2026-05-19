interface SaveButtonProps {
  label?: string; 
  onClick?: () => void;
  type?: "submit" | "button";
  className?: string; 
}

export default function SaveButton({
  label = "Save",
  onClick,
  type = "submit",
  className = "",
}: SaveButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full border border-[#515DB6] bg-white text-[#515DB6] font-semibold text-sm hover:bg-[#515DB6]/5 transition-colors ${className}`}
    >
      {label}
    </button>
  );
}