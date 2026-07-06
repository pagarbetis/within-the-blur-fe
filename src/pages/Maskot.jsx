import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { TID } from "@/constants/testIds";
import PageNav from "@/components/PageNav";

// The Chimp Paradox Dr. Steve Peters
// 3 sides: The Chimp · The Human · The Computer
const MASCOTS = [
 {
 name: "The Chimp",
 role: "Sisi emosional",
 tagline: "Impulsif · Reaktif · Bertahan hidup",
 body:
 "Bagian otakmu yang bicara duluan, sebelum kamu sempat berpikir. Si Chimp adalah insting kuat, cepat, dan sulit dikontrol. Ia bukan musuh; ia bagian dari dirimu yang ingin melindungimu.",
 note: "Cara berdamai: beri ia ruang dulu, baru ajak bicara.",
 accent: "#e36c49",
 accentSoft: "#c24c2b",
 silhouette: "chimp",
 },
 {
 name: "The Human",
 role: "Sisi rasional",
 tagline: "Sadar · Memilih · Berpikir jernih",
 body:
 "Bagian dirimu yang berpikir jernih, menimbang nilai, mengambil keputusan dengan kepala dingin. Sang Human adalah versi paling matang dari dirimu yang sadar atas apa yang sedang terjadi.",
 note: "Cara menguatkan: latih jeda sebelum bereaksi.",
 accent: "#e1b049",
 accentSoft: "#ba892c",
 silhouette: "human",
 },
 {
 name: "The Computer",
 role: "Sisi otomatis",
 tagline: "Memori · Kebiasaan · Keyakinan",
 body:
 "Bagian otak yang merekam pengalaman, kepercayaan, kebiasaan. Si Computer bekerja diam-diam kamu mungkin tidak sadar, tapi ia memandu sebagian besar reaksimu sehari-hari.",
 note: "Cara merawat: isi dengan kebiasaan dan keyakinan yang sehat.",
 accent: "#aac8b7",
 accentSoft: "#8db3af",
 silhouette: "computer",
 },
];

// ============ Animated SVG Silhouettes ============
function ChimpSilhouette({ color, awake }) {
 return (
 <svg viewBox="0 0 200 240" width="100%" height="100%" fill={color}>
 {/* body slight breathing bob */}
 <motion.g
 animate={{ y: [0, -2, 0, -1, 0] }}
 transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
 >
 <ellipse cx="80" cy="160" rx="56" ry="64" />
 {/* feet */}
 <ellipse cx="58" cy="220" rx="14" ry="10" />
 <ellipse cx="102" cy="220" rx="14" ry="10" />
 </motion.g>

 {/* ears twitch occasionally */}
 <motion.circle
 cx="38" cy="100" r="16"
 animate={{ scale: awake ? [1, 1.18, 0.95, 1.05, 1] : [1, 1.05, 1] }}
 transition={{
 duration: awake ? 1.6 : 4,
 repeat: Infinity,
 ease: "easeInOut",
 repeatDelay: awake ? 0.6 : 2,
 }}
 style={{ originX: "38px", originY: "100px", transformOrigin: "38px 100px" }}
 />
 <motion.circle
 cx="122" cy="100" r="16"
 animate={{ scale: awake ? [1, 0.92, 1.15, 0.97, 1] : [1, 1.04, 1] }}
 transition={{
 duration: awake ? 1.6 : 4,
 repeat: Infinity,
 ease: "easeInOut",
 repeatDelay: awake ? 0.7 : 2.2,
 delay: 0.15,
 }}
 style={{ originX: "122px", originY: "100px", transformOrigin: "122px 100px" }}
 />

 {/* head sway gently */}
 <motion.ellipse
 cx="80" cy="100" rx="44" ry="44"
 animate={{ rotate: awake ? [0, 4, -3, 5, 0] : [0, 1.5, -1.5, 0] }}
 transition={{ duration: awake ? 3.2 : 6, repeat: Infinity, ease: "easeInOut" }}
 style={{ transformOrigin: "80px 100px" }}
 />

 {/* TAIL wags */}
 <motion.path
 d="M 130 180 Q 175 165 170 110 Q 168 88 150 92"
 stroke={color}
 strokeWidth="11"
 fill="none"
 strokeLinecap="round"
 animate={{
 d: awake
 ? [
 "M 130 180 Q 175 165 170 110 Q 168 88 150 92",
 "M 130 180 Q 188 168 170 100 Q 158 78 140 88",
 "M 130 180 Q 170 160 178 116 Q 178 92 158 96",
 "M 130 180 Q 180 170 168 108 Q 162 84 144 90",
 "M 130 180 Q 175 165 170 110 Q 168 88 150 92",
 ]
 : [
 "M 130 180 Q 175 165 170 110 Q 168 88 150 92",
 "M 130 180 Q 178 168 172 108 Q 168 88 148 91",
 "M 130 180 Q 175 165 170 110 Q 168 88 150 92",
 ],
 }}
 transition={{
 duration: awake ? 1.8 : 5,
 repeat: Infinity,
 ease: "easeInOut",
 }}
 />
 </svg>
 );
}

function HumanSilhouette({ color, awake }) {
 return (
 <svg viewBox="0 0 200 240" width="100%" height="100%" fill={color}>
 {/* breath scaleY whole body subtly */}
 <motion.g
 animate={{ scaleY: [1, 1.015, 1, 1.012, 1] }}
 transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
 style={{ transformOrigin: "100px 240px" }}
 >
 {/* body */}
 <rect x="58" y="112" width="84" height="100" rx="12" />
 {/* neck */}
 <rect x="92" y="92" width="16" height="22" />
 {/* feet */}
 <ellipse cx="76" cy="226" rx="12" ry="8" />
 <ellipse cx="124" cy="226" rx="12" ry="8" />
 </motion.g>

 {/* head tilts gently, more on awake */}
 <motion.ellipse
 cx="100" cy="56" rx="34" ry="42"
 animate={{
 rotate: awake ? [0, 5, -4, 3, 0] : [0, 2, -2, 0],
 y: awake ? [0, -1.5, 0] : [0],
 }}
 transition={{ duration: awake ? 3.2 : 5.5, repeat: Infinity, ease: "easeInOut" }}
 style={{ transformOrigin: "100px 80px" }}
 />
 </svg>
 );
}

function ComputerSilhouette({ color, awake }) {
 return (
 <svg viewBox="0 0 200 240" width="100%" height="100%" fill={color}>
 {/* whole body bob */}
 <motion.g
 animate={{ y: [0, -2, 0, -1, 0] }}
 transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
 >
 {/* antennas stems */}
 <rect x="74" y="6" width="6" height="22" rx="3" />
 <rect x="118" y="6" width="6" height="22" rx="3" />
 {/* head */}
 <rect x="56" y="30" width="88" height="60" rx="12" />
 {/* neck */}
 <rect x="86" y="90" width="28" height="14" />
 {/* body */}
 <rect x="44" y="104" width="112" height="76" rx="10" />
 {/* arms */}
 <rect x="28" y="116" width="14" height="48" rx="6" />
 <rect x="158" y="116" width="14" height="48" rx="6" />
 <rect x="22" y="158" width="22" height="14" rx="4" />
 <rect x="156" y="158" width="22" height="14" rx="4" />
 {/* legs */}
 <rect x="64" y="184" width="22" height="40" rx="4" />
 <rect x="114" y="184" width="22" height="40" rx="4" />
 <rect x="58" y="222" width="34" height="12" rx="2" />
 <rect x="108" y="222" width="34" height="12" rx="2" />
 </motion.g>

 {/* antenna LEDs blink */}
 <motion.circle
 cx="77" cy="6" r="4"
 animate={{
 opacity: awake ? [1, 0.3, 1, 0.4, 1] : [1, 0.6, 1],
 }}
 transition={{
 duration: awake ? 1.2 : 3,
 repeat: Infinity,
 ease: "easeInOut",
 }}
 />
 <motion.circle
 cx="121" cy="6" r="4"
 animate={{
 opacity: awake ? [1, 0.4, 1, 0.3, 1] : [1, 0.6, 1],
 }}
 transition={{
 duration: awake ? 1.4 : 3,
 repeat: Infinity,
 ease: "easeInOut",
 delay: 0.25,
 }}
 />

 {/* glowing eyes (small inner squares) visible on awake */}
 <motion.g
 animate={{ opacity: awake ? [0, 0.85, 0.85, 0] : [0] }}
 transition={{
 duration: awake ? 2.4 : 0,
 repeat: Infinity,
 times: [0, 0.15, 0.85, 1],
 ease: "easeInOut",
 }}
 >
 <rect x="74" y="52" width="10" height="6" rx="1" fill="#0A0908" />
 <rect x="116" y="52" width="10" height="6" rx="1" fill="#0A0908" />
 </motion.g>
 </svg>
 );
}

function Silhouette({ kind, color, awake }) {
 if (kind === "chimp") return <ChimpSilhouette color={color} awake={awake} />;
 if (kind === "human") return <HumanSilhouette color={color} awake={awake} />;
 return <ComputerSilhouette color={color} awake={awake} />;
}

// Speech bubble that appears on hover
const SPEECH = {
 chimp: "Aku reaksi pertamamu.",
 human: "Aku yang memilih.",
 computer: "Aku yang merekam.",
};

function MascotCard({ m, i }) {
 const cardRef = useRef(null);
 const [tilt, setTilt] = useState({ x: 0, y: 0 });
 const [hover, setHover] = useState(false);

 const handleMove = (e) => {
 const r = cardRef.current?.getBoundingClientRect();
 if (!r) return;
 const px = (e.clientX - r.left) / r.width - 0.5;
 const py = (e.clientY - r.top) / r.height - 0.5;
 setTilt({ x: -py * 6, y: px * 8 });
 };
 const handleLeave = () => {
 setTilt({ x: 0, y: 0 });
 setHover(false);
 };
 const handleEnter = () => setHover(true);

 return (
 <motion.div
 ref={cardRef}
 data-testid={TID.maskot.card(i)}
 onMouseMove={handleMove}
 onMouseLeave={handleLeave}
 onMouseEnter={handleEnter}
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.8, delay: i * 0.15 }}
 style={{
 transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
 transition: "transform 0.25s ease-out",
 }}
 className="relative glass rounded-[28px] p-8 md:p-10 overflow-hidden hover-target group"
 >
 {/* Mascot silhouette clean, no background glow / halo, extra large */}
 <div className="relative h-80 md:h-[22rem] flex items-center justify-center mb-6">
 <motion.div
 className="relative"
 style={{ width: 260, height: 320, color: m.accent }}
 animate={{
 scale: hover ? 1.06 : 1,
 }}
 transition={{ type: "spring", stiffness: 220, damping: 22 }}
 >
 <Silhouette kind={m.silhouette} color={m.accent} awake={hover} />
 </motion.div>

 {/* Speech bubble appears on hover */}
 <motion.div
 className="absolute top-4 right-4 pointer-events-none"
 initial={{ opacity: 0, y: 8, scale: 0.9 }}
 animate={{
 opacity: hover ? 1 : 0,
 y: hover ? 0 : 8,
 scale: hover ? 1 : 0.9,
 }}
 transition={{ duration: 0.3 }}
 >
 <div
 className="px-3 py-1.5 rounded-full text-[10px] font-display tracking-[0.24em] uppercase"
 style={{
 background: m.accent,
 color: "#0A0908",
 boxShadow: `0 8px 20px -6px ${m.accent}99`,
 fontWeight: 600,
 }}
 >
 "{SPEECH[m.silhouette]}"
 </div>
 </motion.div>
 </div>

 <div className="relative">
 <div
 className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-display tracking-[0.36em] uppercase mb-4"
 style={{
 background: `${m.accent}22`,
 border: `1px solid ${m.accent}44`,
 color: m.accent,
 }}
 >
 0{i + 1} · {m.role}
 </div>
 <h3
 className="font-display-bold text-4xl md:text-5xl uppercase text-[var(--ivory)] mb-2"
 style={{ letterSpacing: "-0.015em" }}
 >
 {m.name}
 </h3>
 <p
 className="text-[10px] font-display tracking-[0.3em] uppercase mb-5"
 style={{ color: m.accentSoft }}
 >
 {m.tagline}
 </p>
 <p className="text-sm font-body leading-relaxed text-[var(--ivory-soft)] mb-4">
 {m.body}
 </p>
 <div
 className="text-[11px] font-body italic"
 style={{ color: m.accent }}
 >
 → {m.note}
 </div>
 </div>
 </motion.div>
 );
}

export default function Maskot() {
 return (
 <div
 data-testid={TID.maskot.section}
 className="px-6 sm:px-10 lg:px-20 pt-36 pb-24 min-h-screen"
 >
 <Reveal>
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#aac8b7] mb-4">
 Maskot · The Chimp Paradox
 </p>
 <h1
 className="font-display-bold text-5xl md:text-7xl uppercase leading-[1.02] text-[var(--ivory)] max-w-4xl"
 style={{ letterSpacing: "-0.015em" }}
 >
 Tiga sisi
 <br />
 dalam <span className="text-gradient-warm">satu dirimu.</span>
 </h1>
 <p className="mt-6 text-base font-body text-[var(--ivory-soft)] max-w-2xl leading-relaxed">
 Konsep ini diambil dari buku <em>The Chimp Paradox</em> oleh Dr. Steve
 Peters. Bukan untuk dipilih satu mereka tinggal bersama di dalammu.
 Tugasmu: mengenali siapa yang sedang bicara.
 <span className="block mt-2 text-[#e1b049] text-[10px] font-display tracking-[0.34em] uppercase">
 ↓ Arahkan kursor ke maskot mereka hidup.
 </span>
 </p>
 </Reveal>

 <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
 {MASCOTS.map((m, i) => (
 <MascotCard key={m.name} m={m} i={i} />
 ))}
 </div>

 <Reveal delay={0.3}>
 <div className="mt-20 glass rounded-[28px] p-10 md:p-14 max-w-4xl">
 <p className="text-[10px] font-display tracking-[0.42em] uppercase text-[#e1b049] mb-5">
 Catatan
 </p>
 <p
 className="font-display-bold text-3xl md:text-4xl uppercase leading-[1.05] text-[var(--ivory)]"
 style={{ letterSpacing: "-0.01em" }}
 >
 Kamu bukan si Chimp.
 <br />
 Kamu bukan si Computer.
 <br />
 <span className="text-gradient-warm">Kamu adalah Human</span> yang
 sedang mengenali keduanya.
 </p>
 </div>
 </Reveal>
      <PageNav current="/maskot" />
    </div>
  );
}
