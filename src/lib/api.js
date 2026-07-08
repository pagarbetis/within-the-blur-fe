import axios from "axios";

// Cookie-based auth: the backend sets HTTPOnly access/refresh cookies on
// register/login, so we always send credentials. No token in localStorage.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function friendlyError(err) {
  const errMsg = err?.response?.data?.error || err?.response?.data?.detail;
  if (typeof errMsg === "string") return errMsg;
  if (err?.response?.status === 429) return "Terlalu banyak percobaan. Coba lagi dalam 15 menit.";
  if (err?.code === "ERR_NETWORK") return "Tidak bisa terhubung ke server. Coba lagi sebentar.";
  return "Terjadi kesalahan. Coba lagi.";
}

export async function registerUser({ email, password, name }) {
  try {
    const { data } = await apiClient.post("/auth/register", { email, password, name });
    return data.user;
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export async function loginUser({ email, password }) {
  try {
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data.user;
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export async function logoutUser() {
  try {
    await apiClient.post("/auth/logout");
  } catch (err) {
    // ignore — cookies may already be gone
  }
}

export async function fetchMe() {
  const { data } = await apiClient.get("/auth/me");
  return data.user;
}

export async function updateProfileColor(color) {
  const { data } = await apiClient.patch("/profile/color", { color });
  return data.user;
}

// ---------- Journal ----------
export async function listJournalEntries() {
  const { data } = await apiClient.get("/journal");
  return data.entries;
}

export async function createJournalEntry({ body, title, mood, unlockAt }) {
  try {
    const { data } = await apiClient.post("/journal", { body, title, mood, unlockAt });
    return data.entry;
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export async function deleteJournalEntry(id) {
  await apiClient.delete(`/journal/${id}`);
}

// ---------- Kuis ----------
export async function saveKuisResult({ dominant, counts }) {
  const { data } = await apiClient.post("/kuis/result", { dominant, counts });
  return data.result;
}

export async function fetchLatestKuis() {
  const { data } = await apiClient.get("/kuis/latest");
  return data.result;
}

// ---------- Cek Diri ----------
export async function saveCekdiriEntry({ feeling, note }) {
  try {
    const { data } = await apiClient.post("/cekdiri", { feeling, note });
    return data.entry;
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export async function listCekdiriEntries(days = 7) {
  const { data } = await apiClient.get("/cekdiri", { params: { days } });
  return data.entries;
}

// ---------- Stats ----------
export async function fetchStats() {
  const { data } = await apiClient.get("/stats");
  return data;
}
