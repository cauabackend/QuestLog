import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== BIBLIOTECA (CRUD) ==========

export async function getGames(status = null, sort = "created_at", order = "desc") {
  const params = { sort, order };
  if (status) params.status = status;
  const { data } = await api.get("/api/games", { params });
  return data;
}

export async function getGameById(id) {
  const { data } = await api.get(`/api/games/${id}`);
  return data;
}

export async function addGame(gameData) {
  const { data } = await api.post("/api/games", gameData);
  return data;
}

export async function updateGame(id, updateData) {
  const { data } = await api.patch(`/api/games/${id}`, updateData);
  return data;
}

export async function deleteGame(id) {
  await api.delete(`/api/games/${id}`);
}

// ========== BUSCA (RAWG) ==========

export async function searchGames(query, page = 1, pageSize = 12) {
  const { data } = await api.get("/api/search", {
    params: { q: query, page, page_size: pageSize },
  });
  return data;
}

export async function getGameDetails(rawgId) {
  const { data } = await api.get(`/api/search/${rawgId}`);
  return data;
}

// ========== STEAM ==========

export async function getSteamGames(steamId) {
  const { data } = await api.get(`/api/steam/games/${steamId}`);
  return data;
}

export async function getSteamProfile(steamId) {
  const { data } = await api.get(`/api/steam/profile/${steamId}`);
  return data;
}