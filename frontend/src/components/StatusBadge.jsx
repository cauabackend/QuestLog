const STATUS_CONFIG = {
  playing: { label: "Jogando", color: "bg-green-400/10 text-green-400" },
  completed: { label: "Zerado", color: "bg-blue-400/10 text-blue-400" },
  wishlist: { label: "Quero jogar", color: "bg-amber-400/10 text-amber-400" },
  dropped: { label: "Largado", color: "bg-red-400/10 text-red-400" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${config.color}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;