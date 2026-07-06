// Client-side local store for Within the Blur.
// Everything lives in localStorage — no backend, no login.
// Shape:
//   wtb:journal       → [ { id, title, body, mood, unlockAt?, createdAt } ]
//   wtb:kuis          → { dominant, counts, createdAt }
//   wtb:cekdiri       → [ { id, feeling, note, createdAt } ]
//   wtb:profileColor  → "terracotta" | "mustard" | "sage" | "kabut" | "senja" | "ink"

const KEY = {
  JOURNAL: "wtb:journal",
  KUIS: "wtb:kuis",
  CEKDIRI: "wtb:cekdiri",
  COLOR: "wtb:profileColor",
};

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[localStore] read failed for ${key}:`, e);
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // likely quota / private mode
    console.warn(`[localStore] write failed for ${key}:`, e);
  }
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Journal ----------
export function getJournal() {
  const arr = safeRead(KEY.JOURNAL, []);
  // sort newest first
  return arr.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addJournal({ body, title, mood, unlockAt }) {
  const entry = {
    id: uid(),
    body: String(body || "").trim(),
    title: String(title || "").trim() || "Tanpa Judul",
    mood: mood || "tenang",
    unlockAt: unlockAt || null,
    createdAt: new Date().toISOString(),
  };
  const arr = safeRead(KEY.JOURNAL, []);
  arr.push(entry);
  safeWrite(KEY.JOURNAL, arr);
  return entry;
}

export function removeJournal(id) {
  const arr = safeRead(KEY.JOURNAL, []).filter((e) => e.id !== id);
  safeWrite(KEY.JOURNAL, arr);
}

export function isLocked(entry) {
  if (!entry?.unlockAt) return false;
  return new Date(entry.unlockAt).getTime() > Date.now();
}

// ---------- Kuis ----------
export function getKuis() {
  return safeRead(KEY.KUIS, null);
}
export function setKuis({ dominant, counts }) {
  const doc = { dominant, counts, createdAt: new Date().toISOString() };
  safeWrite(KEY.KUIS, doc);
  return doc;
}

// ---------- Cek Diri ----------
export function getCekdiri(days = 60) {
  const since = Date.now() - days * 86400000;
  return safeRead(KEY.CEKDIRI, [])
    .filter((e) => new Date(e.createdAt).getTime() >= since)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
export function addCekdiri({ feeling, note }) {
  const entry = {
    id: uid(),
    feeling: String(feeling || "").trim(),
    note: (note && String(note).trim()) || null,
    createdAt: new Date().toISOString(),
  };
  const arr = safeRead(KEY.CEKDIRI, []);
  arr.push(entry);
  safeWrite(KEY.CEKDIRI, arr);
  return entry;
}

// ---------- Profile color ----------
export function getProfileColor() {
  return safeRead(KEY.COLOR, "terracotta");
}
export function setProfileColor(color) {
  safeWrite(KEY.COLOR, color);
  return color;
}

// ---------- Stats (streak + 7-day mood chart) ----------
function dayKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const DAY_LABELS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
// convert to Mon-first: index = (getDay + 6) % 7 → 0..6 == Sen..Min
const LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function getStats() {
  const cek = getCekdiri(60);
  const jur = getJournal();

  // Per-day sets & maps
  const cekDays = new Set();
  const cekByDay = {};
  const jurByDay = {};
  for (const c of cek) {
    const k = dayKey(c.createdAt);
    cekDays.add(k);
    if (!cekByDay[k]) cekByDay[k] = c.feeling;
  }
  for (const j of jur) {
    const k = dayKey(j.createdAt);
    if (!jurByDay[k]) jurByDay[k] = j.mood;
  }

  // Streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dayKey(today.toISOString());
  let current = 0;
  let d = new Date(today);
  if (!cekDays.has(dayKey(d.toISOString()))) {
    d = new Date(d.getTime() - 86400000);
  }
  while (cekDays.has(dayKey(d.toISOString()))) {
    current += 1;
    d = new Date(d.getTime() - 86400000);
  }

  const sorted = Array.from(cekDays).sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const k of sorted) {
    const cur = new Date(k);
    if (prev && Math.round((cur - prev) / 86400000) === 1) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    prev = cur;
  }

  // 7-day chart
  const chart = [];
  for (let i = 6; i >= 0; i--) {
    const d0 = new Date(today.getTime() - i * 86400000);
    const k = dayKey(d0.toISOString());
    const mood = cekByDay[k] || jurByDay[k] || null;
    chart.push({
      date: k,
      label: LABELS[(d0.getDay() + 6) % 7],
      mood,
      source: cekByDay[k] ? "cekdiri" : (jurByDay[k] ? "journal" : null),
    });
  }

  return {
    streak: { current, longest, today: cekDays.has(todayKey) },
    chart,
  };
}
