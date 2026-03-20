import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getGameById, getGameDetails, updateGame, deleteGame, addGame } from "../services/api";
import StatusBadge from "../components/StatusBadge";

const STATUSES = [
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Zerado" },
  { value: "wishlist", label: "Quero jogar" },
  { value: "dropped", label: "Largado" },
];

function GameDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const source = searchParams.get("source") || "library";

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ status: "", rating: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadGame() {
      setLoading(true);
      try {
        let data;
        if (source === "search") {
          data = await getGameDetails(id);
        } else {
          data = await getGameById(id);
        }
        setGame(data);
        setFormData({
          status: data.status || "wishlist",
          rating: data.rating || "",
          notes: data.notes || "",
        });
      } catch {
        setGame(null);
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [id, source]);

  async function handleSave() {
    setSaving(true);
    try {
      const updateData = { status: formData.status };
      if (formData.rating) updateData.rating = Number(formData.rating);
      if (formData.notes) updateData.notes = formData.notes;

      const updated = await updateGame(game.id, updateData);
      setGame(updated);
      setEditing(false);
    } catch {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Tem certeza que quer remover esse jogo da biblioteca?")) return;
    try {
      await deleteGame(game.id);
      navigate("/library");
    } catch {
      alert("Erro ao remover");
    }
  }

  async function handleAdd() {
    try {
      const added = await addGame({
        rawg_id: game.rawg_id,
        title: game.title,
        image_url: game.image_url,
        status: "wishlist",
      });
      navigate(`/game/${added.id}?source=library`);
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Jogo ja esta na biblioteca");
      }
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-slate-800 rounded-lg" />
        <div className="h-8 bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-800 rounded w-3/4" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-lg">Jogo nao encontrado</p>
      </div>
    );
  }

  const imageUrl = game.image_url || "https://placehold.co/800x400/1e293b/64748b?text=Sem+imagem";

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
      >
        ← Voltar
      </button>

      <img
        src={imageUrl}
        alt={game.title}
        className="w-full h-64 sm:h-80 object-cover rounded-lg mb-6"
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
          <div className="flex flex-wrap gap-2">
            {game.genres?.map((genre) => (
              <span key={genre} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
            {game.status && <StatusBadge status={game.status} />}
          </div>
        </div>

        <div className="flex gap-2">
          {source === "search" && !game.in_library && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Adicionar a biblioteca
            </button>
          )}

          {source === "library" && !editing && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600/10 text-red-400 text-sm rounded-lg hover:bg-red-600/20 transition-colors"
              >
                Remover
              </button>
            </>
          )}
        </div>
      </div>

      {game.metacritic && (
        <span className="inline-block text-sm font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded mb-4">
          Metacritic {game.metacritic}
        </span>
      )}

      {game.platforms && (
        <p className="text-slate-500 text-sm mb-4">
          {game.platforms.join(" · ")}
        </p>
      )}

      {game.description && (
        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-3xl">
          {game.description.slice(0, 500)}
          {game.description.length > 500 && "..."}
        </p>
      )}

      {game.screenshots && game.screenshots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {game.screenshots.map((url, i) => (
            <img key={i} src={url} alt="" className="rounded-lg w-full h-32 object-cover" />
          ))}
        </div>
      )}

      {editing && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mt-6">
          <h3 className="text-white font-medium mb-4">Editar jogo</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-1">Nota (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-1">Anotacoes</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetail;