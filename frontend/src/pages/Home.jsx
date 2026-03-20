import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGames, getSteamGames, getSteamProfile } from "../services/api";
import StatusBadge from "../components/StatusBadge";

function Home() {
  const [games, setGames] = useState([]);
  const [steamGames, setSteamGames] = useState([]);
  const [steamProfile, setSteamProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getGames();
        setGames(data);
      } catch {
        setGames([]);
      }

      const steamId = localStorage.getItem("questlog_steam_id");
      if (steamId) {
        try {
          const [sg, sp] = await Promise.all([
            getSteamGames(steamId),
            getSteamProfile(steamId),
          ]);
          setSteamGames(sg.results || []);
          setSteamProfile(sp);
        } catch {
          setSteamGames([]);
        }
      }

      setLoading(false);
    }
    load();
  }, []);

  const playing = games.filter((g) => g.status === "playing");
  const wishlist = games.filter((g) => g.status === "wishlist");
  const completed = games.filter((g) => g.status === "completed");
  const current = playing[0] || null;
  const backlog = wishlist.slice(0, 8);
  const recentActivity = [...games].slice(0, 5);

  const steamConnected = steamGames.length > 0;
  const steamTopGames = steamGames.slice(0, 6);
  const steamTotalHours = steamGames.reduce((sum, g) => sum + g.playtime_hours, 0);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-[42vh] bg-[#141414] rounded-2xl" />
        <div className="grid grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#141414] rounded-xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {current ? (
        <div className="relative rounded-2xl overflow-hidden group" style={{ height: "42vh", minHeight: "320px" }}>
          <img src={current.image_url || "https://placehold.co/1200x600/141414/262626?text="} alt={current.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#DC2626] font-semibold mb-3 block">Continue jogando</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight max-w-lg">{current.title}</h1>
            <div className="flex items-center gap-3 mb-5">
              <StatusBadge status={current.status} />
              {current.rating && <span className="text-xs text-[#737373]">{"★".repeat(current.rating)}{"☆".repeat(5 - current.rating)}</span>}
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/game/${current.id}?source=library`}
                className="px-6 py-2.5 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-all glow-accent flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Ver jogo
              </Link>
              <Link to="/library" className="px-5 py-2.5 glass text-sm text-[#A3A3A3] rounded-lg hover:bg-[#1A1A1A] transition-all">Biblioteca</Link>
            </div>
          </div>
          <div className="absolute top-5 right-5 glass rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-[#737373] font-medium">Em progresso</span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-[#1A1A1A] bg-[#141414]" style={{ height: "42vh", minHeight: "320px" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Nenhum jogo em andamento</h2>
              <p className="text-sm text-[#525252] mb-5 max-w-xs">Busque um jogo e mude o status para "Jogando"</p>
              <Link to="/search" className="inline-block px-5 py-2.5 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-all">Buscar jogos</Link>
            </div>
          </div>
        </div>
      )}

      <div className={`grid ${steamConnected ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-4"} gap-3`}>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#525252] font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">{games.length}</p>
          <p className="text-[11px] text-[#525252] mt-1">na biblioteca</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#525252] font-medium">Jogando</span>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400 tabular-nums">{playing.length}</p>
          <p className="text-[11px] text-[#525252] mt-1">em andamento</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#525252] font-medium">Zerados</span>
            <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
          </div>
          <p className="text-2xl font-bold text-[#EF4444] tabular-nums">{completed.length}</p>
          <p className="text-[11px] text-[#525252] mt-1">finalizados</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#525252] font-medium">Na fila</span>
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{wishlist.length}</p>
          <p className="text-[11px] text-[#525252] mt-1">para jogar</p>
        </div>

        {steamConnected && (
          <>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-[#525252] font-medium">Steam</span>
                <div className="w-2 h-2 rounded-full bg-[#1B9CFC]" />
              </div>
              <p className="text-2xl font-bold text-[#1B9CFC] tabular-nums">{steamGames.length}</p>
              <p className="text-[11px] text-[#525252] mt-1">jogos comprados</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-[#525252] font-medium">Horas</span>
                <div className="w-2 h-2 rounded-full bg-[#A855F7]" />
              </div>
              <p className="text-2xl font-bold text-[#A855F7] tabular-nums">{Math.round(steamTotalHours)}</p>
              <p className="text-[11px] text-[#525252] mt-1">na Steam</p>
            </div>
          </>
        )}
      </div>

      {steamConnected && (
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-center gap-3">
              {steamProfile && <img src={steamProfile.avatar} alt="" className="w-6 h-6 rounded" />}
              <div>
                <h3 className="text-sm font-semibold text-[#E5E5E5]">Mais jogados na Steam</h3>
                <p className="text-[11px] text-[#525252] mt-0.5">{steamProfile?.name || "Steam"}</p>
              </div>
            </div>
            <Link to="/library" className="text-[11px] text-[#DC2626] hover:text-[#EF4444] font-medium transition-colors">Ver todos</Link>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {steamTopGames.map((game) => (
              <a
                key={game.steam_appid}
                href={`https://store.steampowered.com/app/${game.steam_appid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-52 group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#1A1A1A] hover:border-[#DC2626]/30 transition-all">
                  <img
                    src={game.image_url}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { if (game.image_header) e.target.src = game.image_header; else e.target.src = "https://placehold.co/616x353/141414/262626?text=?"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {game.playtime_hours > 0 && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-[#DC2626]/90 text-white px-1 py-0.5 rounded">
                      {game.playtime_hours}h
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#737373] font-medium mt-2 line-clamp-1 group-hover:text-white transition-colors">{game.title}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {!steamConnected && (
        <div className="glass rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B2838] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.04 2 11.03c0 3.97 2.84 7.31 6.68 8.45l3.69-2.13c.34-.2.73-.3 1.13-.3h.01c2.76 0 5-1.79 5-4s-2.24-4-5-4c-.28 0-.56.02-.83.07L9 11.03v-.01C9 8.25 10.34 6 12 6c1.66 0 3 2.24 3 5.02 0 .35-.03.69-.08 1.02 1.78.63 3.08 2.15 3.08 3.99 0 2.21-2.24 4-5 4-.39 0-.77-.04-1.13-.11L8 22c1.23.64 2.57 1 4 1 5.52 0 10-3.98 10-8.97C22 6.04 17.52 2 12 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[#E5E5E5] font-medium">Conecte sua Steam</p>
              <p className="text-[11px] text-[#525252]">Veja seus jogos comprados e horas jogadas</p>
            </div>
          </div>
          <Link to="/library" className="px-4 py-2 bg-[#1B2838] text-white text-xs font-semibold rounded-lg hover:bg-[#2A475E] transition-all">
            Conectar
          </Link>
        </div>
      )}

      {backlog.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E5E5E5]">Proximos da fila</h3>
              <p className="text-[11px] text-[#525252] mt-0.5">Jogos que voce quer jogar</p>
            </div>
            <Link to="/library" className="text-[11px] text-[#DC2626] hover:text-[#EF4444] font-medium transition-colors">Ver todos</Link>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {backlog.map((game) => (
              <Link key={game.id} to={`/game/${game.id}?source=library`} className="flex-shrink-0 w-52 group">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#1A1A1A] hover:border-[#DC2626]/30 transition-all">
                  <img
                    src={game.image_url || "https://placehold.co/616x353/141414/262626?text=?"}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-[#737373] font-medium mt-2 line-clamp-1 group-hover:text-white transition-colors">{game.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recentActivity.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#E5E5E5] mb-4">Atividade recente</h3>
          <div className="glass rounded-xl divide-y divide-[#262626]/40">
            {recentActivity.map((game) => (
              <Link key={game.id} to={`/game/${game.id}?source=library`}
                className="flex items-center gap-3 p-3 hover:bg-[#1A1A1A] transition-colors first:rounded-t-xl last:rounded-b-xl">
                <img src={game.image_url || "https://placehold.co/48x48/141414/262626?text=?"} alt=""
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#E5E5E5] font-medium truncate">{game.title}</p>
                  <p className="text-[11px] text-[#525252]">Adicionado em {new Date(game.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <StatusBadge status={game.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;