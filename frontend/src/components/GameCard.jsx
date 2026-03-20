import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function GameCard({ game, onAdd, showStatus = false }) {
  const imageUrl = game.image_url || "https://placehold.co/400x225/1e293b/64748b?text=Sem+imagem";

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
      <img
        src={imageUrl}
        alt={game.title}
        className="w-full h-44 object-cover"
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2">
            {game.title}
          </h3>
          {showStatus && game.status && <StatusBadge status={game.status} />}
        </div>

        {game.genres && game.genres.length > 0 && (
          <p className="text-slate-500 text-xs mb-3">
            {game.genres.slice(0, 3).join(", ")}
          </p>
        )}

        {game.metacritic && (
          <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
            Metacritic {game.metacritic}
          </span>
        )}

        <div className="flex gap-2 mt-3">
          {game.rawg_id && !game.id && (
            <Link
              to={`/game/${game.rawg_id}?source=search`}
              className="flex-1 text-center text-xs py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ver detalhes
            </Link>
          )}

          {game.id && (
            <Link
              to={`/game/${game.id}?source=library`}
              className="flex-1 text-center text-xs py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ver detalhes
            </Link>
          )}

          {onAdd && !game.in_library && (
            <button
              onClick={() => onAdd(game)}
              className="flex-1 text-xs py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Adicionar
            </button>
          )}

          {onAdd && game.in_library && (
            <span className="flex-1 text-center text-xs py-2 bg-slate-800 text-slate-500 rounded-lg">
              Na biblioteca
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameCard;