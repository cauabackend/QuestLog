function LoadingSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#141414] rounded-xl border border-[#1A1A1A] overflow-hidden animate-pulse">
          <div className="aspect-[3/4] bg-[#1A1A1A]" />
          <div className="px-3 py-2.5 space-y-2">
            <div className="flex gap-1"><div className="h-2.5 bg-[#1A1A1A] rounded w-10" /><div className="h-2.5 bg-[#1A1A1A] rounded w-8" /></div>
            <div className="h-7 bg-[#1A1A1A] rounded-lg w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;