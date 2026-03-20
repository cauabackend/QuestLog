import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function GameCard({ game, onAdd, showStatus = false }) {
  const imageUrl = game.image_url || "https://placehold.co/400x530/141414/262626?text=Sem+imagem";
  const detailLink = game.id ? `/game/${game.id}?source=library` : `/game/${game.rawg_id}?source=search`;

  return (
    <div className="group bg-[#141414] rounded-xl overflow-hidden border border-[#1A1A1A] hover:border-[#DC2626]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#DC2626]/5">
      <Link to={detailLink} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img src={imageUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />

          {game.metacritic && (
            <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-green-500/90 text-white px-1.5 py-0.5 rounded">
              {game.metacritic}
            </span>
          )}
          {showStatus && game.status && (
            <div className="absolute top-2.5 left-2.5"><StatusBadge status={game.status} /></div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-semibold text-[13px] leading-tight line-clamp-2 drop-shadow-lg">{game.title}</h3>
            {game.released && <p className="text-[#737373] text-[11px] mt-1">{game.released.slice(0, 4)}</p>}
          </div>
        </div>
      </Link>

      <div className="px-3 py-2.5 border-t border-[#1A1A1A]">
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {game.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-[9px] font-medium bg-[#1A1A1A] text-[#737373] px-1.5 py-0.5 rounded">{genre}</span>
            ))}
            {game.genres.length > 2 && (
              <span className="text-[9px] font-medium bg-[#1A1A1A] text-[#525252] px-1.5 py-0.5 rounded">+{game.genres.length - 2}</span>
            )}
          </div>
        )}
        {onAdd && (
          <div>
            {!game.in_library ? (
              <button onClick={(e) => { e.preventDefault(); onAdd(game); }}
                className="w-full text-[11px] py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-all font-semibold tracking-wide">
                + ADICIONAR
              </button>
            ) : (
              <div className="w-full text-center text-[10px] py-2 bg-[#1A1A1A] text-[#525252] rounded-lg font-medium">NA BIBLIOTECA</div>
            )}
          </div>
        )}
        {!onAdd && (
          <Link to={detailLink} className="block w-full text-center text-[10px] py-2 bg-[#1A1A1A] text-[#737373] rounded-lg hover:bg-[#262626] hover:text-white transition-all font-medium">
            VER DETALHES
          </Link>
        )}
      </div>
    </div>
  );
}

export default GameCard;