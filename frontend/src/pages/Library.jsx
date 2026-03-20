import { useState, useEffect } from "react";
import { getGames } from "../services/api";
import GameCard from "../components/GameCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const FILTERS = [
  { value: null, label: "Todos" },
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Zerados" },
  { value: "wishlist", label: "Na fila" },
  { value: "dropped", label: "Largados" },
];

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      try { setGames(await getGames(activeFilter)); } catch { setGames([]); }
      finally { setLoading(false); }
    }
    loadGames();
  }, [activeFilter]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#E5E5E5] mb-1">Minha biblioteca</h2>
        <p className="text-[13px] text-[#525252]">{games.length} titulo{games.length !== 1 && "s"} na colecao</p>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f.label} onClick={() => setActiveFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
              activeFilter === f.value ? "bg-[#DC2626] text-white" : "glass text-[#737373] hover:text-white"
            }`}>
            {f.label}
          </button>
        ))}
      </div>
      {loading && <LoadingSkeleton />}
      {!loading && games.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((game) => <GameCard key={game.id} game={game} showStatus />)}
        </div>
      )}
      {!loading && games.length === 0 && (
        <div className="text-center py-20">
          <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878" />
            </svg>
          </div>
          <p className="text-[#737373]">Biblioteca vazia</p>
          <p className="text-[#525252] text-sm mt-1">Busque jogos para comecar</p>
        </div>
      )}
    </div>
  );
}

export default Library;