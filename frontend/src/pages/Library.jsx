import { useState, useEffect } from "react";
import { getGames } from "../services/api";
import GameCard from "../components/GameCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const FILTERS = [
  { value: null, label: "Todos" },
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Zerados" },
  { value: "wishlist", label: "Quero jogar" },
  { value: "dropped", label: "Largados" },
];

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      try {
        const data = await getGames(activeFilter);
        setGames(data);
      } catch {
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, [activeFilter]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Minha biblioteca</h2>

      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? "bg-indigo-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSkeleton />}

      {!loading && games.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} showStatus />
          ))}
        </div>
      )}

      {!loading && games.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">Nenhum jogo na biblioteca ainda</p>
          <p className="text-slate-600 text-sm mt-2">
            Use a pagina de busca para encontrar e adicionar jogos
          </p>
        </div>
      )}
    </div>
  );
}

export default Library;