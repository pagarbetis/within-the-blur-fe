import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Save, Calendar, Trash2, Lock, Mail, Clock } from "lucide-react";
import Reveal from "@/components/Reveal";
import { TID } from "@/constants/testIds";
import PageNav from "@/components/PageNav";
import { getJournal, addJournal, removeJournal, isLocked } from "@/lib/localStore";
import { useAuth } from "@/context/AuthContext";
import { listJournalEntries, createJournalEntry, deleteJournalEntry } from "@/lib/api";

const MOODS = [
 { k: "tenang", label: "Tenang", color: "#aac8b7" },
 { k: "syukur", label: "Bersyukur", color: "#e1b049" },
 { k: "lelah", label: "Lelah", color: "#c24c2b" },
 { k: "harap", label: "Penuh Harap", color: "#e492a5" },
 { k: "kosong", label: "Kosong", color: "#8a857a" },
 { k: "berani", label: "Berani", color: "#e36c49" },
];

const LETTER_PRESETS = [
 { d: 30, label: "30 hari" },
 { d: 90, label: "90 hari" },
 { d: 180, label: "6 bulan" },
 { d: 365, label: "1 tahun" },
];

function fmtDate(iso) {
 try {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
   weekday: "long",
   day: "numeric",
   month: "long",
   year: "numeric",
  });
 } catch {
  return iso;
 }
}

function fmtCountdown(unlockIso) {
 const now = Date.now();
 const target = new Date(unlockIso).getTime();
 const diff = Math.max(0, target - now);
 const days = Math.floor(diff / 86400000);
 const hours = Math.floor((diff % 86400000) / 3600000);
 if (days >= 1) return `${days} hari lagi`;
 if (hours >= 1) return `${hours} jam lagi`;
 return "Sebentar lagi";
}

export default function Jurnal() {
 const { user } = useAuth();
 const [title, setTitle] = useState("");
 const [body, setBody] = useState("");
 const [mood, setMood] = useState("tenang");
 const [letterMode, setLetterMode] = useState(false);
 const [letterDays, setLetterDays] = useState(30);
 const [entries, setEntries] = useState([]);
 const [loadError, setLoadError] = useState("");

 useEffect(() => {
  let active = true;
  (async () => {
   if (user) {
    try {
     const remote = await listJournalEntries();
     if (active) setEntries(remote);
     return;
    } catch (e) {
     if (active) setLoadError("Gagal memuat jurnal dari server. Menampilkan versi perangkat ini.");
    }
   }
   if (active) setEntries(getJournal().map((e) => ({ ...e, locked: isLocked(e) })));
  })();
  return () => { active = false; };
 }, [user]);

 const save = async () => {
  if (!body.trim()) return;
  const payload = { body, title, mood };
  if (letterMode) payload.unlockAt = new Date(Date.now() + letterDays * 86400000).toISOString();

  if (user) {
   try {
    const entry = await createJournalEntry(payload);
    setEntries((prev) => [entry, ...prev]);
    setTitle("");
    setBody("");
    setLetterMode(false);
    return;
   } catch (e) {
    setLoadError(e.message || "Gagal menyimpan ke server. Coba lagi.");
    return;
   }
  }

  const entry = addJournal(payload);
  setEntries((prev) => [{ ...entry, locked: isLocked(entry) }, ...prev]);
  setTitle("");
  setBody("");
  setLetterMode(false);
 };

 const remove = async (id) => {
  if (user) {
   try {
    await deleteJournalEntry(id);
   } catch (e) {
    setLoadError("Gagal menghapus di server.");
    return;
   }
  } else {
   removeJournal(id);
  }
  setEntries((cur) => cur.filter((e) => e.id !== id));
 };

 return (
  <div
   data-testid={TID.jurnal.section}
   className="px-6 sm:px-10 lg:px-20 pt-36 pb-24 min-h-screen"
  >
   <Reveal>
    <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#e1b049] mb-4">
     Jurnal
    </p>
    <h1
     className="font-display-bold text-5xl md:text-7xl uppercase leading-[1.02] text-[var(--ivory)] max-w-4xl"
     style={{ letterSpacing: "-0.015em" }}
    >
     Tulis untuk
     <br />
     <span className="text-gradient-warm">dirimu esok.</span>
    </h1>
    <p className="mt-6 font-body text-[var(--ivory-soft)] max-w-2xl leading-relaxed">
     {user
      ? "Tersimpan ke akunmu. Bisa dibuka lagi dari perangkat manapun selama kamu login."
      : "Tersimpan di perangkat ini. Masuk supaya jejakmu ikut ke perangkat lain."}
    </p>
    {loadError && (
     <p data-testid="jurnal-load-error" className="mt-3 font-body text-[13px] text-[#e492a5]">
      {loadError}
     </p>
    )}
   </Reveal>

   <Reveal delay={0.15}>
    <div className="mt-12 glass-strong rounded-[28px] p-8 md:p-10 max-w-4xl">
     <input
      data-testid={TID.jurnal.titleInput}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Judul hari ini (opsional)"
      className="hover-target w-full bg-transparent border-b border-white/10 pb-3 mb-5 font-display-bold uppercase text-2xl md:text-3xl text-[var(--ivory)] placeholder:text-[var(--ivory-soft)]/45 focus:outline-none focus:border-[#e36c49]/60 transition-colors"
      style={{ letterSpacing: "-0.01em" }}
     />
     <textarea
      data-testid={TID.jurnal.bodyInput}
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder="Hari ini aku merasa..."
      rows={8}
      className="hover-target w-full bg-transparent border border-white/10 rounded-2xl p-5 font-body text-base text-[var(--ivory)] placeholder:text-[var(--ivory-soft)]/45 focus:outline-none focus:border-[#e36c49]/60 resize-none transition-colors"
     />
     <div className="mt-6">
      <p className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)] mb-3">
       Mood hari ini
      </p>
      <div className="flex flex-wrap gap-2">
       {MOODS.map((m) => {
        const active = mood === m.k;
        return (
         <button
          key={m.k}
          data-testid={TID.jurnal.moodPick(m.k)}
          onClick={() => setMood(m.k)}
          className="hover-target px-4 py-2 rounded-full text-xs font-display tracking-wide transition-all duration-200"
          style={{
           background: active ? m.color : "rgba(255,255,255,0.04)",
           color: active ? "var(--bg-deep)" : "rgba(237,230,216,0.8)",
           border: `1px solid ${active ? m.color : "rgba(255,255,255,0.1)"}`,
           boxShadow: active ? `0 0 24px ${m.color}55` : "none",
           fontWeight: active ? 600 : 400,
          }}
         >
          {m.label}
         </button>
        );
       })}
      </div>
     </div>

     {/* Surat untuk diriku nanti */}
     <div className="mt-6 rounded-2xl p-5 border border-white/8 bg-white/[0.02]">
      <div className="flex items-start justify-between gap-4">
       <div>
        <p className="text-[10px] font-display tracking-[0.36em] uppercase text-[#e492a5] mb-1 flex items-center gap-2">
         <Mail size={12} /> Surat untuk diriku nanti
        </p>
        <p className="font-body text-[13px] text-[var(--ivory-soft)]/80 leading-relaxed max-w-lg">
         Tulis sekarang, buka di masa depan. Selama belum waktunya, catatan ini tetap terkunci.
        </p>
       </div>
       <button
        data-testid="jurnal-letter-toggle"
        role="switch"
        aria-checked={letterMode}
        onClick={() => setLetterMode((v) => !v)}
        className="hover-target relative shrink-0 w-12 h-7 rounded-full transition-colors duration-300"
        style={{ background: letterMode ? "#e492a5" : "rgba(237,230,216,0.14)" }}
       >
        <span
         className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-[var(--ivory)] transition-transform duration-300"
         style={{ transform: letterMode ? "translateX(20px)" : "translateX(0)" }}
        />
       </button>
      </div>
      <AnimatePresence>
       {letterMode && (
        <motion.div
         initial={{ opacity: 0, height: 0 }}
         animate={{ opacity: 1, height: "auto" }}
         exit={{ opacity: 0, height: 0 }}
         transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
         className="overflow-hidden"
        >
         <div className="mt-5 pt-5 border-t border-white/8">
          <p className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)] mb-3">
           Buka setelah
          </p>
          <div className="flex flex-wrap gap-2" data-testid="jurnal-letter-presets">
           {LETTER_PRESETS.map((p) => {
            const active = letterDays === p.d;
            return (
             <button
              key={p.d}
              data-testid={`jurnal-letter-preset-${p.d}`}
              onClick={() => setLetterDays(p.d)}
              className="hover-target px-4 py-2 rounded-full text-xs font-display tracking-wide transition-all duration-200"
              style={{
               background: active ? "#e492a5" : "rgba(255,255,255,0.04)",
               color: active ? "var(--bg-deep)" : "rgba(237,230,216,0.8)",
               border: `1px solid ${active ? "#e492a5" : "rgba(255,255,255,0.1)"}`,
               fontWeight: active ? 600 : 400,
              }}
             >
              {p.label}
             </button>
            );
           })}
          </div>
          <p className="mt-4 text-[12px] font-body text-[var(--ivory-soft)]/70 flex items-center gap-2">
           <Clock size={12} />
           Terbuka pada {fmtDate(new Date(Date.now() + letterDays * 86400000).toISOString())}
          </p>
         </div>
        </motion.div>
       )}
      </AnimatePresence>
     </div>

     <div className="mt-7 flex items-center justify-between gap-3">
      <p className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)] flex items-center gap-2">
       <Calendar size={12} />
       {fmtDate(new Date().toISOString())}
      </p>
      <button
       data-testid={TID.jurnal.save}
       onClick={save}
       disabled={!body.trim()}
       className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-display tracking-[0.32em] uppercase font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
       style={{
        background: letterMode ? "#e492a5" : "var(--ivory)",
        color: letterMode ? "var(--ivory)" : "var(--bg-deep)",
        boxShadow: "0 10px 30px -10px rgba(227,108,73,0.4)",
       }}
      >
       {letterMode ? <Mail size={14} /> : <Save size={14} />}
       {letterMode ? "Kirim ke masa depan" : "Simpan"}
      </button>
     </div>
    </div>
   </Reveal>

   <div className="mt-20">
    <Reveal>
     <h2
      className="font-display-bold text-3xl md:text-4xl uppercase text-[var(--ivory)] mb-8 flex items-center gap-3"
      style={{ letterSpacing: "-0.01em" }}
     >
      <Book size={22} className="text-[#e1b049]" />
      Lini masa
     </h2>
    </Reveal>

    {entries.length === 0 && (
     <Reveal>
      <p
       data-testid={TID.jurnal.empty}
       className="font-body text-base text-[var(--ivory-soft)]"
      >
       Belum ada jurnal. Mulai dari kalimat pertama yang berani.
      </p>
     </Reveal>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     <AnimatePresence>
      {entries.map((e, i) => {
       const m = MOODS.find((x) => x.k === e.mood) || MOODS[0];
       const locked = e.locked === true;
       return (
        <motion.article
         key={e.id}
         layout
         initial={{ opacity: 0, y: 24 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         transition={{ duration: 0.5 }}
         data-testid={locked ? `jurnal-locked-${i}` : TID.jurnal.entry(i)}
         className="hover-target glass rounded-[20px] p-7 group relative overflow-hidden"
        >
         <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full opacity-25 group-hover:opacity-50 transition-opacity duration-700"
          style={{
           background: `radial-gradient(circle, ${locked ? "#e492a5" : m.color} 0%, transparent 70%)`,
           filter: "blur(30px)",
          }}
         />
         <div className="relative">
          {locked ? (
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-display tracking-[0.3em] uppercase mb-4"
                style={{ background: "#e492a522", border: "1px solid #e492a555", color: "#e492a5" }}>
            <Lock size={10} /> Terkunci
           </div>
          ) : (
           <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-display tracking-[0.3em] uppercase mb-4"
            style={{
             background: `${m.color}22`,
             border: `1px solid ${m.color}55`,
             color: m.color,
            }}
           >
            {m.label}
           </div>
          )}
          <h3
           className="font-display-bold text-xl md:text-2xl uppercase text-[var(--ivory)] leading-tight mb-3"
           style={{ letterSpacing: "-0.01em" }}
          >
           {e.title || "Tanpa Judul"}
          </h3>
          {locked ? (
           <div className="relative">
            <p
             aria-hidden="true"
             className="font-body text-sm leading-relaxed text-[var(--ivory)]/85 select-none pointer-events-none"
             style={{ filter: "blur(6px)" }}
            >
             Halo dari masa lalu. Waktu memang tidak selalu berjalan cepat, tapi kalimat ini menunggumu, sabar. Semoga hari ini kamu sedikit lebih tenang.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-display tracking-[0.3em] uppercase"
                 style={{ background: "rgba(228,146,165,0.14)", border: "1px solid rgba(228,146,165,0.4)", color: "#e492a5" }}>
             <Clock size={11} /> {fmtCountdown(e.unlockAt)}
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--ivory-soft)]/55">
             Terbuka {fmtDate(e.unlockAt)}
            </p>
           </div>
          ) : (
           <p className="font-body text-sm leading-relaxed text-[var(--ivory)]/85 line-clamp-6">
            {e.body}
           </p>
          )}
          <div className="mt-5 flex items-center justify-between gap-3">
           <p className="text-[10px] font-display tracking-[0.28em] uppercase text-[var(--ivory-soft)]">
            {fmtDate(e.createdAt)}
           </p>
           <button
            onClick={() => remove(e.id)}
            data-testid={`jurnal-delete-${i}`}
            className="hover-target text-[var(--ivory-soft)] hover:text-[#c24c2b] transition-colors p-2 rounded-full hover:bg-white/5"
            aria-label="Hapus"
           >
            <Trash2 size={14} />
           </button>
          </div>
         </div>
        </motion.article>
       );
      })}
     </AnimatePresence>
    </div>
   </div>
   <PageNav current="/jurnal" />
  </div>
 );
}
