import { useState, useEffect } from "react";
import { getSteamGames, getSteamProfile } from "../services/api";
import LoadingSkeleton from "../components/LoadingSkeleton";

function SteamLibrary() {
  const [steamId, setSteamId] = useState(() => localStorage.getItem("questlog_steam_id") || "");
  const [inputId, setInputId] = useState(steamId);
  const [games, setGames] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadSteamData(id) {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [gamesData, profileData] = await Promise.all([
        getSteamGames(id),
        getSteamProfile(id),
      ]);
      setGames(gamesData.results);
      setProfile(profileData);
      setSteamId(id);
      localStorage.setItem("questlog_steam_id", id);
    } catch {
      setError("Nao foi possivel carregar. Verifique o Steam ID e se o perfil e publico.");
      setGames([]);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (steamId) loadSteamData(steamId);
  }, []);

  function handleConnect(e) {
    e.preventDefault();
    if (inputId.trim()) loadSteamData(inputId.trim());
  }

  function handleDisconnect() {
    setSteamId("");
    setInputId("");
    setGames([]);
    setProfile(null);
    localStorage.removeItem("questlog_steam_id");
  }

  const filtered = search
    ? games.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()))
    : games;

  const totalHours = games.reduce((sum, g) => sum + g.playtime_hours, 0);

  if (!steamId) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#E5E5E5] mb-1">Steam</h2>
          <p className="text-[13px] text-[#525252]">Conecte sua conta Steam para ver seus jogos comprados</p>
        </div>

        <div className="glass rounded-xl p-8 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1B2838] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.04 2 11.03c0 3.97 2.84 7.31 6.68 8.45l3.69-2.13c.34-.2.73-.3 1.13-.3h.01c2.76 0 5-1.79 5-4s-2.24-4-5-4c-.28 0-.56.02-.83.07L9 11.03v-.01C9 8.25 10.34 6 12 6c1.66 0 3 2.24 3 5.02 0 .35-.03.69-.08 1.02 1.78.63 3.08 2.15 3.08 3.99 0 2.21-2.24 4-5 4-.39 0-.77-.04-1.13-.11L8 22c1.23.64 2.57 1 4 1 5.52 0 10-3.98 10-8.97C22 6.04 17.52 2 12 2z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-[#E5E5E5] font-semibold text-sm">Conectar Steam</h3>
              <p className="text-[11px] text-[#525252]">Informe seu Steam ID de 17 digitos</p>
            </div>
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="76561198000000000"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-[#E5E5E5] text-sm placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50"
              />
              <p className="text-[10px] text-[#525252] mt-2">
                Encontre seu Steam ID em steamid.io — o perfil precisa estar publico
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-all"
            >
              Conectar
            </button>
          </form>

          {error && <p className="text-[#EF4444] text-xs mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#E5E5E5] mb-1">Meus jogos Steam</h2>
          <p className="text-[13px] text-[#525252]">Jogos comprados na sua conta</p>
        </div>
        {profile && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-[#E5E5E5] font-medium">{profile.name}</p>
              <button onClick={handleDisconnect} className="text-[10px] text-[#DC2626] hover:text-[#EF4444] transition-colors">
                Desconectar
              </button>
            </div>
            <img src={profile.avatar} alt="" className="w-9 h-9 rounded-lg" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="glass rounded-xl p-4">
          <p className="text-2xl font-bold text-white tabular-nums">{games.length}</p>
          <p className="text-[11px] text-[#525252] mt-1">jogos na Steam</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-2xl font-bold text-[#DC2626] tabular-nums">{Math.round(totalHours)}</p>
          <p className="text-[11px] text-[#525252] mt-1">horas jogadas</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{games.filter((g) => g.playtime_hours === 0).length}</p>
          <p className="text-[11px] text-[#525252] mt-1">nunca jogados</p>
        </div>
      </div>

      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar jogos Steam..."
          className="w-full pl-12 pr-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#E5E5E5] placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50 text-sm"
        />
      </div>

      {loading && <LoadingSkeleton count={12} />}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((game) => (
            <div key={game.steam_appid} className="group bg-[#141414] rounded-xl overflow-hidden border border-[#1A1A1A] hover:border-[#DC2626]/30 transition-all duration-300 hover:-translate-y-1">
              <a
                href={`https://store.steampowered.com/app/${game.steam_appid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-[460/215] overflow-hidden">
                  <img
                    src={game.image_url}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "https://placehold.co/460x215/141414/262626?text=Sem+imagem"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                </div>
              </a>

              <div className="px-3 py-2.5">
                <h3 className="text-[12px] text-[#E5E5E5] font-medium line-clamp-1 mb-1">{game.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#525252]">
                    {game.playtime_hours > 0 ? `${game.playtime_hours}h jogadas` : "Nunca jogado"}
                  </span>
                  {game.playtime_hours > 0 && (
                    <div className="w-16 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#DC2626] rounded-full"
                        style={{ width: `${Math.min((game.playtime_hours / 100) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && games.length > 0 && (
        <div className="text-center py-16">
          <p className="text-[#737373]">Nenhum jogo encontrado para "{search}"</p>
        </div>
      )}
    </div>
  );
}

export default SteamLibrary;