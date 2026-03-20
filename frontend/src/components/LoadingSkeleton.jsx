function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden animate-pulse"
        >
          <div className="w-full h-44 bg-slate-800" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-800 rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;