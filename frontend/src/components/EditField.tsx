interface EditFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  multiline?: boolean;
}

export default function EditField({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  multiline = false,
}: EditFieldProps) {
  const baseClass = `w-full border rounded-2xl px-4 py-2 text-sm outline-none transition-all
    ${readOnly
      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-white border-gray-300 text-gray-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
    }`;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={3}
          className={`${baseClass} resize-none rounded-2xl`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`${baseClass} rounded-full`}
        />
      )}
    </div>
  );
}
