import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onDelete?: () => void;
}

export default function CardSection({ children, onDelete }: Props) {
  return (
    <div className="bg-gray-100 rounded-xl p-3 relative group">
      {children}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
