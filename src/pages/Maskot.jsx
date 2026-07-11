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

function ComputerSilhouette({ awake }) {
  // Icon source: COMPUTER_DIYAH.svg — gradients kept as-provided in the asset,
  // ids prefixed with "cpu-" so they never collide with other SVGs on the page.
  return (
    <svg viewBox="0 0 512 512" width="100%" height="100%">
      <defs>
        <linearGradient id="cpu-lg0" x1="39.95" y1="305.78" x2="294.72" y2="305.78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg1" x1="26.79" y1="367.81" x2="319.13" y2="367.81" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg2" x1="464.39" y1="305.78" x2="719.16" y2="305.78" gradientTransform="translate(936.44) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg3" x1="451.23" y1="367.81" x2="743.57" y2="367.81" gradientTransform="translate(936.44) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg4" x1="321" y1="67" x2="421.92" y2="67" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg5" x1="-76.88" y1="5.69" x2="435.12" y2="517.69" gradientTransform="translate(1405 -292) scale(16 58)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg6" x1="82" y1="297.89" x2="1247.83" y2="297.89" gradientTransform="translate(0 511.89) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset=".16" stopColor="#acc5ae" />
          <stop offset=".39" stopColor="#b7c09a" />
          <stop offset=".67" stopColor="#c8b978" />
          <stop offset=".99" stopColor="#dfaf49" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg7" x1="207" y1="145.89" x2="545.53" y2="145.89" gradientTransform="translate(0 511.89) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
        <linearGradient id="cpu-lg8" x1="170" y1="103.89" x2="662.85" y2="103.89" gradientTransform="translate(0 511.89) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9c7b6" />
          <stop offset="1" stopColor="#e0af49" />
        </linearGradient>
      </defs>

      {/* whole body idle/awake bob */}
      <motion.g
        animate={{ y: awake ? [0, -4, 0, -3, 0] : [0, -2, 0, -1, 0] }}
        transition={{ duration: awake ? 2.2 : 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* right arm + fist — pumps up on hover, gentle sway idle */}
        <motion.g
          animate={{ rotate: awake ? [0, -32, -6, -26, 0] : [0, 3, 0, 2, 0] }}
          transition={{ duration: awake ? 1.4 : 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "82px", originY: "248px", transformOrigin: "82px 248px" }}
        >
          <path fill="url(#cpu-lg0)" d="M67.11,290.63c0-14.18,14.89-13.83,14.89-13.83v-31.03c-27,0-42,20-42,50l-.05,67.08h6.54c6.65,0,19.94,6.65,19.94,0,0,1.19.68-58.04.68-72.22Z" />
          <path fill="url(#cpu-lg1)" d="M31.38,377.57c-6.6-5.67-5.71-14.84.33-19.86,11.66-9.68,28.87-10.09,41.07-.78,3.22,2.46,6.01,7.62,6.01,11.02,0,2.86-2.62,8.06-5.27,10.16-12.29,9.72-29.88,9.96-42.14-.55h0Z" />
        </motion.g>

        {/* left arm + fist — mirrored, opposite phase so they alternate like the reference video */}
        <motion.g
          animate={{ rotate: awake ? [0, 32, 6, 26, 0] : [0, -3, 0, -2, 0] }}
          transition={{ duration: awake ? 1.4 : 5, repeat: Infinity, ease: "easeInOut", delay: awake ? 0.2 : 0.3 }}
          style={{ originX: "430px", originY: "248px", transformOrigin: "430px 248px" }}
        >
          <path fill="url(#cpu-lg2)" d="M445.57,362.84c0,6.65,13.3,0,19.94,0h6.54s-.05-67.08-.05-67.08c0-30-15-50-42-50v31.03s14.89-.35,14.89,13.83.68,73.41.68,72.22Z" />
          <path fill="url(#cpu-lg3)" d="M480.61,377.56c-12.25,10.51-29.85,10.27-42.14.55-2.65-2.1-5.26-7.3-5.27-10.16,0-3.4,2.8-8.56,6.01-11.02,12.2-9.32,29.41-8.9,41.07.78,6.04,5.01,6.93,14.19.33,19.86h0Z" />
        </motion.g>

        {/* ears — twitch like the Chimp's ears for a shared design language */}
        <motion.g
          animate={{ scale: awake ? [1, 1.18, 0.94, 1.08, 1] : [1, 1.04, 1] }}
          transition={{ duration: awake ? 1.6 : 3.4, repeat: Infinity, ease: "easeInOut", repeatDelay: awake ? 0.5 : 1.8 }}
          style={{ originX: "329px", originY: "59px", transformOrigin: "329px 59px" }}
        >
          <path fill="url(#cpu-lg4)" d="M329,38h0c4.42,0,8,3.58,8,8v42c0,4.42-3.58,8-8,8h0c-4.42,0-8-3.58-8-8v-42c0-4.42,3.58-8,8-8Z" />
        </motion.g>
        <motion.g
          animate={{ scale: awake ? [1, 0.92, 1.16, 0.97, 1] : [1, 1.03, 1] }}
          transition={{ duration: awake ? 1.6 : 3.4, repeat: Infinity, ease: "easeInOut", repeatDelay: awake ? 0.6 : 2, delay: 0.15 }}
          style={{ originX: "183px", originY: "59px", transformOrigin: "183px 59px" }}
        >
          <path fill="url(#cpu-lg5)" d="M183,38h0c4.42,0,8,3.58,8,8v42c0,4.42-3.58,8-8,8h0c-4.42,0-8-3.58-8-8v-42c0-4.42,3.58-8,8-8Z" />
        </motion.g>

        {/* body + base */}
        <g>
          <rect fill="url(#cpu-lg6)" x="82" y="88" width="348" height="252" rx="38" ry="38" />
          <path fill="url(#cpu-lg7)" d="M220,340h72l13,52h-98l13-52Z" />
          <path fill="url(#cpu-lg8)" d="M186,392h140c8.84,0,16,7.16,16,16h0c0,8.84-7.16,16-16,16h-140c-8.84,0-16-7.16-16-16h0c0-8.84,7.16-16,16-16Z" />
        </g>

        {/* screen */}
        <rect fill="#f6f6f2" x="112" y="118" width="288" height="192" rx="26" ry="26" />

        {/* eyes — soft idle blink, quicker/livelier blink on awake */}
        <motion.g
          animate={{
            scaleY: awake ? [1, 1, 0.15, 1, 1, 0.15, 1] : [1, 1, 0.12, 1],
          }}
          transition={{
            duration: awake ? 2.2 : 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            times: awake ? [0, 0.35, 0.42, 0.5, 0.85, 0.92, 1] : [0, 0.85, 0.92, 1],
          }}
          style={{ originX: "256px", originY: "183px", transformOrigin: "256px 183px" }}
        >
          <rect fill="#0A0908" x="279.89" y="174.53" width="41.54" height="16.84" rx="8.42" ry="8.42" />
          <rect fill="#0A0908" x="190.58" y="174.53" width="41.54" height="16.84" rx="8.42" ry="8.42" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

function Silhouette({ kind, color, awake }) {
  if (kind === "chimp") return <ChimpSilhouette color={color} awake={awake} />;
  if (kind === "human") return <HumanSilhouette color={color} awake={awake} />;
  return <ComputerSilhouette awake={awake} />;
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
  <div
 className="text-[11px] font-body italic"
 style={{ color: m.accent }}
 >
 → {m.note}
 </div>
  <br />
 <p className="text-sm font-body leading-relaxed text-[var(--ivory-soft)] mb-4">
 {m.body}
 </p>
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
  <br />
  <br />
 Tugasmu:<em>mengenali siapa yang sedang bicara.</em>
  <br />
  <br />
  Dr. Steve Peters adalah seorang psikiater yang banyak bekerja di bidang performa mental, termasuk mendampingi atlet dan profesional dalam memahami cara mereka merespons tekanan. Melalui The Chimp Paradox, ia memperkenalkan sebuah model yang telah membantu banyak orang merefleksikan cara mereka berpikir dan bereaksi.
  <br />
  <br />
  Kalau setelah mencoba kamu merasa ingin mengenal konsep ini lebih jauh, buku The Chimp Paradox bisa menjadi tempat yang baik untuk memulainya.
  <br />
  <br />
<a href="https://www.penguinrandomhouse.com/books/313353/the-chimp-paradox-by-steve-peters/" target="_blank">Link: The Chimp Paradox</a>
  <br />
  <br />
<a href="https://chimpmanagement.com/" target="_blank">Link: Dr. Steve Peters</a>
  <br />
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
