function SearchBar({ value, onChange, placeholder = "Buscar jogos..." }) {
  return (
    <div className="relative">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#E5E5E5] placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50 focus:ring-1 focus:ring-[#DC2626]/20 transition-all text-sm"
      />
    </div>
  );
}

export default SearchBar;