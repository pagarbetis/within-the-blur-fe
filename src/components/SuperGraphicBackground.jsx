import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Supergrafis: adaptasi dari logo (3 oval blur: mustard, terracotta, sage)
// + pill shapes + gradient orbs (terinspirasi referensi).
// Tetap dark bg, ambience tenang.

const PARTICLE_COUNT = 24;

function buildParticles(count) {
 return Array.from({ length: count }).map((_, i) => {
 const size = 1 + Math.random() * 2;
 const left = Math.random() * 100;
 const delay = -Math.random() * 24;
 const dur = 26 + Math.random() * 24;
 const dx = (Math.random() - 0.5) * 100;
 const maxop = 0.18 + Math.random() * 0.4;
 const hue = ["#e36c49", "#e1b049", "#6b8bc7", "#aac8b7", "#EDE6D8"][i % 5];
 return { id: i, size, left, delay, dur, dx, maxop, hue };
 });
}

export default function SuperGraphicBackground() {
 const particles = useMemo(() => buildParticles(PARTICLE_COUNT), []);
 const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

 useEffect(() => {
 if (typeof window === "undefined") return;
 const onMove = (e) => {
 setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
 };
 window.addEventListener("mousemove", onMove, { passive: true });
 return () => window.removeEventListener("mousemove", onMove);
 }, []);

 return (
 <div
 aria-hidden
 className="fixed inset-0 pointer-events-none overflow-hidden"
 style={{ zIndex: 0 }}
 data-testid="supergraphic-background"
 >
 {/* Base */}
 <div className="absolute inset-0" style={{ background: "#0A0908" }} />

 {/* === LOGO-INSPIRED BLURRED OVALS === */}
 {/* Mustard / gold top right (matches logo) */}
 <motion.div
 className="absolute"
 style={{
 width: 520,
 height: 560,
 background: "radial-gradient(circle at 35% 35%, #e1b049 0%, #ba892c 45%, #5a3d1a 85%, transparent 100%)",
 filter: "blur(38px)",
 opacity: 0.62,
 top: "-8%",
 right: "8%",
 borderRadius: "50%",
 }}
 animate={{
 x: [0, 30, -20, 15, 0],
 y: [0, 18, -10, 22, 0],
 scale: [1, 1.04, 0.98, 1.02, 1],
 }}
 transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
 />
 {/* Terracotta / dark red center-right (matches logo) */}
 <motion.div
 className="absolute"
 style={{
 width: 580,
 height: 580,
 background: "radial-gradient(circle at 50% 50%, #c24c2b 0%, #6e2a1c 55%, #2a110a 90%, transparent 100%)",
 filter: "blur(34px)",
 opacity: 0.68,
 top: "20%",
 right: "20%",
 borderRadius: "50%",
 }}
 animate={{
 x: [0, -20, 18, -12, 0],
 y: [0, -12, 18, -18, 0],
 scale: [1, 1.03, 0.97, 1.01, 1],
 }}
 transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
 />
 {/* Sage / teal bottom left (matches logo) */}
 <motion.div
 className="absolute"
 style={{
 width: 540,
 height: 540,
 background: "radial-gradient(circle at 50% 50%, #aac8b7 0%, #5a7770 50%, #1c3833 90%, transparent 100%)",
 filter: "blur(40px)",
 opacity: 0.55,
 bottom: "-12%",
 left: "8%",
 borderRadius: "50%",
 }}
 animate={{
 x: [0, 24, -18, 14, 0],
 y: [0, -16, 20, -10, 0],
 scale: [1, 1.04, 0.98, 1.02, 1],
 }}
 transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
 />

 {/* Secondary supporting blobs in new palette */}
 <motion.div
 className="absolute"
 style={{
 width: 360,
 height: 360,
 background: "radial-gradient(circle, #4f70b6 0%, #2a3a66 60%, transparent 100%)",
 filter: "blur(60px)",
 opacity: 0.32,
 top: "55%",
 left: "30%",
 borderRadius: "50%",
 }}
 animate={{
 x: [0, -20, 28, 0],
 y: [0, 16, -12, 0],
 }}
 transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
 />
 <motion.div
 className="absolute"
 style={{
 width: 320,
 height: 320,
 background: "radial-gradient(circle, #cb5186 0%, #5e2440 60%, transparent 100%)",
 filter: "blur(60px)",
 opacity: 0.22,
 top: "8%",
 left: "30%",
 borderRadius: "50%",
 }}
 animate={{
 x: [0, 18, -22, 0],
 y: [0, 14, -16, 0],
 }}
 transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
 />

 {/* Parallax mouse-driven faint glow */}
 <div
 className="absolute pointer-events-none"
 style={{
 width: 480,
 height: 480,
 left: `calc(${mouse.x * 100}% - 240px)`,
 top: `calc(${mouse.y * 100}% - 240px)`,
 background:
 "radial-gradient(circle, rgba(227,108,73,0.16) 0%, rgba(225,176,73,0.06) 40%, transparent 70%)",
 filter: "blur(60px)",
 transition: "left 0.7s ease-out, top 0.7s ease-out",
 }}
 />

 {/* Inner frame subtle structural element */}
 <div
 className="absolute pointer-events-none"
 style={{
 inset: 16,
 border: "1px solid rgba(237,230,216,0.05)",
 borderRadius: 24,
 }}
 />

 {/* Floating particles */}
 <div className="absolute inset-0">
 {particles.map((p) => (
 <span
 key={p.id}
 style={{
 position: "absolute",
 left: `${p.left}%`,
 bottom: "-10vh",
 width: p.size,
 height: p.size,
 borderRadius: "999px",
 background: p.hue,
 boxShadow: `0 0 ${p.size * 3}px ${p.hue}`,
 animation: `drift-up ${p.dur}s linear infinite`,
 animationDelay: `${p.delay}s`,
 "--dx": `${p.dx}px`,
 "--maxop": p.maxop,
 }}
 />
 ))}
 </div>

 {/* Grain noise overlay */}
 <div className="absolute inset-0 noise-overlay pointer-events-none" />

 {/* Top fade for nav legibility */}
 <div
 className="absolute top-0 inset-x-0 h-32 pointer-events-none"
 style={{
 background: "linear-gradient(180deg, rgba(10,9,8,0.85) 0%, transparent 100%)",
 }}
 />
 {/* Bottom fade */}
 <div
 className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
 style={{
 background: "linear-gradient(0deg, rgba(10,9,8,0.7) 0%, transparent 100%)",
 }}
 />
 </div>
 );
}
