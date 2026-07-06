import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music2, Check, ChevronUp } from "lucide-react";
import {
 startAudio,
 stopAudio,
 switchTrack,
 isAudioSupported,
 TRACKS,
 getCurrentTrack,
} from "@/lib/audioEngine";
import { TID } from "@/constants/testIds";

const TRACK_LIST = [TRACKS.senja, TRACKS.kabut, TRACKS.jeda];

export default function AudioToggle() {
 const [on, setOn] = useState(false);
 const [openPanel, setOpenPanel] = useState(false);
 const [active, setActive] = useState("senja");
 const [showHint, setShowHint] = useState(true);
 const [supported, setSupported] = useState(true);
 const panelRef = useRef(null);

 useEffect(() => {
 setSupported(isAudioSupported());
 const t = setTimeout(() => setShowHint(false), 6800);
 return () => clearTimeout(t);
 }, []);

 // Close panel on outside click
 useEffect(() => {
 if (!openPanel) return;
 const onDown = (e) => {
 if (panelRef.current && !panelRef.current.contains(e.target)) {
 setOpenPanel(false);
 }
 };
 window.addEventListener("mousedown", onDown);
 return () => window.removeEventListener("mousedown", onDown);
 }, [openPanel]);

 const togglePower = () => {
 if (!supported) return;
 if (on) {
 stopAudio();
 setOn(false);
 setOpenPanel(false);
 } else {
 const ok = startAudio(active);
 if (ok) {
 setOn(true);
 setShowHint(false);
 }
 }
 };

 const pickTrack = (id) => {
 setActive(id);
 if (on) {
 switchTrack(id);
 } else {
 const ok = startAudio(id);
 if (ok) {
 setOn(true);
 setShowHint(false);
 }
 }
 };

 return (
 <div
 ref={panelRef}
 className="fixed bottom-20 right-6 z-[55] flex items-end gap-3 md:bottom-6 md:right-[210px]"
 >
 <AnimatePresence>
 {showHint && !on && !openPanel && (
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 20 }}
 transition={{ duration: 0.4 }}
 data-testid={TID.audio.label}
 className="glass-strong rounded-full px-4 py-2 flex items-center gap-2 mb-1"
 >
 <Music2 size={14} className="text-[#e1b049]" />
 <span className="text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory)]/90 whitespace-nowrap">
 Pilih ambient
 </span>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Track selector panel */}
 <AnimatePresence>
 {openPanel && (
 <motion.div
 initial={{ opacity: 0, y: 14, scale: 0.94 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 14, scale: 0.94 }}
 transition={{ duration: 0.24, ease: [0.22, 0.65, 0.34, 1] }}
 data-testid="audio-panel"
 className="absolute bottom-[68px] right-0 glass-strong rounded-2xl p-3 w-[230px] shadow-2xl"
 style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.6)" }}
 >
 <p className="text-[9px] font-display tracking-[0.4em] uppercase text-[var(--ivory-soft)] mb-3 px-2 pt-1">
 Ambient · 3 pilihan
 </p>
 <div className="flex flex-col gap-1">
 {TRACK_LIST.map((t) => {
 const isActive = active === t.id;
 return (
 <button
 key={t.id}
 data-testid={`audio-track-${t.id}`}
 onClick={() => pickTrack(t.id)}
 className="hover-target group relative w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all"
 style={{
 background: isActive
 ? `${t.accent}1f`
 : "rgba(255,255,255,0.02)",
 border: `1px solid ${isActive ? t.accent + "55" : "rgba(255,255,255,0.06)"}`,
 }}
 >
 <span
 className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
 style={{
 background: t.accent,
 boxShadow: isActive ? `0 0 18px ${t.accent}88` : "none",
 }}
 >
 {isActive && on ? (
 <PlayingBars color="#0A0908" />
 ) : (
 <span
 className="w-2 h-2 rounded-full"
 style={{ background: "#0A0908" }}
 />
 )}
 </span>
 <span className="flex-1 min-w-0">
 <span
 className="block text-[11px] font-display tracking-[0.28em] uppercase"
 style={{
 color: isActive ? t.accent : "var(--ivory)",
 fontWeight: isActive ? 600 : 400,
 }}
 >
 {t.name}
 </span>
 <span className="block text-[9px] font-body text-[var(--ivory-soft)] mt-0.5">
 {t.desc}
 </span>
 </span>
 {isActive && (
 <Check size={12} style={{ color: t.accent }} />
 )}
 </button>
 );
 })}
 </div>
 <div className="mt-3 pt-3 border-t border-white/5 px-2">
 <p className="text-[9px] font-body text-[var(--ivory-soft)]/65 leading-relaxed">
 Loop tanpa akhir. Tarik napas. Tidak ada yang dikejar.
 </p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <div className="flex items-center gap-2">
 {/* Track chevron opens panel */}
 <button
 data-testid="audio-tracks-toggle"
 onClick={() => setOpenPanel((s) => !s)}
 aria-label="Pilih lagu"
 className="hover-target w-10 h-10 rounded-full glass-strong flex items-center justify-center transition-all duration-300"
 >
 <motion.span
 animate={{ rotate: openPanel ? 180 : 0 }}
 transition={{ duration: 0.3 }}
 style={{ display: "inline-flex" }}
 >
 <ChevronUp size={14} className="text-[var(--ivory)]/80" />
 </motion.span>
 </button>

 {/* Main power button */}
 <button
 onClick={togglePower}
 data-testid={TID.audio.toggle}
 aria-label={on ? "Matikan musik" : "Putar musik"}
 className={`relative w-14 h-14 rounded-full glass-strong flex items-center justify-center hover-target transition-all duration-300 ${
 on ? "pulse-glow" : ""
 }`}
 style={{
 boxShadow: on
 ? "0 0 30px rgba(227, 108, 73, 0.45)"
 : "0 8px 24px rgba(0,0,0,0.4)",
 }}
 >
 <AnimatePresence mode="wait">
 {on ? (
 <motion.span
 key="on"
 initial={{ scale: 0.6, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.6, opacity: 0 }}
 transition={{ duration: 0.2 }}
 >
 <Volume2 size={18} className="text-[#e36c49]" />
 </motion.span>
 ) : (
 <motion.span
 key="off"
 initial={{ scale: 0.6, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.6, opacity: 0 }}
 transition={{ duration: 0.2 }}
 >
 <VolumeX size={18} className="text-[var(--ivory)]/80" />
 </motion.span>
 )}
 </AnimatePresence>
 {on && (
 <span
 className="absolute inset-0 rounded-full"
 style={{
 border: "1px solid rgba(227, 108, 73, 0.45)",
 animation: "pulse-glow 2.6s ease-in-out infinite",
 }}
 />
 )}
 </button>
 </div>
 </div>
 );
}

function PlayingBars({ color }) {
 return (
 <span className="inline-flex items-end gap-[2px] h-3">
 {[0, 1, 2].map((i) => (
 <motion.span
 key={i}
 style={{ width: 2, background: color, borderRadius: 1 }}
 animate={{ height: ["35%", "100%", "55%"] }}
 transition={{
 duration: 0.7 + i * 0.15,
 repeat: Infinity,
 repeatType: "mirror",
 ease: "easeInOut",
 delay: i * 0.08,
 }}
 />
 ))}
 </span>
 );
}
