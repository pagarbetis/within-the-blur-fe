import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import { TID } from "@/constants/testIds";
import PageNav from "@/components/PageNav";

const newId = () =>
 (typeof crypto !== "undefined" && crypto.randomUUID)
 ? crypto.randomUUID()
 : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const SEED = [
 {
 id: "seed-1",
 name: "Anonim",
 text:
 "Lelah bukan karena banyak yang dikerjakan, tapi karena tidak ada yang sungguh-sungguh bertanya kabar.",
 likes: 142,
 when: "2 jam lalu",
 },
 {
 id: "seed-2",
 name: "Anonim",
 text:
 "Hari ini berani bilang 'tidak' pertama kali ke kebiasaan menyenangkan orang lain. Rasanya aneh, tapi lega.",
 likes: 87,
 when: "kemarin",
 },
 {
 id: "seed-3",
 name: "Anonim",
 text:
 "Kelas terasa seperti pertunjukan. Aku ingin sehari saja jadi diriku tanpa harus pintar.",
 likes: 213,
 when: "3 hari lalu",
 },
];

const STORAGE_KEY = "wtb_curhat_entries_v2";

export default function Curhat() {
 const [name, setName] = useState("");
 const [text, setText] = useState("");
 // Lazy initializer avoids the mount race: load LS synchronously BEFORE any effect runs.
 const [entries, setEntries] = useState(() => {
  try {
   const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
   if (saved && Array.isArray(saved) && saved.length > 0) {
    // Backfill ids for older stored entries
    return saved.map((e) => (e.id ? e : { ...e, id: newId() }));
   }
   return SEED;
  } catch (e) {
   console.warn("[Curhat] failed to load entries:", e);
   return SEED;
  }
 });
 const [burst, setBurst] = useState(false);

 useEffect(() => {
  try {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
   console.warn("[Curhat] failed to save entries:", e);
  }
 }, [entries]);

 const submit = () => {
 const t = text.trim();
 if (!t) return;
 setEntries((prev) => [
 {
 id: newId(),
 name: name.trim() || "Anonim",
 text: t,
 likes: 0,
 when: "baru saja",
 },
 ...prev,
 ]);
 setText("");
 setName("");
 setBurst(true);
 setTimeout(() => setBurst(false), 900);
 };

 const like = (id) => {
 setEntries((prev) =>
 prev.map((e) => (e.id === id ? { ...e, likes: e.likes + 1 } : e))
 );
 };

 return (
 <div
 data-testid={TID.curhat.section}
 className="px-6 sm:px-10 lg:px-20 pt-36 pb-24 min-h-screen"
 >
 <Reveal>
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#cb5186] mb-4">
 Curhat
 </p>
 <h1
 className="font-display-bold text-5xl md:text-7xl uppercase leading-[1.02] text-[var(--ivory)] max-w-4xl"
 style={{ letterSpacing: "-0.015em" }}
 >
 Letakkan dulu 
 <br />
 <span className="text-gradient-warm">dalam senyap.</span>
 </h1>
 <p className="mt-6 font-body text-[var(--ivory-soft)] max-w-2xl leading-relaxed">
 Tulis apa yang sedang kamu pikul. Boleh tanpa nama, boleh sependek satu
 kalimat.
 </p>
 </Reveal>

 <Reveal delay={0.15}>
 <div className="mt-12 glass-strong rounded-[28px] p-8 md:p-10 max-w-3xl relative overflow-hidden">
 <div className="flex flex-col md:flex-row gap-4 mb-5">
 <input
 data-testid={TID.curhat.nameInput}
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Nama samaran (opsional)"
 className="hover-target flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 font-body text-[var(--ivory)] placeholder:text-[var(--ivory-soft)]/55 focus:outline-none focus:border-[#e36c49]/60"
 />
 <span className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)] self-center">
 Anonim default
 </span>
 </div>
 <textarea
 data-testid={TID.curhat.textarea}
 value={text}
 onChange={(e) => setText(e.target.value)}
 placeholder="Tulis apa yang sedang kamu rasakan..."
 rows={6}
 className="hover-target w-full bg-transparent border border-white/10 rounded-2xl p-5 font-body text-base text-[var(--ivory)] placeholder:text-[var(--ivory-soft)]/55 focus:outline-none focus:border-[#e36c49]/60 resize-none transition-colors"
 />
 <div className="mt-5 flex items-center justify-between gap-3">
 <p className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)]">
 {text.length} karakter
 </p>
 <button
 data-testid={TID.curhat.submit}
 onClick={submit}
 disabled={!text.trim()}
 className="hover-target relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-display tracking-[0.32em] uppercase font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
 style={{
 background: "#e36c49",
 color: "var(--ivory)",
 boxShadow: "0 10px 30px -10px rgba(227,108,73,0.55)",
 }}
 >
 <Send size={14} />
 Kirim
 <AnimatePresence>
 {burst &&
 Array.from({ length: 12 }).map((_, i) => {
 const angle = (i / 12) * Math.PI * 2;
 const r = 40 + Math.random() * 20;
 return (
 <motion.span
 key={`particle-${i}`}
 initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
 animate={{
 x: Math.cos(angle) * r,
 y: Math.sin(angle) * r,
 opacity: 0,
 scale: 0.2,
 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.8, ease: "easeOut" }}
 className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
 style={{
 background:
 i % 3 === 0 ? "#e1b049" : i % 3 === 1 ? "#aac8b7" : "#EDE6D8",
 boxShadow: "0 0 8px currentColor",
 color: "currentColor",
 }}
 />
 );
 })}
 </AnimatePresence>
 </button>
 </div>
 </div>
 </Reveal>

 <div
 data-testid={TID.curhat.feed}
 className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
 >
 {entries.map((e, i) => (
 <Reveal key={e.id} delay={(i % 4) * 0.08}>
 <motion.article
 data-testid={TID.curhat.entry(i)}
 whileHover={{ y: -4 }}
 className="hover-target glass rounded-[20px] p-7 group transition-all duration-300 hover:border-white/20"
 >
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div
 className="w-9 h-9 rounded-full flex items-center justify-center"
 style={{
 background:
 i % 4 === 0
 ? "#e36c49"
 : i % 4 === 1
 ? "#e1b049"
 : i % 4 === 2
 ? "#aac8b7"
 : "#6b8bc7",
 }}
 >
 <MessageCircle size={14} className="text-[var(--bg-deep)]" />
 </div>
 <div>
 <p className="text-xs font-display tracking-wide text-[var(--ivory)]">
 {e.name}
 </p>
 <p className="text-[10px] font-display tracking-[0.28em] uppercase text-[var(--ivory-soft)]">
 {e.when}
 </p>
 </div>
 </div>
 </div>
 <p className="font-body text-base leading-relaxed text-[var(--ivory)]/90">
 {e.text}
 </p>
 <button
 onClick={() => like(e.id)}
 data-testid={`curhat-like-${i}`}
 className="hover-target mt-5 inline-flex items-center gap-2 text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)] hover:text-[#e36c49] transition-colors"
 >
 <Heart size={12} /> {e.likes} memeluk
 </button>
 </motion.article>
 </Reveal>
 ))}
 </div>
      <PageNav current="/curhat" />
    </div>
  );
}
