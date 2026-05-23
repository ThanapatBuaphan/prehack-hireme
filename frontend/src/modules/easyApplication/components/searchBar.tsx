type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  location?: string;
  onLocationChange?: (value: string) => void;
};

export default function SearchBar({ value, onChange, onSearch, location, onLocationChange }: SearchBarProps) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch?.();
  };

  return (
    <div className="flex w-full min-w-0 items-stretch rounded-md border border-[#6e6e6e] overflow-hidden focus-within:border-[#6d35d3] focus-within:ring-2 focus-within:ring-[#e3d5ff]">
      {/* Keyword input */}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Search jobs by title, keywords or company..."
        className="h-12 min-w-0 flex-1 bg-white px-3 text-sm text-black outline-none placeholder:text-[#a0a0a0] sm:px-4"
      />

      {/* Divider */}
      <div className="w-px bg-[#d0d0d0] self-stretch my-2" />

      {/* Location input */}
      <input
        type="text"
        value={location ?? ""}
        onChange={(e) => onLocationChange?.(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Location..."
        className="h-12 w-32 sm:w-40 bg-white px-3 text-sm text-black outline-none placeholder:text-[#a0a0a0]"
      />

      {/* Search button */}
      <button
        type="button"
        onClick={onSearch}
        className="h-12 shrink-0 bg-[#6d35d3] px-4 text-sm font-semibold text-white transition hover:bg-[#5b29bc] sm:px-7"
      >
        Search
      </button>
    </div>
  );
}