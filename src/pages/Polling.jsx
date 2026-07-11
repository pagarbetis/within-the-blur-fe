import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { TID } from "@/constants/testIds";
import PageNav from "@/components/PageNav";

const INITIAL_POLLS = [
 {
 q: "Hal yang paling kamu butuhkan dari kuliah saat ini?",
 options: [
 { t: "Ruang istirahat yang lebih banyak", v: 142 },
 { t: "Guru yang mau mendengar tanpa menghakimi", v: 219 },
 { t: "Beban tugas yang lebih masuk akal", v: 188 },
 { t: "Teman bicara di hari yang berat", v: 167 },
 ],
 accent: "#e36c49",
 },
 {
 q: "Saat lelah, kamu paling sering...",
 options: [
 { t: "Tidur lebih lama", v: 312 },
 { t: "Buka ponsel tanpa tujuan", v: 280 },
 { t: "Bicara dengan teman dekat", v: 134 },
 { t: "Menulis atau menggambar", v: 92 },
 ],
 accent: "#e1b049",
 },
 {
 q: "Saat rapuh, kamu lebih senang...",
 options: [
 { t: "Dipeluk tanpa banyak kata", v: 256 },
 { t: "Diberi waktu sendiri", v: 198 },
 { t: "Diajak jalan tanpa rencana", v: 121 },
 { t: "Ditemani dalam diam", v: 175 },
 ],
 accent: "#aac8b7",
 },
];

export default function Polling() {
 const [polls, setPolls] = useState(INITIAL_POLLS);
 const [voted, setVoted] = useState({});

 const vote = (pi, oi) => {
 if (voted[pi] !== undefined) return;
 setPolls((prev) =>
 prev.map((p, i) =>
 i === pi
 ? {
 ...p,
 options: p.options.map((o, j) =>
 j === oi ? { ...o, v: o.v + 1 } : o
 ),
 }
 : p
 )
 );
 setVoted((v) => ({ ...v, [pi]: oi }));
 };

 return (
 <div
 data-testid={TID.polling.section}
 className="px-6 sm:px-10 lg:px-20 pt-36 pb-24 min-h-screen"
 >
 <Reveal>
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#e492a5] mb-4">
 Polling
 </p>
 <h1
 className="font-display-bold text-5xl md:text-7xl uppercase leading-[1.02] text-[var(--ivory)] max-w-4xl"
 style={{ letterSpacing: "-0.015em" }}
 >
 Suara <span className="text-gradient-warm">bersama,</span>
 <br />
 tanpa nama.
 </h1>
 <p className="mt-6 font-body text-[var(--ivory-soft)] max-w-xl leading-relaxed">
 Pilih satu di setiap pertanyaan. Lihat seberapa banyak temanmu merasakan
 hal yang sama denganmu.
 </p>
 </Reveal>

 <div className="mt-16 flex flex-col gap-8">
 {polls.map((p, pi) => {
 const total = p.options.reduce((s, o) => s + o.v, 0);
 const userVoted = voted[pi] !== undefined;
 return (
 <Reveal key={p.q} delay={pi * 0.12}>
 <div
 data-testid={TID.polling.poll(pi)}
 className="glass rounded-[24px] p-8 md:p-10"
 >
 <div className="flex items-center gap-2 mb-5">
 <span
 className="w-2 h-2 rounded-full"
 style={{ background: p.accent }}
 />
 <span className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)]">
 {total.toLocaleString("id-ID")} suara
 </span>
 </div>
 <h3
 className="font-display-bold text-2xl md:text-3xl uppercase text-[var(--ivory)] mb-7 leading-snug"
 style={{ letterSpacing: "-0.01em" }}
 >
 {p.q}
 </h3>
 <div className="flex flex-col gap-3">
 {p.options.map((o, oi) => {
 const pct = total > 0 ? (o.v / total) * 100 : 0;
 const isMine = voted[pi] === oi;
 return (
 <button
 key={o.t}
 data-testid={TID.polling.option(pi, oi)}
 onClick={() => vote(pi, oi)}
 disabled={userVoted}
 className={`hover-target group relative w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
 userVoted
 ? "cursor-default"
 : "hover:border-white/25"
 }`}
 style={{
 background: userVoted
 ? "rgba(255,255,255,0.025)"
 : "rgba(255,255,255,0.04)",
 borderColor: isMine
 ? p.accent
 : "rgba(255,255,255,0.10)",
 }}
 >
 {userVoted && (
 <motion.div
 className="absolute inset-y-0 left-0 rounded-2xl"
 initial={{ width: 0 }}
 animate={{ width: `${pct}%` }}
 transition={{ duration: 0.9, ease: "easeOut" }}
 style={{
 background: `linear-gradient(90deg, ${p.accent}33, ${p.accent}11)`,
 }}
 />
 )}
 <div className="relative flex items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 {isMine && (
 <CheckCircle2
 size={16}
 style={{ color: p.accent }}
 />
 )}
 <span className="font-body text-base text-[var(--ivory)]/92">
 {o.t}
 </span>
 </div>
 {userVoted && (
 <span
 className="text-xs font-display tracking-widest"
 style={{ color: p.accent }}
 >
 {pct.toFixed(1)}%
 </span>
 )}
 </div>
 </button>
 );
 })}
 </div>
 {userVoted && (
 <p className="mt-5 text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)]">
 Terima kasih sudah bersuara.
 </p>
 )}
 </div>
 </Reveal>
 );
 })}
 </div>
      <PageNav current="/polling" />
    </div>
  );
}
