import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ChevronRight, Info, Share2, Download, Loader2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { TID } from "@/constants/testIds";
import PageNav from "@/components/PageNav";
import { setKuis as saveKuisLocal } from "@/lib/localStore";
import { useAuth } from "@/context/AuthContext";
import { saveKuisResult } from "@/lib/api";
import { generateKuisStoryImage, downloadDataUrl } from "@/lib/ShareStoryImage";

// Each option carries TWO mappings:
// k → archetype (Pencerna Dalam / Penghubung Hangat / Pencari Gerak / Perenung Tenang)
// c → brain dominance (chimp / human / computer) per The Chimp Paradox
const QUESTIONS = [
 {
 q: "Saat hari terasa berat, kamu paling sering...",
 options: [
 { t: "Menarik diri, mencari ruang sendiri.", k: "introspektif", c: "computer" },
 { t: "Bercerita ke teman dekat.", k: "ekspresif", c: "human" },
 { t: "Cari kesibukan agar lupa.", k: "pelarian", c: "chimp" },
 { t: "Berdoa atau diam.", k: "kontemplatif", c: "human" },
 ],
 },
 {
 q: "Kalimat yang paling bikin kamu lega...",
 options: [
 { t: "Kamu sudah cukup berusaha hari ini.", k: "introspektif", c: "human" },
 { t: "Aku di sini, cerita saja.", k: "ekspresif", c: "chimp" },
 { t: "Ayo lakukan sesuatu yang seru.", k: "pelarian", c: "chimp" },
 { t: "Semua ada waktunya.", k: "kontemplatif", c: "computer" },
 ],
 },
 {
 q: "Yang paling kamu butuhkan minggu ini...",
 options: [
 { t: "Waktu untuk diam dan memahami diri.", k: "introspektif", c: "human" },
 { t: "Obrolan jujur dengan seseorang.", k: "ekspresif", c: "human" },
 { t: "Pengalihan yang sehat.", k: "pelarian", c: "chimp" },
 { t: "Refleksi atau menulis.", k: "kontemplatif", c: "human" },
 ],
 },
 {
 q: "Saat lelah, yang paling sering kamu lakukan...",
 options: [
 { t: "Tidur lebih lama.", k: "introspektif", c: "computer" },
 { t: "Hubungi teman.", k: "ekspresif", c: "human" },
 { t: "Buka ponsel tanpa tujuan.", k: "pelarian", c: "chimp" },
 { t: "Menulis di jurnal.", k: "kontemplatif", c: "human" },
 ],
 },
 {
 q: "Suara yang paling menenangkan...",
 options: [
 { t: "Suara hujan.", k: "introspektif", c: "computer" },
 { t: "Tawa orang yang kamu sayang.", k: "ekspresif", c: "chimp" },
 { t: "Lagu favoritmu.", k: "pelarian", c: "chimp" },
 { t: "Suasana ruang yang tenang.", k: "kontemplatif", c: "computer" },
 ],
 },
];

const RESULTS = {
 introspektif: {
 name: "Pencerna Dalam",
 accent: "#6b8bc7",
 body:
 "Kamu mengolah rasa lewat keheningan. Kekuatanmu: kedalaman. Pengingat: berbagi pun bagian dari sembuh.",
 },
 ekspresif: {
 name: "Penghubung Hangat",
 accent: "#e36c49",
 body:
 "Kamu mengolah rasa lewat percakapan. Kehadiranmu menyalakan orang lain pastikan kamu juga punya tempat menyalakan dirimu.",
 },
 pelarian: {
 name: "Pencari Gerak",
 accent: "#e1b049",
 body:
 "Kamu butuh aksi untuk meresap rasa. Tidak ada yang salah dengan itu asal sesekali kamu juga duduk dan menengok.",
 },
 kontemplatif: {
 name: "Perenung Tenang",
 accent: "#aac8b7",
 body:
 "Kamu mencari makna pada hal kecil. Ketenanganmu obat bagi dirimu dan diam-diam, juga bagi sekitarmu.",
 },
};

const DOMINANT = {
 chimp: {
 name: "The Chimp",
 accent: "#e36c49",
 body:
 "Hari ini, sisi impulsif & emosionalmu yang paling sering bicara. Bukan masalah beri ia ruang, lalu ajak Human duduk bersamanya.",
 },
 human: {
 name: "The Human",
 accent: "#e1b049",
 body:
 "Hari ini, sisi sadar & rasionalmu yang paling banyak hadir. Kamu sedang memilih, bukan sekadar bereaksi.",
 },
 computer: {
 name: "The Computer",
 accent: "#aac8b7",
 body:
 "Hari ini, sisi otomatis & kebiasaanmu yang paling kuat. Coba periksa apakah pola itu masih melayanimu?",
 },
};

// Pure helper computes archetype + dominant brain from answers.
// Kept outside the component so useMemo deps stay minimal.
function computeKuisResult(answers, done) {
 if (!done) return {};
 const kCounts = {};
 answers.forEach((a) => (kCounts[a.k] = (kCounts[a.k] || 0) + 1));
 const topArchetype = Object.entries(kCounts).sort((x, y) => y[1] - x[1])[0][0];
 const cCounts = { chimp: 0, human: 0, computer: 0 };
 answers.forEach((a) => (cCounts[a.c] = (cCounts[a.c] || 0) + 1));
 const topDominant = Object.entries(cCounts).sort((x, y) => y[1] - x[1])[0][0];
 return {
 result: RESULTS[topArchetype],
 dominant: DOMINANT[topDominant],
 dominantBreakdown: cCounts,
 };
}

export default function Kuis() {
 const { user } = useAuth();
 const [idx, setIdx] = useState(0);
 const [answers, setAnswers] = useState([]); // [{k, c}]
 const [done, setDone] = useState(false);

 const progress = (idx / QUESTIONS.length) * 100;

 const pick = (opt) => {
 const next = [...answers, { k: opt.k, c: opt.c }];
 setAnswers(next);
 if (idx + 1 >= QUESTIONS.length) {
 setDone(true);
 } else {
 setIdx(idx + 1);
 }
 };

 const { result, dominant, dominantBreakdown } = useMemo(
 () => computeKuisResult(answers, done),
 [done, answers]
 );

 // Persist to backend (if logged in) or localStorage (guest) when kuis is completed
 const [saveStatus, setSaveStatus] = useState("idle"); // idle | saved
 useEffect(() => {
  if (!done || !dominant || !dominantBreakdown) return;
  const dominantKey = Object.entries(dominantBreakdown).sort((a, b) => b[1] - a[1])[0][0];
  (async () => {
   if (user) {
    try {
     await saveKuisResult({ dominant: dominantKey, counts: dominantBreakdown });
     setSaveStatus("saved");
     return;
    } catch (e) {
     // fall through to local save so the result isn't lost
    }
   }
   saveKuisLocal({ dominant: dominantKey, counts: dominantBreakdown });
   setSaveStatus("saved");
  })();
 }, [done, dominant, dominantBreakdown, user]);

 // Share-as-Story handler
 const [shareStatus, setShareStatus] = useState("idle"); // idle | rendering | ready | error
 const [previewUrl, setPreviewUrl] = useState(null);

 const handleShare = async () => {
  if (!result || !dominant || !dominantBreakdown) return;
  setShareStatus("rendering");
  try {
   const url = await generateKuisStoryImage({
    dominantAccent: dominant.accent,
    archetypeAccent: result.accent,
   });
   setPreviewUrl(url);
   setShareStatus("ready");
  } catch (e) {
   console.error("[Kuis] share failed:", e);
   setShareStatus("error");
  }
 };

 const handleDownload = () => {
  if (previewUrl) downloadDataUrl(previewUrl, "within-the-blur-hasil-kuis.png");
 };

 const reset = () => {
 setIdx(0);
 setAnswers([]);
 setDone(false);
 setSaveStatus("idle");
 };

 return (
 <div
 data-testid={TID.kuis.section}
 className="px-6 sm:px-10 lg:px-20 pt-36 pb-24 min-h-screen"
 >
 <Reveal>
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#e1b049] mb-4">
 Kenali pola
 </p>
 <h1
 className="font-display-bold text-5xl md:text-7xl uppercase leading-[1.02] text-[var(--ivory)]"
 style={{ letterSpacing: "-0.015em" }}
 >
 Cara apa yang kamu pakai
 <br />
 untuk <span className="text-gradient-warm">memeluk hari?</span>
 </h1>
 <p className="mt-6 font-body text-[var(--ivory-soft)] max-w-xl leading-relaxed">
 Lima pertanyaan singkat. Tidak ada salah benar hanya yang paling
 kamu rasakan.
 </p>
 </Reveal>

 {!done && (
 <Reveal delay={0.2}>
 <div className="mt-12 max-w-3xl">
 <div className="flex justify-between text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)] mb-3">
 <span>Pertanyaan {idx + 1} / {QUESTIONS.length}</span>
 <span data-testid={TID.kuis.progress}>{Math.round(progress)}%</span>
 </div>
 <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
 <motion.div
 className="h-full"
 style={{
 background: "linear-gradient(90deg, #e36c49, #e1b049)",
 }}
 initial={{ width: "0%" }}
 animate={{ width: `${progress}%` }}
 transition={{ duration: 0.5 }}
 />
 </div>
 </div>
 </Reveal>
 )}

 <div className="mt-12 max-w-3xl">
 <AnimatePresence mode="wait">
 {!done && (
 <motion.div
 key={idx}
 initial={{ opacity: 0, x: 30 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -30 }}
 transition={{ duration: 0.5 }}
 >
 <h2
 data-testid={TID.kuis.question}
 className="font-display-bold text-2xl md:text-4xl uppercase leading-snug text-[var(--ivory)] mb-8"
 style={{ letterSpacing: "-0.01em" }}
 >
 {QUESTIONS[idx].q}
 </h2>
 <div className="flex flex-col gap-3">
 {QUESTIONS[idx].options.map((o, i) => (
 <motion.button
 key={o.t}
 data-testid={TID.kuis.option(i)}
 onClick={() => pick(o)}
 whileHover={{ x: 6 }}
 whileTap={{ scale: 0.98 }}
 className="group hover-target text-left glass rounded-2xl px-6 py-5 flex items-center justify-between transition-colors hover:bg-white/10"
 >
 <span className="font-body text-base md:text-lg text-[var(--ivory)]/90">
 {o.t}
 </span>
 <ChevronRight
 size={18}
 className="text-[var(--ivory-soft)] group-hover:text-[#e36c49] transition-colors"
 />
 </motion.button>
 ))}
 </div>
 </motion.div>
 )}

 {done && result && dominant && (
 <motion.div
 key="done"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.7 }}
 data-testid={TID.kuis.result}
 className="flex flex-col gap-6"
 >
 {/* Save status indicator */}
 <div
  data-testid="kuis-save-status"
  className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
  style={{
   background: saveStatus === "error" ? "rgba(228,146,165,0.14)" : "rgba(170,200,183,0.14)",
   border: `1px solid ${saveStatus === "error" ? "rgba(228,146,165,0.4)" : "rgba(170,200,183,0.4)"}`,
  }}
 >
  <span
   className="w-2 h-2 rounded-full"
   style={{ background: "#aac8b7" }}
  />
  <span className="text-[9px] font-display tracking-[0.32em] uppercase" style={{ color: "#aac8b7" }}>
   {saveStatus === "saved" ? "Hasil tersimpan" : "Hasil"}
  </span>
 </div>

 {/* PRIMARY Arketipe */}
 <div
 className="relative glass rounded-[32px] p-10 md:p-14 overflow-hidden"
 style={{ boxShadow: `0 30px 90px -30px ${result.accent}55` }}
 >
 <div
 className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full opacity-30"
 style={{
 background: `radial-gradient(circle, ${result.accent} 0%, transparent 70%)`,
 filter: "blur(60px)",
 }}
 />
 <div className="relative">
 <div
 className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7"
 style={{
 background: `${result.accent}22`,
 border: `1px solid ${result.accent}55`,
 }}
 >
 <span
 className="text-[10px] font-display tracking-[0.36em] uppercase"
 style={{ color: result.accent }}
 >
 Arketipemu
 </span>
 </div>
 <h2
 className="font-display-bold text-5xl md:text-7xl uppercase leading-[1.02] text-[var(--ivory)] mb-6"
 style={{ letterSpacing: "-0.015em" }}
 >
 Kamu cenderung jadi{" "}
 <span style={{ color: result.accent }}>{result.name}.</span>
 </h2>
 <p className="font-body text-lg leading-relaxed text-[var(--ivory)]/90 max-w-2xl">
 {result.body}
 </p>
 </div>
 </div>

 {/* SECONDARY Dominant Brain (Chimp/Human/Computer) */}
 <div
 data-testid="kuis-dominant"
 className="relative glass rounded-[32px] p-8 md:p-12 overflow-hidden"
 style={{ boxShadow: `0 20px 60px -20px ${dominant.accent}55` }}
 >
 <div
 className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-30"
 style={{
 background: `radial-gradient(circle, ${dominant.accent} 0%, transparent 70%)`,
 filter: "blur(50px)",
 }}
 />
 <div className="relative">
 <div
 className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
 style={{
 background: `${dominant.accent}22`,
 border: `1px solid ${dominant.accent}55`,
 }}
 >
 <span
 className="text-[10px] font-display tracking-[0.36em] uppercase"
 style={{ color: dominant.accent }}
 >
 Sisi dominan hari ini
 </span>
 </div>
 <h3
 className="font-display-bold text-3xl md:text-5xl uppercase leading-[1.05] text-[var(--ivory)] mb-4"
 style={{ letterSpacing: "-0.015em" }}
 >
 Yang paling sering bicara:{" "}
 <span style={{ color: dominant.accent }}>{dominant.name}.</span>
 </h3>
 <p className="font-body text-base leading-relaxed text-[var(--ivory)]/85 max-w-2xl mb-7">
 {dominant.body}
 </p>

 {/* Mini breakdown bars */}
 <div className="grid grid-cols-3 gap-3 max-w-lg">
 {["chimp", "human", "computer"].map((key) => {
 const total = Object.values(dominantBreakdown).reduce((s, v) => s + v, 0);
 const v = dominantBreakdown[key] || 0;
 const pct = total ? (v / total) * 100 : 0;
 const d = DOMINANT[key];
 const isMax = key === Object.entries(dominantBreakdown).sort((a,b)=>b[1]-a[1])[0][0];
 return (
 <div key={key} className="flex flex-col gap-2">
 <div className="flex items-center justify-between">
 <span
 className="text-[9px] font-display tracking-[0.28em] uppercase"
 style={{ color: d.accent, opacity: isMax ? 1 : 0.7 }}
 >
 {d.name.replace("The ", "")}
 </span>
 <span
 className="text-[10px] font-display"
 style={{ color: d.accent, opacity: isMax ? 1 : 0.7 }}
 >
 {v}/{total}
 </span>
 </div>
 <div className="h-[3px] rounded-full bg-white/5 overflow-hidden">
 <motion.div
 className="h-full rounded-full"
 style={{ background: d.accent }}
 initial={{ width: 0 }}
 animate={{ width: `${pct}%` }}
 transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
 />
 </div>
 </div>
 );
 })}
 </div>

 {/* Disclaimer */}
 <div
 className="mt-7 flex items-start gap-2 p-4 rounded-2xl"
 style={{
 background: "rgba(255,255,255,0.03)",
 border: "1px solid rgba(255,255,255,0.07)",
 }}
 >
 <Info size={14} className="text-[var(--ivory-soft)] mt-0.5 flex-shrink-0" />
 <p className="text-xs font-body text-[var(--ivory-soft)] leading-relaxed">
 Ini bukan diagnosis. Ini cerminan singkat siapa yang
 paling banyak bicara di dalam dirimu hari ini. Besok bisa
 berbeda, dan itu wajar.
 </p>
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="flex flex-wrap gap-3">
 <button
  data-testid="kuis-share"
  onClick={handleShare}
  disabled={shareStatus === "rendering"}
  className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-display tracking-[0.32em] uppercase font-semibold disabled:opacity-60"
  style={{
   background: dominant.accent,
   color: "var(--bg-deep)",
   boxShadow: `0 10px 30px -10px ${dominant.accent}88`,
  }}
 >
  {shareStatus === "rendering" ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
  {shareStatus === "rendering" ? "Menggambar..." : "Bagikan ke Story"}
 </button>
 <button
 data-testid={TID.kuis.restart}
 onClick={reset}
 className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-[10px] font-display tracking-[0.32em] uppercase font-semibold text-[var(--ivory)]"
 >
 <RefreshCw size={14} />
 Ulangi kuis
 </button>
 <a
 href="/maskot"
 className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory)]/85"
 >
 Kenali tiga sisimu
 </a>
 </div>

 {/* Share preview modal */}
 <AnimatePresence>
  {shareStatus === "ready" && previewUrl && (
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[70] flex items-center justify-center px-4 backdrop-blur-md bg-black/70"
    data-testid="kuis-share-modal"
    onClick={() => setShareStatus("idle")}
   >
    <motion.div
     initial={{ scale: 0.9, y: 20 }}
     animate={{ scale: 1, y: 0 }}
     exit={{ scale: 0.9, y: 20 }}
     transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
     onClick={(e) => e.stopPropagation()}
     className="glass-strong rounded-[28px] p-6 max-w-md w-full text-center"
    >
     <p className="text-[10px] font-display tracking-[0.42em] uppercase text-[var(--ivory-soft)] mb-4">
      Preview · 1080 × 1920
     </p>
     <img
      src={previewUrl}
      alt="Story preview"
      data-testid="kuis-share-preview"
      className="w-full max-h-[60vh] object-contain rounded-2xl border border-white/8"
     />
     <div className="mt-5 flex flex-wrap gap-3 justify-center">
      <button
       data-testid="kuis-share-download"
       onClick={handleDownload}
       className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-display tracking-[0.32em] uppercase font-semibold"
       style={{ background: "var(--ivory)", color: "var(--bg-deep)" }}
      >
       <Download size={14} />
       Unduh PNG
      </button>
      <button
       onClick={() => setShareStatus("idle")}
       className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory)]/85"
      >
       Tutup
      </button>
     </div>
     <p className="mt-4 text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ivory-soft)]/50">
      Unggah ke IG Story
     </p>
    </motion.div>
   </motion.div>
  )}
 </AnimatePresence>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
      <PageNav current="/kuis" />
    </div>
  );
}
