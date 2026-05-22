type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="flex w-full min-w-0 items-stretch gap-2">
      <span className="sr-only">Search jobs</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search jobs by title, keywords or company..."
        className="h-12 min-w-0 flex-1 rounded-md border border-[#6e6e6e] bg-white px-3 text-sm text-black outline-none placeholder:text-[#a0a0a0] focus:border-[#6d35d3] focus:ring-2 focus:ring-[#e3d5ff] sm:px-4"
      />
      <button
        type="button"
        className="h-12 shrink-0 rounded-md bg-[#6d35d3] px-4 text-sm font-semibold text-white transition hover:bg-[#5b29bc] sm:px-7"
      >
        Search
      </button>
    </label>
  );
}
