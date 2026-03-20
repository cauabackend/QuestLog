const STATUS_CONFIG = {
  playing: { label: "Jogando", color: "bg-green-500/10 text-green-400 border border-green-500/20" },
  completed: { label: "Zerado", color: "bg-[#DC2626]/10 text-[#EF4444] border border-[#DC2626]/20" },
  wishlist: { label: "Na fila", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  dropped: { label: "Largado", color: "bg-[#525252]/10 text-[#737373] border border-[#525252]/20" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${config.color}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;