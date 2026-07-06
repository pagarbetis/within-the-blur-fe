import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RefreshCw, Send } from "lucide-react";
import Reveal from "@/components/Reveal";
import { TID } from "@/constants/testIds";
import PageNav from "@/components/PageNav";
import { addCekdiri } from "@/lib/localStore";
import { useAuth } from "@/context/AuthContext";
import { saveCekdiriEntry } from "@/lib/api";

const FEELINGS = [
 { label: "Tenang", color: "#aac8b7" },
 { label: "Lelah", color: "#c24c2b" },
 { label: "Bersyukur", color: "#e1b049" },
 { label: "Cemas", color: "#e36c49" },
 { label: "Kosong", color: "#8a857a" },
 { label: "Antusias", color: "#e492a5" },
 { label: "Sedih", color: "#4f70b6" },
 { label: "Bingung", color: "#ba892c" },
 { label: "Penuh harap", color: "#aac8b7" },
 { label: "Marah", color: "#cb5186" },
 { label: "Damai", color: "#8db3af" },
 { label: "Kewalahan", color: "#6b8bc7" },
 { label: "Gatau", color: "#A69985" },
];

const REFLECTIONS = {
 Tenang: "Catat ketenanganmu hari ini. Itu adalah data. Kondisi yang bisa kamu ulangi.",
 Lelah: "Tubuhmu sedang memberi sinyal. Beri istirahat sebelum dipaksa berhenti.",
 Bersyukur: "Tulis satu hal kecil yang bikin kamu bersyukur. Otak butuh latihan ini.",
 Cemas: "Tarik napas 4 4 6 (tarik 4, tahan 4, lepas 6). Ulangi tiga kali.",
 Kosong: "Tidak apa-apa kosong. Coba satu hal kecil yang familiar.",
 Antusias: "Salurkan energimu ke satu hal yang berarti. Bukan ke semuanya.",
 Sedih: "Sedih itu valid. Kamu tidak perlu cepat-cepat merasa baik.",
 Bingung: "Tulis pertanyaanmu, bukan jawabannya. Jawaban datang belakangan.",
 "Penuh harap": "Simpan harapanmu. Cukup satu langkah kecil hari ini.",
 Marah: "Marahmu valid. Tulis di curhat agar ia tidak menumpuk.",
 Damai: "Damai itu jarang. Saat ia datang, beri jeda yang panjang.",
 Kewalahan: "Berhenti dulu. Pilih satu hal terkecil yang bisa kamu mulai sekarang.",
 Gatau: "Tidak apa-apa belum tahu. Duduk sebentar, tarik napas pelan. Rasa akan pelan-pelan muncul sendiri.",
};

export default function CekDiri() {
 const { user } = useAuth();
 const [step, setStep] = useState(0);
 const [picked, setPicked] = useState(null);
 const [note, setNote] = useState("");

 const reset = () => {
 setStep(0);
 setPicked(null);
 setNote("");
 };

 const submit = async () => {
  if (!picked) return;
  if (user) {
   try {
    await saveCekdiriEntry({ feeling: picked, note });
    setStep(2);
    return;
   } catch (e) {
    // fall through to local save so the check-in isn't lost
   }
  }
  addCekdiri({ feeling: picked, note });
  setStep(2);
 };

 return (
 <div
 data-testid={TID.checkin.section}
 className="px-6 sm:px-10 lg:px-20 pt-36 pb-24 min-h-screen"
 >
 <Reveal>
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#e36c49] mb-4">
 Cek diri
 </p>
 <h1
 className="font-display-bold text-5xl md:text-7xl uppercase leading-[1.02] text-[var(--ivory)]"
 style={{ letterSpacing: "-0.015em" }}
 >
 Bagaimana kabar
 <br />
 <span className="text-gradient-warm">dirimu</span> hari ini?
 </h1>
 <p className="mt-6 font-body text-[var(--ivory-soft)] max-w-xl leading-relaxed">
 Pilih satu kata yang paling dekat. Tidak ada salah benar yang penting
 jujur.
 </p>
 </Reveal>

 <div className="mt-14">
 <AnimatePresence mode="wait">
 {step === 0 && (
 <motion.div
 key="pick"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 transition={{ duration: 0.5 }}
 >
 <div className="flex flex-wrap gap-3">
 {FEELINGS.map((f, i) => {
 const active = picked === f.label;
 return (
 <motion.button
 key={f.label}
 data-testid={TID.checkin.pill(i)}
 onClick={() => {
 setPicked(f.label);
 setTimeout(() => setStep(1), 300);
 }}
 whileHover={{ scale: 1.04 }}
 whileTap={{ scale: 0.96 }}
 className="hover-target relative px-5 py-3 rounded-full text-sm font-display tracking-wide transition-all duration-300"
 style={{
 background: active ? f.color : "rgba(255,255,255,0.04)",
 border: `1px solid ${active ? f.color : "rgba(255,255,255,0.1)"}`,
 color: active ? "var(--bg-deep)" : "var(--ivory)",
 boxShadow: active ? `0 0 30px ${f.color}66` : "none",
 fontWeight: active ? 600 : 400,
 }}
 >
 {f.label}
 </motion.button>
 );
 })}
 </div>
 </motion.div>
 )}

 {step === 1 && (
 <motion.div
 key="note"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 transition={{ duration: 0.5 }}
 className="max-w-2xl"
 >
 <div className="glass rounded-3xl p-8">
 <div className="flex items-center gap-3 mb-6">
 <span className="text-[10px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)]">
 Kamu memilih
 </span>
 <span
 className="px-3 py-1 rounded-full text-xs font-display tracking-wide"
 style={{ background: "#e36c49", color: "var(--bg-deep)" }}
 >
 {picked}
 </span>
 </div>
 <label
 className="block font-display-bold text-2xl md:text-3xl uppercase leading-tight text-[var(--ivory)] mb-5"
 style={{ letterSpacing: "-0.01em" }}
 >
 Mau tulis sedikit?{" "}
 <span className="font-body normal-case text-[var(--ivory-soft)] text-base">(opsional)</span>
 </label>
 <textarea
 data-testid={TID.checkin.note}
 value={note}
 onChange={(e) => setNote(e.target.value)}
 placeholder="Tulis apa yang ada di pikiranmu. Sependek atau sepanjang yang kamu mau."
 rows={5}
 className="w-full bg-transparent border border-white/10 rounded-2xl p-4 font-body text-[var(--ivory)] placeholder:text-[var(--ivory-soft)]/55 focus:outline-none focus:border-[#e36c49]/60 transition-colors resize-none hover-target"
 />
 <div className="mt-6 flex flex-wrap gap-3">
 <button
 data-testid={TID.checkin.submit}
 onClick={submit}
 className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-display tracking-[0.32em] uppercase font-semibold transition-all"
 style={{
 background: "var(--ivory)",
 color: "var(--bg-deep)",
 boxShadow: "0 8px 30px -8px rgba(227,108,73,0.4)",
 }}
 >
 <Send size={14} />
 Simpan
 </button>
 <button
 onClick={reset}
 className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory)]/80"
 >
 Pilih ulang
 </button>
 </div>
 </div>
 </motion.div>
 )}

 {step === 2 && (
 <motion.div
 key="result"
 initial={{ opacity: 0, scale: 0.96 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.96 }}
 transition={{ duration: 0.6 }}
 data-testid={TID.checkin.result}
 className="max-w-3xl"
 >
 <div
 className="glass rounded-3xl p-10 relative overflow-hidden"
 style={{
 boxShadow: "0 30px 90px -30px rgba(227,108,73,0.25)",
 }}
 >
 <div
 className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-30"
 style={{
 background: "radial-gradient(circle, #e36c49 0%, transparent 70%)",
 filter: "blur(40px)",
 }}
 />
 <div className="relative">
 <div
 className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7"
 style={{
 background: "rgba(227,108,73,0.15)",
 border: "1px solid rgba(227,108,73,0.35)",
 }}
 >
 <Check size={14} style={{ color: "#e36c49" }} />
 <span
 className="text-[10px] font-display tracking-[0.36em] uppercase"
 style={{ color: "#e36c49" }}
 >
 Tersimpan
 </span>
 </div>
 <p className="text-[10px] font-display tracking-[0.4em] uppercase text-[var(--ivory-soft)] mb-3">
 Hari ini kamu merasa
 </p>
 <h2
 className="font-display-bold text-5xl md:text-7xl uppercase text-[var(--ivory)] mb-6"
 style={{ letterSpacing: "-0.015em" }}
 >
 {picked}.
 </h2>
 <p className="font-body text-lg leading-relaxed text-[var(--ivory)]/90 max-w-2xl">
 {REFLECTIONS[picked] || "Apapun yang kamu rasakan, valid."}
 </p>
 {note && (
 <div className="mt-8 p-5 rounded-2xl border border-white/10">
 <p className="text-[10px] font-display tracking-[0.36em] uppercase mb-2" style={{ color: "#e1b049" }}>
 Catatanmu
 </p>
 <p className="font-body text-[var(--ivory)]/85 leading-relaxed">
 {note}
 </p>
 </div>
 )}
 <div className="mt-9 flex flex-wrap gap-3">
 <button
 data-testid={TID.checkin.reset}
 onClick={reset}
 className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-display tracking-[0.32em] uppercase font-semibold"
 style={{ background: "var(--ivory)", color: "var(--bg-deep)" }}
 >
 <RefreshCw size={14} />
 Cek lagi
 </button>
 <a
 href="/jurnal"
 className="hover-target inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory)]/80"
 >
 Tulis di jurnal
 </a>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
      <PageNav current="/cek-diri" />
    </div>
  );
}
