interface Props {
  label: string;
  value?: string | null;
  isEditing?: boolean;
  onChange?: (v: string) => void;
  placeholder?: string;
  href?: boolean;
}

export default function InfoRow({ label, value, isEditing, onChange, placeholder, href }: Props) {
  return (
    <li className="flex items-center gap-2 text-sm text-gray-700">
      <span className="font-semibold min-w-[80px] text-gray-500">{label}:</span>
      {isEditing ? (
        <input
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder ?? label}
          className="border border-gray-300 rounded-full px-3 py-1 text-sm flex-1 outline-none focus:border-[#515DB6]"
        />
      ) : href && value ? (
        <a href={`mailto:${value}`} className="text-[#515DB6] underline truncate">{value}</a>
      ) : (
        <span className="text-gray-700 truncate">{value ?? <span className="text-gray-400 italic">—</span>}</span>
      )}
    </li>
  );
}
