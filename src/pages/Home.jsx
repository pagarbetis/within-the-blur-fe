import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, Pause, Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import { TID } from "@/constants/testIds";

const PILLARS = [
 {
 icon: Pause,
 word: "Jeda",
 body: "Berhenti sebentar dari laju yang ramai.",
 accent: "#e36c49",
 },
 {
 icon: Eye,
 word: "Sadar",
 body: "Sadari apa yang sedang kamu rasakan sekarang.",
 accent: "#e1b049",
 },
 {
 icon: Search,
 word: "Kenali",
 body: "Kenali sisi dirimu yang impulsif, rasional, dan otomatis.",
 accent: "#aac8b7",
 },
];

const NUMBERS = [
 { k: "3", v: "Sisi diri", c: "#e36c49" },
 { k: "7", v: "Mood harian", c: "#e1b049" },
 { k: "12", v: "Pertanyaan", c: "#6b8bc7" },
 { k: "∞", v: "Ruang aman", c: "#aac8b7" },
];

export default function Home() {
 const { scrollYProgress } = useScroll();
 const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
 const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

 return (
 <div data-testid={TID.home.hero}>
 {/* HERO */}
 <section className="relative min-h-screen flex items-center px-6 sm:px-10 lg:px-20 pt-32 pb-24">
 <motion.div style={{ y: y1 }} className="max-w-5xl">
 <Reveal>
 <div className="flex items-center gap-3 mb-8">
 <span
 className="w-12 h-[1px]"
 style={{ background: "#e36c49" }}
 />
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#e36c49]">
 Jeda · Sadar · Kenali
 </p>
 </div>
 </Reveal>

 <h1
 data-testid={TID.home.headline}
 className="font-display-bold text-[var(--ivory)] leading-[0.88] uppercase"
 style={{ fontSize: "clamp(56px, 12vw, 184px)" }}
 >
 <motion.span
 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
 transition={{ duration: 0.9, delay: 0.1 }}
 className="block"
 >
 WHAT&apos;S WITHIN
 </motion.span>
 <motion.span
 initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
 transition={{ duration: 0.9, delay: 0.35 }}
 className="block text-gradient-warm"
 >
 YOUR BLUR?
 </motion.span>
 </h1>

 <Reveal delay={0.85}>
 <p
 data-testid={TID.home.sublineId}
 className="mt-10 font-subhead text-2xl md:text-3xl text-[var(--ivory)]/95 max-w-2xl"
 style={{ letterSpacing: "-0.008em", fontWeight: 500 }}
 >
 Apa yang ada di balik kabutmu?
 </p>
 </Reveal>

 <Reveal delay={1.0}>
 <p className="mt-5 font-subhead text-base md:text-lg text-[var(--ivory-soft)] max-w-xl leading-relaxed">
 Ruang untuk berhenti sejenak. Mengenali apa yang sedang berjalan di
 dalam dirimu yang impulsif, yang berpikir, yang otomatis.
 </p>
 </Reveal>

 <Reveal delay={1.15}>
 <div className="mt-10 flex flex-wrap gap-3">
 <Link
 to="/kuis"
 data-testid={TID.home.ctaPrimary}
 className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[var(--ivory)] text-[var(--bg-deep)] text-[10px] font-display tracking-[0.32em] uppercase font-semibold transition-transform duration-300 hover:scale-[1.03] active:scale-95 hover-target"
 style={{ boxShadow: "0 10px 40px -10px rgba(227,108,73,0.4)" }}
 >
 Siapa yang dominan hari ini
 <span
 className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5"
 style={{ background: "#e36c49" }}
 >
 <ArrowRight size={14} className="text-[var(--ivory)]" />
 </span>
 </Link>
 <Link
 to="/maskot"
 data-testid={TID.home.ctaSecondary}
 className="inline-flex items-center gap-3 px-7 py-4 rounded-full glass text-[var(--ivory)] text-[10px] font-display tracking-[0.32em] uppercase font-medium hover:bg-white/10 transition-all duration-300 hover-target"
 >
 Kenali tiga sisimu
 </Link>
 </div>
 </Reveal>
 </motion.div>

 {/* Scroll hint */}
 <motion.div
 data-testid={TID.home.scrollHint}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 2, duration: 0.8 }}
 className="absolute bottom-12 left-6 sm:left-10 lg:left-20 flex items-center gap-3"
 >
 <motion.div
 animate={{ y: [0, 8, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 >
 <ArrowDown size={14} className="text-[var(--ivory)]/60" />
 </motion.div>
 <span className="text-[10px] font-display tracking-[0.42em] uppercase text-[var(--ivory)]/60">
 Scroll perlahan
 </span>
 </motion.div>

 {/* Right side floating moment card */}
 <motion.div
 style={{ y: y2 }}
 className="hidden lg:block absolute top-1/2 right-10 -translate-y-1/2 max-w-[300px]"
 >
 <Reveal delay={1.3}>
 <div className="glass rounded-3xl p-6 hover-target">
 <p className="text-[9px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)] mb-3">
 Hari ini
 </p>
 <p className="font-display text-xl leading-snug text-[var(--ivory)]">
 Berhenti sebentar. Tarik napas. Tidak ada yang sedang dikejar.
 </p>
 <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.36em] uppercase" style={{ color: "#e1b049" }}>
 <span className="w-6 h-[1px]" style={{ background: "#e1b049" }} />
 Untukmu
 </div>
 </div>
 </Reveal>
 </motion.div>
 </section>

 {/* Marquee divider */}
 <div className="relative py-7 overflow-hidden border-y border-white/5">
 <div className="flex marquee-track whitespace-nowrap gap-12">
 {Array.from({ length: 2 }).map((_, dup) => (
 <div key={`dup-${dup}`} className="flex gap-12 items-center">
 {[
 "JEDA",
 " ",
 "SADAR",
 " ",
 "KENALI",
 " ",
 "BERHENTI",
 " ",
 "DENGAR",
 " ",
 "PAHAMI",
 " ",
 "TUMBUH",
 " ",
 ].map((w, i) => (
 <span
 key={`${dup}-${w}-${i}`}
 className="font-display-bold text-3xl md:text-4xl uppercase tracking-[0.06em]"
 style={{
 color:
 i % 6 === 0
 ? "#e36c49"
 : i % 6 === 2
 ? "#e1b049"
 : i % 6 === 4
 ? "#aac8b7"
 : "var(--ivory)",
 opacity: i % 2 === 0 ? 0.92 : 0.4,
 }}
 >
 {w}
 </span>
 ))}
 </div>
 ))}
 </div>
 </div>

 {/* PILLARS: Jeda. Sadar. Kenali. */}
 <section className="px-6 sm:px-10 lg:px-20 py-28">
 <Reveal>
 <div className="max-w-3xl">
 <p className="text-[10px] font-display tracking-[0.42em] uppercase text-[#e1b049] mb-5">
 Tiga langkah sederhana
 </p>
 <h2 className="font-display-bold text-5xl md:text-7xl leading-[1.02] text-[var(--ivory)] uppercase">
 Tidak ada yang
 <br />
 perlu <span className="text-gradient-warm">kamu kejar</span> di sini.
 </h2>
 <p className="mt-6 text-base font-body text-[var(--ivory-soft)] max-w-xl leading-relaxed">
 Bukan platform untuk produktif. Bukan ruang untuk dievaluasi. Cukup
 hadir, dan kenali apa yang sedang terjadi di dalam dirimu.
 </p>
 </div>
 </Reveal>

 <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
 {PILLARS.map((p, i) => {
 const Icon = p.icon;
 return (
 <Reveal key={p.word} delay={i * 0.12}>
 <motion.div
 whileHover={{ y: -8 }}
 transition={{ type: "spring", stiffness: 280, damping: 24 }}
 data-testid={TID.home.feature(i)}
 className="group relative glass rounded-3xl p-8 hover-target overflow-hidden"
 >
 {/* Hover gradient bg */}
 <div
 className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700"
 style={{
 background: `radial-gradient(circle, ${p.accent} 0%, transparent 70%)`,
 filter: "blur(40px)",
 }}
 />
 {/* Number */}
 <p
 className="relative text-[10px] font-display tracking-[0.36em] uppercase mb-8"
 style={{ color: p.accent }}
 >
 0{i + 1}
 </p>
 <div
 className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-7"
 style={{
 background: `${p.accent}22`,
 border: `1px solid ${p.accent}44`,
 }}
 >
 <Icon size={20} style={{ color: p.accent }} />
 </div>
 <h3
 className="relative font-display-bold text-5xl uppercase text-[var(--ivory)] mb-3"
 style={{ letterSpacing: "-0.02em" }}
 >
 {p.word}.
 </h3>
 <p className="relative text-sm font-body text-[var(--ivory-soft)] leading-relaxed">
 {p.body}
 </p>
 </motion.div>
 </Reveal>
 );
 })}
 </div>
 </section>

 {/* NUMBERS strip */}
 <section className="px-6 sm:px-10 lg:px-20 py-16">
 <Reveal>
 <div className="glass rounded-[36px] p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8">
 {NUMBERS.map((n) => (
 <div key={n.v} className="text-center">
 <div
 className="font-display-bold text-6xl md:text-7xl mb-2"
 style={{ color: n.c, letterSpacing: "-0.02em" }}
 >
 {n.k}
 </div>
 <p className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)]">
 {n.v}
 </p>
 </div>
 ))}
 </div>
 </Reveal>
 </section>

 {/* Closing implicit, direct */}
 <section className="px-6 sm:px-10 lg:px-20 py-28">
 <Reveal>
 <div
 data-testid={TID.home.quote}
 className="max-w-4xl mx-auto text-center"
 >
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#e1b049] mb-6">
 ✦
 </p>
 <p className="font-display-bold text-4xl md:text-6xl uppercase leading-[1.02] text-[var(--ivory)]">
 Berhenti sebentar.
 <br />
 <span className="text-gradient-warm">Sadar.</span>{" "}
 <span style={{ color: "#aac8b7" }}>Kenali.</span>
 <br />
 Itu sudah cukup.
 </p>
 <div className="mt-10 inline-flex items-center gap-4 text-[10px] font-display tracking-[0.42em] uppercase text-[var(--ivory-soft)]">
 <span className="w-10 h-[1px] bg-[var(--ivory-soft)]/40" />
 within the blur
 <span className="w-10 h-[1px] bg-[var(--ivory-soft)]/40" />
 </div>
 </div>
 </Reveal>
 </section>
 </div>
 );
}
