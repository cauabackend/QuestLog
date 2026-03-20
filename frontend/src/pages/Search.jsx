import { useState, useEffect } from "react";
import { searchGames, addGame } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import GameCard from "../components/GameCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    async function doSearch() {
      setLoading(true);
      try {
        const data = await searchGames(debouncedQuery);
        setResults(data.results);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    doSearch();
  }, [debouncedQuery]);

  async function handleAdd(game) {
    try {
      await addGame({
        rawg_id: game.rawg_id,
        title: game.title,
        image_url: game.image_url,
        status: "wishlist",
      });
      setResults((prev) =>
        prev.map((g) =>
          g.rawg_id === game.rawg_id ? { ...g, in_library: true } : g
        )
      );
    } catch (err) {
      if (err.response?.status === 409) {
        setResults((prev) =>
          prev.map((g) =>
            g.rawg_id === game.rawg_id ? { ...g, in_library: true } : g
          )
        );
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Buscar jogos</h2>

      <div className="mb-8">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {loading && <LoadingSkeleton />}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((game) => (
            <GameCard key={game.rawg_id} game={game} onAdd={handleAdd} />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">Nenhum jogo encontrado para "{debouncedQuery}"</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">Digite pelo menos 2 caracteres para buscar</p>
        </div>
      )}
    </div>
  );
}

export default Search;