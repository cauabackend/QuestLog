import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGames } from "../services/api";

function Home() {
  const [stats, setStats] = useState({ total: 0, playing: 0, completed: 0, wishlist: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const games = await getGames();
        setStats({
          total: games.length,
          playing: games.filter((g) => g.status === "playing").length,
          completed: games.filter((g) => g.status === "completed").length,
          wishlist: games.filter((g) => g.status === "wishlist").length,
        });
      } catch {
        // API offline
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-5xl font-bold text-white mb-4">
        Quest<span className="text-indigo-500">Log</span>
      </h1>
      <p className="text-slate-400 text-lg mb-8 max-w-md">
        Organize sua biblioteca de jogos. Acompanhe o que esta jogando, o que ja zerou e o que quer jogar.
      </p>

      <div className="flex gap-4 mb-12">
        <Link
          to="/search"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Buscar jogos
        </Link>
        <Link
          to="/library"
          className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          Minha biblioteca
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-slate-400">Total</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-2xl font-bold text-green-400">{stats.playing}</p>
          <p className="text-sm text-slate-400">Jogando</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
          <p className="text-sm text-slate-400">Zerados</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-2xl font-bold text-amber-400">{stats.wishlist}</p>
          <p className="text-sm text-slate-400">Quero jogar</p>
        </div>
      </div>
    </div>
  );
}

export default Home;