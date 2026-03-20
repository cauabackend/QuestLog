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
  const [count, setCount] = useState(0);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); setSearched(false); setCount(0); return; }
    async function doSearch() {
      setLoading(true);
      try { const data = await searchGames(debouncedQuery); setResults(data.results); setCount(data.count); setSearched(true); }
      catch { setResults([]); }
      finally { setLoading(false); }
    }
    doSearch();
  }, [debouncedQuery]);

  async function handleAdd(game) {
    try {
      await addGame({ rawg_id: game.rawg_id, title: game.title, image_url: game.image_url, status: "wishlist" });
      setResults((prev) => prev.map((g) => g.rawg_id === game.rawg_id ? { ...g, in_library: true } : g));
    } catch (err) {
      if (err.response?.status === 409) setResults((prev) => prev.map((g) => g.rawg_id === game.rawg_id ? { ...g, in_library: true } : g));
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#E5E5E5] mb-1">Buscar jogos</h2>
        <p className="text-[13px] text-[#525252]">Encontre jogos e adicione a sua biblioteca</p>
      </div>
      <div className="mb-6"><SearchBar value={query} onChange={setQuery} /></div>
      {searched && !loading && <p className="text-[#525252] text-[13px] mb-5">{count} resultado{count !== 1 && "s"} para "<span className="text-[#A3A3A3]">{debouncedQuery}</span>"</p>}
      {loading && <LoadingSkeleton />}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((game) => <GameCard key={game.rawg_id} game={game} onAdd={handleAdd} />)}
        </div>
      )}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-20"><p className="text-[#737373]">Nenhum jogo encontrado</p><p className="text-[#525252] text-sm mt-1">Tente outro termo</p></div>
      )}
      {!loading && !searched && (
        <div className="text-center py-20">
          <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p className="text-[#525252] text-sm">Digite pelo menos 2 caracteres</p>
        </div>
      )}
    </div>
  );
}

export default Search;