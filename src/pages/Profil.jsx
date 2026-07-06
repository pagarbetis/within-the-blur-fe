import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, HeartPulse, Flame, Trash2, LogOut, Mail, ArrowRight } from "lucide-react";
import PageNav from "@/components/PageNav";
import Reveal from "@/components/Reveal";
import { useAuth } from "@/context/AuthContext";
import {
  getJournal,
  getKuis,
  getCekdiri,
  getStats,
  getProfileColor,
  setProfileColor,
} from "@/lib/localStore";
import {
  listJournalEntries,
  fetchLatestKuis,
  listCekdiriEntries,
  fetchStats,
  updateProfileColor,
} from "@/lib/api";

const PALETTE = [
  { key: "terracotta", hex: "#E36C49", label: "Terracotta" },
  { key: "mustard",    hex: "#E1B049", label: "Mustard" },
  { key: "sage",       hex: "#AAC8B7", label: "Sage" },
  { key: "kabut",      hex: "#6B8BC7", label: "Kabut" },
  { key: "senja",      hex: "#E492A5", label: "Senja" },
];

const MOOD_COLOR = {
  "Tenang": "#aac8b7", "Lelah": "#c24c2b", "Bersyukur": "#e1b049", "Cemas": "#e36c49",
  "Kosong": "#8a857a", "Antusias": "#e492a5", "Sedih": "#4f70b6", "Bingung": "#ba892c",
  "Penuh harap": "#aac8b7", "Marah": "#cb5186", "Damai": "#8db3af", "Kewalahan": "#6b8bc7",
  "Gatau": "#A69985",
  "tenang": "#aac8b7", "syukur": "#e1b049", "lelah": "#c24c2b",
  "harap": "#e492a5", "kosong": "#8a857a", "berani": "#e36c49",
};

const MASCOT_LABEL = {
  chimp: "The Chimp, instingtif",
  human: "The Human, reflektif",
  computer: "The Computer, otomatis",
};

export default function Profil() {
  const { user, loading: authLoading, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [colorKey, setColorKey] = useState(getProfileColor());
  const [journalCount, setJournalCount] = useState(0);
  const [latestKuis, setLatestKuis] = useState(null);
  const [cekDiriEntries, setCekDiriEntries] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    (async () => {
      if (user) {
        setColorKey(user.profileColor || "terracotta");
        try {
          const [journal, kuis, cekdiri, s] = await Promise.all([
            listJournalEntries(),
            fetchLatestKuis(),
            listCekdiriEntries(7),
            fetchStats(),
          ]);
          if (!active) return;
          setJournalCount(journal.length);
          setLatestKuis(kuis);
          setCekDiriEntries(cekdiri);
          setStats(s);
          return;
        } catch (e) {
          // backend hiccup — fall back to whatever's on this device
        }
      }
      if (!active) return;
      setJournalCount(getJournal().length);
      setLatestKuis(getKuis());
      setCekDiriEntries(getCekdiri(7));
      setStats(getStats());
    })();
    return () => { active = false; };
  }, [user, authLoading]);

  const active = PALETTE.find((p) => p.key === colorKey) || PALETTE[0];

  const changeColor = async (k) => {
    setColorKey(k);
    if (user) {
      try {
        const updated = await updateProfileColor(k);
        setUser(updated);
        return;
      } catch (e) {
        // fall back to local so the pick still sticks visually
      }
    }
    setProfileColor(k);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const clearAll = () => {
    if (!window.confirm("Hapus semua jejakmu di perangkat ini? Tindakan ini tidak bisa dibatalkan.")) return;
    // Wipe every WTB storage key so the label truly matches the action.
    localStorage.removeItem("wtb:journal");
    localStorage.removeItem("wtb:kuis");
    localStorage.removeItem("wtb:cekdiri");
    localStorage.removeItem("wtb:profileColor");
    localStorage.removeItem("wtb_curhat_entries_v2");
    setColorKey("terracotta");
    setJournalCount(0);
    setLatestKuis(null);
    setCekDiriEntries([]);
    setStats(getStats());
  };

  return (
    <div data-testid="profil-page" className="min-h-screen pb-24">
      {/* Hero band with active palette */}
      <section
        className="relative pt-36 pb-14 px-6 sm:px-10 lg:px-20 overflow-hidden"
        data-testid="profil-hero"
        style={{ background: `linear-gradient(135deg, ${active.hex}25 0%, transparent 70%)` }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-25"
            style={{ background: `radial-gradient(circle, ${active.hex} 0%, transparent 65%)`, filter: "blur(80px)" }}
          />
          <div
            className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${active.hex} 0%, transparent 65%)`, filter: "blur(80px)" }}
          />
        </div>
        <Reveal>
          <p className="relative text-[10px] font-display tracking-[0.5em] uppercase text-[var(--ivory-soft)] mb-4">
            Profil
          </p>
          <h1
            data-testid="profil-title"
            className="relative font-display-bold uppercase text-5xl md:text-7xl leading-[0.98] text-[var(--ivory)]"
            style={{ letterSpacing: "-0.02em", fontFamily: "'Jost', system-ui, sans-serif" }}
          >
            {user ? (
              <>
                Jejakmu, di<br />
                <span style={{ color: active.hex }}>akunmu.</span>
              </>
            ) : (
              <>
                Jejakmu, di<br />
                <span style={{ color: active.hex }}>perangkat ini.</span>
              </>
            )}
          </h1>
          <p className="relative mt-5 font-body text-[15px] text-[var(--ivory-soft)] max-w-xl leading-relaxed">
            {user
              ? "Semua yang kamu tulis, jawab, dan check-in tersimpan ke akunmu. Login dari perangkat lain, jejakmu tetap ada."
              : "Semua yang kamu tulis, jawab, dan check-in tersimpan di browser ini. Ganti perangkat atau hapus data browser, jejaknya ikut hilang. Itu bagian dari ringannya."}
          </p>
        </Reveal>
      </section>

      {/* Account card — login-aware */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-2 pb-2">
        <div className="max-w-4xl mx-auto">
          {!authLoading && (
            user ? (
              <div
                data-testid="profil-account-card"
                className="glass rounded-[24px] p-6 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${active.hex}22`, border: `1px solid ${active.hex}55` }}
                  >
                    <Mail size={16} style={{ color: active.hex }} />
                  </div>
                  <div>
                    <p data-testid="profil-account-name" className="font-display-bold text-[15px] text-[var(--ivory)]">
                      {user.name || "Tanpa nama"}
                    </p>
                    <p className="font-body text-[12px] text-[var(--ivory-soft)]/70">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  data-testid="profil-logout-button"
                  className="hover-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)]/80 hover:text-[#e492a5] transition-colors"
                >
                  <LogOut size={13} />
                  Keluar
                </button>
              </div>
            ) : (
              <div
                data-testid="profil-guest-card"
                className="glass rounded-[24px] p-6 flex flex-wrap items-center justify-between gap-4"
              >
                <p className="font-body text-[13px] text-[var(--ivory-soft)]/85 max-w-sm">
                  Kamu belum masuk. Bikin akun supaya jejakmu bisa diakses lagi nanti.
                </p>
                <Link
                  to="/login"
                  className="hover-target group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[var(--ivory)] text-[var(--bg-deep)] text-[10px] font-display tracking-[0.32em] uppercase font-semibold transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                >
                  Masuk / Daftar
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5"
                    style={{ background: active.hex }}
                  >
                    <ArrowRight size={12} className="text-[var(--ivory)]" />
                  </span>
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* Palette picker */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-2 pb-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-display tracking-[0.4em] uppercase text-[var(--ivory-soft)] mb-4">
            Warna profilmu
          </p>
          <div className="flex flex-wrap gap-3" data-testid="profil-palette">
            {PALETTE.map((p) => {
              const isActive = p.key === colorKey;
              return (
                <button
                  key={p.key}
                  data-testid={`profil-color-${p.key}`}
                  onClick={() => changeColor(p.key)}
                  className={`hover-target group flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full text-[10px] font-display tracking-[0.28em] uppercase transition-all duration-300 ${
                    isActive ? "bg-white/[0.08]" : "bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                  style={{ border: `1px solid ${isActive ? p.hex + "aa" : "rgba(255,255,255,0.06)"}` }}
                >
                  <span
                    className="w-6 h-6 rounded-full shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: p.hex, boxShadow: isActive ? `0 0 24px ${p.hex}66` : "none" }}
                  />
                  <span className={isActive ? "text-[var(--ivory)]" : "text-[var(--ivory-soft)]/70"}>
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Streak + Weekly Mood Chart */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-4 pb-10">
        <div className="max-w-6xl mx-auto grid gap-5 md:grid-cols-5">
          <div
            data-testid="profil-streak-card"
            className="md:col-span-2 glass rounded-[24px] p-7 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <Flame size={20} className="text-[var(--terracotta)]" />
              <span className="text-[9px] font-mono tracking-[0.36em] uppercase text-[var(--ivory-soft)]/50">Streak</span>
            </div>
            {stats && (
              <>
                <div className="mt-6 flex items-baseline gap-3">
                  <span data-testid="profil-streak-current" className="font-display-bold text-6xl md:text-7xl leading-none text-[var(--ivory)]">
                    {stats.streak.current}
                  </span>
                  <span className="font-body text-[14px] text-[var(--ivory-soft)]/85">
                    {stats.streak.current === 0 ? "belum mulai" : (stats.streak.current === 1 ? "hari" : "hari beruntun")}
                  </span>
                </div>
                <p className="mt-3 font-body text-[13px] text-[var(--ivory)]/70 leading-relaxed">
                  {stats.streak.today ? "Kamu udah cek diri hari ini. Rehat manis buat besok." : "Cek diri hari ini biar streak-mu jalan lagi."}
                </p>
                <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-[9px] font-display tracking-[0.36em] uppercase text-[var(--ivory-soft)]/60">Terpanjang</span>
                  <span data-testid="profil-streak-longest" className="font-display-bold text-lg text-[var(--ivory)]">
                    {stats.streak.longest} <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--ivory-soft)]/50">hari</span>
                  </span>
                </div>
              </>
            )}
            <div className="pointer-events-none absolute -bottom-16 -right-16 w-52 h-52 rounded-full opacity-25"
                 style={{ background: `radial-gradient(circle, ${active.hex} 0%, transparent 70%)`, filter: "blur(40px)" }} />
          </div>

          <div data-testid="profil-chart-card" className="md:col-span-3 glass rounded-[24px] p-7 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <p className="font-display-bold uppercase text-[var(--ivory)] tracking-tight text-[15px] md:text-[16px]">
                Cuaca hati · 7 hari
              </p>
              <span className="text-[9px] font-mono tracking-[0.36em] uppercase text-[var(--ivory-soft)]/50">cek diri + jurnal</span>
            </div>
            {stats && (
              <>
                <div data-testid="profil-mood-chart" className="mt-6 flex items-end justify-between gap-2 h-[130px]">
                  {stats.chart.map((slot, i) => {
                    const color = slot.mood ? (MOOD_COLOR[slot.mood] || "#8a857a") : "rgba(237,230,216,0.10)";
                    const height = slot.mood ? 100 : 22;
                    return (
                      <motion.div
                        key={slot.date}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "bottom" }}
                        className="flex-1 flex flex-col items-center gap-1.5"
                        data-testid={`profil-mood-bar-${i}`}
                      >
                        <div className="w-full flex justify-center h-full items-end">
                          <div
                            title={slot.mood ? `${slot.mood}, ${slot.date}` : `Belum ada ${slot.date}`}
                            className="w-full max-w-[46px] rounded-lg transition-all"
                            style={{
                              height: `${height}%`,
                              background: slot.mood ? `linear-gradient(180deg, ${color} 0%, ${color}b0 100%)` : color,
                              boxShadow: slot.mood ? `0 4px 20px -6px ${color}` : "none",
                              border: slot.mood ? "none" : "1px dashed rgba(237,230,216,0.15)",
                            }}
                          />
                        </div>
                        <span className={`text-[9px] font-display tracking-[0.24em] uppercase ${slot.mood ? "text-[var(--ivory)]/85" : "text-[var(--ivory-soft)]/40"}`}>
                          {slot.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                {stats.chart.every((s) => !s.mood) && (
                  <p className="mt-4 font-body text-[13px] text-[var(--ivory-soft)]/70">
                    Belum ada catatan minggu ini. Coba cek diri sekarang.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-4 pb-12">
        <div className="max-w-6xl mx-auto grid gap-5 md:grid-cols-3">
          <Link
            to="/jurnal"
            data-testid="profil-card-journal"
            className="hover-target group glass rounded-[24px] p-7 transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div className="flex items-center justify-between mb-5">
              <BookOpen size={20} className="text-[var(--mustard)]" />
              <span className="text-[9px] font-mono tracking-[0.36em] uppercase text-[var(--ivory-soft)]/50">Jurnal</span>
            </div>
            <p className="font-display-bold text-6xl leading-none text-[var(--ivory)] mb-2" style={{ letterSpacing: "-0.02em" }}>
              {journalCount}
            </p>
            <p className="font-body text-[13px] text-[var(--ivory-soft)]/85">
              {journalCount === 0 ? "Tulis kalimat pertamamu." : `Catatan dalam ${journalCount === 1 ? "1 hari" : "beberapa hari"}.`}
            </p>
            <div className="mt-6 pt-4 border-t border-white/6 text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)]/60 group-hover:text-[var(--ivory)] transition-colors">
              Buka jurnal →
            </div>
          </Link>

          <Link
            to="/kuis"
            data-testid="profil-card-kuis"
            className="hover-target group glass rounded-[24px] p-7 transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div className="flex items-center justify-between mb-5">
              <Sparkles size={20} className="text-[var(--sage-deep)]" />
              <span className="text-[9px] font-mono tracking-[0.36em] uppercase text-[var(--ivory-soft)]/50">Kuis terakhir</span>
            </div>
            {latestKuis ? (
              <>
                <p className="font-display-bold text-3xl text-[var(--ivory)] uppercase mb-2" style={{ letterSpacing: "-0.01em" }}>
                  {latestKuis.dominant}
                </p>
                <p className="font-body text-[13px] text-[var(--ivory-soft)]/85">
                  {MASCOT_LABEL[latestKuis.dominant] || "Sisi dominan"}
                </p>
              </>
            ) : (
              <>
                <p className="font-display-bold text-3xl text-[var(--ivory)]/60 uppercase mb-2" style={{ letterSpacing: "-0.01em" }}>—</p>
                <p className="font-body text-[13px] text-[var(--ivory-soft)]/85">Belum ada hasil kuis.</p>
              </>
            )}
            <div className="mt-6 pt-4 border-t border-white/6 text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)]/60 group-hover:text-[var(--ivory)] transition-colors">
              {latestKuis ? "Ulangi kuis →" : "Coba kuis →"}
            </div>
          </Link>

          <Link
            to="/cek-diri"
            data-testid="profil-card-cekdiri"
            className="hover-target group glass rounded-[24px] p-7 transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div className="flex items-center justify-between mb-5">
              <HeartPulse size={20} className="text-[var(--terracotta)]" />
              <span className="text-[9px] font-mono tracking-[0.36em] uppercase text-[var(--ivory-soft)]/50">Cek Diri</span>
            </div>
            {cekDiriEntries.length > 0 ? (
              <>
                <p className="font-display-bold text-3xl text-[var(--ivory)] uppercase mb-2" style={{ letterSpacing: "-0.01em" }}>
                  {cekDiriEntries[0].feeling}
                </p>
                <p className="font-body text-[13px] text-[var(--ivory-soft)]/85">
                  {cekDiriEntries.length} check-in minggu ini
                </p>
              </>
            ) : (
              <>
                <p className="font-display-bold text-3xl text-[var(--ivory)]/60 uppercase mb-2" style={{ letterSpacing: "-0.01em" }}>—</p>
                <p className="font-body text-[13px] text-[var(--ivory-soft)]/85">Belum ada check-in.</p>
              </>
            )}
            <div className="mt-6 pt-4 border-t border-white/6 text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)]/60 group-hover:text-[var(--ivory)] transition-colors">
              Cek diri sekarang →
            </div>
          </Link>
        </div>

        {/* Clear data */}
        <div className="max-w-6xl mx-auto mt-10 flex justify-end">
          <button
            data-testid="profil-clear-all"
            onClick={clearAll}
            title={user ? "Hanya menghapus salinan lokal di perangkat ini, bukan data di akunmu." : undefined}
            className="hover-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)]/80 hover:text-[#e492a5] transition-colors"
          >
            <Trash2 size={13} />
            {user ? "Hapus salinan lokal di perangkat" : "Hapus semua jejak di perangkat"}
          </button>
        </div>
      </section>

      <PageNav current="/profil" />
    </div>
  );
}
