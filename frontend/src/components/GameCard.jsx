import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function GameCard({ game, onAdd, showStatus = false }) {
  const [imgSrc, setImgSrc] = useState(
    game.image_url || "https://placehold.co/616x353/141414/262626?text=Sem+imagem"
  );

  function handleImgError() {
    if (game.image_fallback && imgSrc !== game.image_fallback) {
      setImgSrc(game.image_fallback);
    } else {
      setImgSrc("https://placehold.co/616x353/141414/262626?text=Sem+imagem");
    }
  }

  const isSteam = !!game.steam_appid;
  const detailLink = isSteam
    ? null
    : game.id
      ? `/game/${game.id}?source=library`
      : `/game/${game.rawg_id}?source=search`;

  const Wrapper = isSteam ? "a" : Link;
  const wrapperProps = isSteam
    ? { href: `https://store.steampowered.com/app/${game.steam_appid}`, target: "_blank", rel: "noopener noreferrer" }
    : { to: detailLink };

  return (
    <div className="group bg-[#141414] rounded-xl overflow-hidden border border-[#1A1A1A] hover:border-[#DC2626]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#DC2626]/5">
      <Wrapper {...wrapperProps} className="block">
        <div className="relative aspect-video overflow-hidden bg-[#0A0A0A]">
          <img
            src={imgSrc}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={handleImgError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent" />

          {game.metacritic && (
            <span className="absolute top-2 right-2 text-[10px] font-bold bg-green-500/90 text-white px-1.5 py-0.5 rounded">
              {game.metacritic}
            </span>
          )}

          {!game.metacritic && isSteam && game.playtime_hours > 0 && (
            <span className="absolute top-2 right-2 text-[10px] font-bold bg-[#DC2626]/90 text-white px-1.5 py-0.5 rounded">
              {game.playtime_hours}h
            </span>
          )}

          {showStatus && game.status && (
            <div className="absolute top-2 left-2">
              <StatusBadge status={game.status} />
            </div>
          )}

          {isSteam && !showStatus && (
            <div className="absolute top-2 left-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1B9CFC]/10 text-[#1B9CFC] border border-[#1B9CFC]/20">
                Steam
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-semibold text-[13px] leading-tight line-clamp-1 drop-shadow-lg">
              {game.title}
            </h3>
          </div>
        </div>
      </Wrapper>

      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          {game.genres && game.genres.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre) => (
                <span key={genre} className="text-[9px] font-medium bg-[#1A1A1A] text-[#737373] px-1.5 py-0.5 rounded">
                  {genre}
                </span>
              ))}
              {game.genres.length > 2 && (
                <span className="text-[9px] font-medium bg-[#1A1A1A] text-[#525252] px-1.5 py-0.5 rounded">
                  +{game.genres.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-[#525252]">
              {isSteam && game.playtime_hours > 0 ? `${game.playtime_hours}h jogadas` : isSteam ? "Nunca jogado" : ""}
            </span>
          )}
          {game.released && (
            <span className="text-[10px] text-[#525252]">{game.released.slice(0, 4)}</span>
          )}
        </div>

        {onAdd && (
          <div>
            {!game.in_library ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAdd(game);
                }}
                className="w-full text-[11px] py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-all font-semibold tracking-wide"
              >
                + ADICIONAR
              </button>
            ) : (
              <div className="w-full text-center text-[10px] py-2 bg-[#1A1A1A] text-[#525252] rounded-lg font-medium">
                NA BIBLIOTECA
              </div>
            )}
          </div>
        )}

        {!onAdd && !isSteam && (
          <Link
            to={detailLink}
            className="block w-full text-center text-[10px] py-2 bg-[#1A1A1A] text-[#737373] rounded-lg hover:bg-[#262626] hover:text-white transition-all font-medium"
          >
            VER DETALHES
          </Link>
        )}

        {!onAdd && isSteam && (
          <a
            href={`https://store.steampowered.com/app/${game.steam_appid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center text-[10px] py-2 bg-[#1A1A1A] text-[#737373] rounded-lg hover:bg-[#1B2838] hover:text-white transition-all font-medium"
          >
            VER NA STEAM
          </a>
        )}
      </div>
    </div>
  );
}

export default GameCard;