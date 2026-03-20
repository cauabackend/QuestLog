import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getGameById, getGameDetails, updateGame, deleteGame, addGame } from "../services/api";
import StatusBadge from "../components/StatusBadge";

const STATUSES = [
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Zerado" },
  { value: "wishlist", label: "Na fila" },
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
        const data = source === "search" ? await getGameDetails(id) : await getGameById(id);
        setGame(data);
        setFormData({ status: data.status || "wishlist", rating: data.rating || "", notes: data.notes || "" });
      } catch { setGame(null); }
      finally { setLoading(false); }
    }
    loadGame();
  }, [id, source]);

  async function handleSave() {
    setSaving(true);
    try {
      const d = { status: formData.status };
      if (formData.rating) d.rating = Number(formData.rating);
      if (formData.notes) d.notes = formData.notes;
      setGame(await updateGame(game.id, d));
      setEditing(false);
    } catch { alert("Erro ao salvar"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!window.confirm("Remover esse jogo da biblioteca?")) return;
    try { await deleteGame(game.id); navigate("/library"); } catch { alert("Erro ao remover"); }
  }

  async function handleAdd() {
    try {
      const added = await addGame({ rawg_id: game.rawg_id, title: game.title, image_url: game.image_url, status: "wishlist" });
      navigate(`/game/${added.id}?source=library`);
    } catch (err) { if (err.response?.status === 409) alert("Jogo ja esta na biblioteca"); }
  }

  if (loading) return (
    <div className="animate-pulse space-y-6"><div className="h-72 bg-[#141414] rounded-2xl" /><div className="h-6 bg-[#141414] rounded w-1/3" /></div>
  );
  if (!game) return <div className="text-center py-20"><p className="text-[#737373]">Jogo nao encontrado</p></div>;

  const imageUrl = game.image_url || "https://placehold.co/1200x500/141414/262626?text=Sem+imagem";

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-[#525252] hover:text-[#E5E5E5] text-sm mb-5 flex items-center gap-1.5 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Voltar
      </button>

      <div className="relative rounded-2xl overflow-hidden mb-6">
        <img src={imageUrl} alt={game.title} className="w-full h-64 sm:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{game.title}</h1>
          <div className="flex flex-wrap gap-2">
            {game.genres?.map((g) => <span key={g} className="text-[11px] bg-white/10 backdrop-blur text-white/80 px-2.5 py-0.5 rounded-full">{g}</span>)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        {game.status && <StatusBadge status={game.status} />}
        {game.metacritic && <span className="text-[12px] font-bold bg-green-500/10 text-green-400 border border-green-400/20 px-2.5 py-0.5 rounded-full">Metacritic {game.metacritic}</span>}
        {game.released && <span className="text-[12px] text-[#525252]">{game.released}</span>}
        {game.rating && <span className="text-[12px] text-[#737373]">{"★".repeat(game.rating)}{"☆".repeat(5 - game.rating)}</span>}
      </div>

      <div className="flex gap-2 mb-6">
        {source === "search" && !game.in_library && (
          <button onClick={handleAdd} className="px-5 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-all glow-accent">+ Adicionar</button>
        )}
        {source === "library" && !editing && (
          <>
            <button onClick={() => setEditing(true)} className="px-4 py-2 glass text-sm text-[#A3A3A3] rounded-lg hover:bg-[#1A1A1A] transition-all">Editar</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-[#DC2626]/10 text-[#EF4444] text-sm rounded-lg hover:bg-[#DC2626]/20 transition-all border border-[#DC2626]/20">Remover</button>
          </>
        )}
      </div>

      {game.platforms && <p className="text-[#525252] text-sm mb-5">{game.platforms.join(" · ")}</p>}

      {game.description && (
        <div className="glass rounded-xl p-5 mb-6">
          <h3 className="text-[#E5E5E5] font-semibold text-sm mb-3">Sobre</h3>
          <p className="text-[#737373] text-sm leading-relaxed">{game.description.slice(0, 600)}{game.description.length > 600 && "..."}</p>
        </div>
      )}

      {game.screenshots?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[#E5E5E5] font-semibold text-sm mb-3">Screenshots</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {game.screenshots.map((url, i) => <img key={i} src={url} alt="" className="rounded-xl w-full h-32 object-cover border border-[#1A1A1A]" />)}
          </div>
        </div>
      )}

      {editing && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-[#E5E5E5] font-semibold mb-4">Editar jogo</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[12px] text-[#525252] block mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-[#E5E5E5] text-sm focus:outline-none focus:border-[#DC2626]/50">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-[#525252] block mb-1">Nota (1-5)</label>
              <input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-[#E5E5E5] text-sm focus:outline-none focus:border-[#DC2626]/50" />
            </div>
            <div>
              <label className="text-[12px] text-[#525252] block mb-1">Anotacoes</label>
              <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-[#E5E5E5] text-sm focus:outline-none focus:border-[#DC2626]/50 resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-all disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 glass text-[#737373] text-sm rounded-lg hover:bg-[#1A1A1A] transition-all">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetail;