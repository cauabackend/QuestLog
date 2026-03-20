import { useState, useEffect } from "react";
import { getGames, getSteamGames, getSteamProfile } from "../services/api";
import GameCard from "../components/GameCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const STATUS_FILTERS = [
  { value: null, label: "Todos" },
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Zerados" },
  { value: "wishlist", label: "Na fila" },
  { value: "dropped", label: "Largados" },
];

function Library() {
  const [games, setGames] = useState([]);
  const [steamGames, setSteamGames] = useState([]);
  const [steamProfile, setSteamProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState("all");
  const [activeStatus, setActiveStatus] = useState(null);
  const [search, setSearch] = useState("");

  const [showSteamForm, setShowSteamForm] = useState(false);
  const [steamInput, setSteamInput] = useState("");
  const [steamError, setSteamError] = useState("");
  const [steamLoading, setSteamLoading] = useState(false);

  async function loadSteam(id) {
    if (!id) return;
    setSteamLoading(true);
    setSteamError("");
    try {
      const [sg, sp] = await Promise.all([getSteamGames(id), getSteamProfile(id)]);
      setSteamGames(sg.results || []);
      setSteamProfile(sp);
      localStorage.setItem("questlog_steam_id", id);
      setShowSteamForm(false);
    } catch {
      setSteamError("Nao foi possivel carregar. Verifique o Steam ID e se o perfil e publico.");
      setSteamGames([]);
      setSteamProfile(null);
    } finally {
      setSteamLoading(false);
    }
  }

  function handleDisconnect() {
    setSteamGames([]);
    setSteamProfile(null);
    localStorage.removeItem("questlog_steam_id");
  }

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try { setGames(await getGames()); } catch { setGames([]); }

      const savedId = localStorage.getItem("questlog_steam_id");
      if (savedId) await loadSteam(savedId);

      setLoading(false);
    }
    loadAll();
  }, []);

  const steamConnected = steamGames.length > 0;
  let filteredGames = [];
  let filteredSteam = [];

  if (activeSource === "all" || activeSource === "questlog") {
    filteredGames = activeStatus ? games.filter((g) => g.status === activeStatus) : games;
  }
  if (activeSource === "all" || activeSource === "steam") {
    filteredSteam = steamGames;
  }
  if (search) {
    const q = search.toLowerCase();
    filteredGames = filteredGames.filter((g) => g.title.toLowerCase().includes(q));
    filteredSteam = filteredSteam.filter((g) => g.title.toLowerCase().includes(q));
  }

  const totalCount = filteredGames.length + filteredSteam.length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#E5E5E5] mb-1">Minha biblioteca</h2>
          <p className="text-[13px] text-[#525252]">{totalCount} titulo{totalCount !== 1 && "s"}</p>
        </div>

        {steamConnected && steamProfile && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-[#E5E5E5] font-medium">{steamProfile.name}</p>
              <button onClick={handleDisconnect} className="text-[10px] text-[#DC2626] hover:text-[#EF4444] transition-colors">
                Desconectar Steam
              </button>
            </div>
            <img src={steamProfile.avatar} alt="" className="w-9 h-9 rounded-lg" />
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => { setActiveSource("all"); setActiveStatus(null); }}
          className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${activeSource === "all" ? "bg-[#DC2626] text-white" : "glass text-[#737373] hover:text-white"}`}>
          Todos
        </button>
        <button onClick={() => { setActiveSource("questlog"); setActiveStatus(null); }}
          className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 flex items-center gap-1.5 ${activeSource === "questlog" ? "bg-[#DC2626] text-white" : "glass text-[#737373] hover:text-white"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" /> QuestLog <span className="text-[10px] opacity-60">{games.length}</span>
        </button>
        {steamConnected && (
          <button onClick={() => { setActiveSource("steam"); setActiveStatus(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 flex items-center gap-1.5 ${activeSource === "steam" ? "bg-[#1B2838] text-white" : "glass text-[#737373] hover:text-white"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B9CFC]" /> Steam <span className="text-[10px] opacity-60">{steamGames.length}</span>
          </button>
        )}
        {!steamConnected && (
          <button onClick={() => setShowSteamForm(!showSteamForm)}
            className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 glass text-[#737373] hover:text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B9CFC]" /> + Conectar Steam
          </button>
        )}
      </div>

      {showSteamForm && !steamConnected && (
        <div className="glass rounded-xl p-5 mb-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#1B2838] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.04 2 11.03c0 3.97 2.84 7.31 6.68 8.45l3.69-2.13c.34-.2.73-.3 1.13-.3h.01c2.76 0 5-1.79 5-4s-2.24-4-5-4c-.28 0-.56.02-.83.07L9 11.03v-.01C9 8.25 10.34 6 12 6c1.66 0 3 2.24 3 5.02 0 .35-.03.69-.08 1.02 1.78.63 3.08 2.15 3.08 3.99 0 2.21-2.24 4-5 4-.39 0-.77-.04-1.13-.11L8 22c1.23.64 2.57 1 4 1 5.52 0 10-3.98 10-8.97C22 6.04 17.52 2 12 2z"/></svg>
            </div>
            <div>
              <h3 className="text-[#E5E5E5] font-semibold text-sm">Conectar Steam</h3>
              <p className="text-[10px] text-[#525252]">Informe seu Steam ID de 17 digitos</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); loadSteam(steamInput.trim()); }} className="flex gap-2">
            <input type="text" value={steamInput} onChange={(e) => setSteamInput(e.target.value)} placeholder="76561198000000000"
              className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-[#E5E5E5] text-sm placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50" />
            <button type="submit" disabled={steamLoading}
              className="px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-all disabled:opacity-50">
              {steamLoading ? "..." : "Conectar"}
            </button>
          </form>
          <p className="text-[10px] text-[#525252] mt-2">Encontre em steamid.io — perfil precisa estar publico</p>
          {steamError && <p className="text-[#EF4444] text-xs mt-2">{steamError}</p>}
        </div>
      )}

      {activeSource !== "steam" && (
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button key={f.label} onClick={() => setActiveStatus(f.value)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${activeStatus === f.value ? "bg-[#262626] text-white" : "text-[#525252] hover:text-[#A3A3A3]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtrar por nome..."
          className="w-full pl-11 pr-4 py-2.5 bg-[#141414] border border-[#262626] rounded-xl text-[#E5E5E5] placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50 text-sm" />
      </div>

      {loading && <LoadingSkeleton />}

      {!loading && (
        <div className="space-y-8">
          {filteredGames.length > 0 && (
            <div>
              {activeSource === "all" && steamConnected && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <h3 className="text-[13px] font-semibold text-[#A3A3A3] uppercase tracking-wider">QuestLog</h3>
                  <span className="text-[11px] text-[#525252]">{filteredGames.length}</span>
                  <div className="h-px flex-1 bg-[#1A1A1A]" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.map((game) => <GameCard key={`ql-${game.id}`} game={game} showStatus />)}
              </div>
            </div>
          )}

          {filteredSteam.length > 0 && (
            <div>
              {activeSource === "all" && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B9CFC]" />
                  <h3 className="text-[13px] font-semibold text-[#A3A3A3] uppercase tracking-wider">Steam</h3>
                  <span className="text-[11px] text-[#525252]">{filteredSteam.length}</span>
                  <div className="h-px flex-1 bg-[#1A1A1A]" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSteam.map((game) => <GameCard key={`st-${game.steam_appid}`} game={game} />)}
              </div>
            </div>
          )}

          {totalCount === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878" />
                </svg>
              </div>
              {search ? (
                <><p className="text-[#737373]">Nenhum jogo encontrado para "{search}"</p><p className="text-[#525252] text-sm mt-1">Tente outro termo</p></>
              ) : (
                <><p className="text-[#737373]">Biblioteca vazia</p><p className="text-[#525252] text-sm mt-1">Busque jogos ou conecte sua Steam</p></>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Library;