import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

/**
 * PageNav — interlinked navigation footer for each landing page section.
 *
 * Site journey (ordered):
 *   / (Home) → /maskot → /kuis → /cek-diri → /polling → /curhat → /jurnal → /profil → /
 *
 * Given the current route, PageNav auto-renders "Kembali" (previous) and
 * "Lanjut" (next) with the corresponding label + soft transition to the target.
 */
const JOURNEY = [
  { path: "/", label: "Beranda" },
  { path: "/maskot", label: "Kenali maskot" },
  { path: "/kuis", label: "Siapa yang dominan" },
  { path: "/cek-diri", label: "Cek diri" },
  { path: "/polling", label: "Suara komunitas" },
  { path: "/curhat", label: "Curhat" },
  { path: "/jurnal", label: "Jurnal" },
  { path: "/profil", label: "Profil" },
];

export default function PageNav({ current }) {
  const idx = JOURNEY.findIndex((j) => j.path === current);
  if (idx === -1) return null;

  const prev = idx === 0 ? JOURNEY[JOURNEY.length - 1] : JOURNEY[idx - 1];
  const next = idx === JOURNEY.length - 1 ? JOURNEY[0] : JOURNEY[idx + 1];

  return (
    <nav
      data-testid="page-nav"
      className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-16"
    >
      {/* Rail with 3 items: previous, home, next */}
      <div className="glass-strong rounded-[32px] p-4 sm:p-5 flex items-center justify-between gap-3">
        <Link
          to={prev.path}
          data-testid="page-nav-prev"
          className="group flex items-center gap-3 px-5 py-3 rounded-full hover:bg-white/5 transition-all duration-300 flex-1 hover-target"
        >
          <span className="w-9 h-9 rounded-full border border-[var(--ivory)]/20 flex items-center justify-center group-hover:border-[var(--terracotta)] group-hover:bg-[var(--terracotta)] transition-all duration-300">
            <ArrowLeft size={14} className="text-[var(--ivory)]" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[8px] font-display tracking-[0.42em] uppercase text-[var(--ivory-soft)]/55">
              Kembali
            </span>
            <span className="font-subhead text-[15px] text-[var(--ivory)] mt-1">
              {prev.label}
            </span>
          </span>
        </Link>

        <Link
          to="/"
          aria-label="Kembali ke beranda"
          data-testid="page-nav-home"
          className="hidden sm:flex w-11 h-11 rounded-full border border-[var(--ivory)]/12 items-center justify-center hover:bg-white/5 hover:border-[var(--ivory)]/30 transition-all duration-300 hover-target"
        >
          <Home size={16} className="text-[var(--ivory-soft)]" />
        </Link>

        <Link
          to={next.path}
          data-testid="page-nav-next"
          className="group flex items-center gap-3 px-5 py-3 rounded-full hover:bg-white/5 transition-all duration-300 flex-1 justify-end text-right hover-target"
        >
          <span className="flex flex-col leading-tight items-end">
            <span className="text-[8px] font-display tracking-[0.42em] uppercase text-[var(--ivory-soft)]/55">
              Lanjut
            </span>
            <span className="font-subhead text-[15px] text-[var(--ivory)] mt-1">
              {next.label}
            </span>
          </span>
          <span className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--terracotta)] bg-[var(--ivory)]">
            <ArrowRight
              size={14}
              className="text-[var(--bg-deep)] group-hover:text-[var(--ivory)] transition-colors duration-300"
            />
          </span>
        </Link>
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {JOURNEY.map((j, i) => (
          <span
            key={j.path}
            aria-hidden="true"
            className="transition-all duration-500"
            style={{
              width: i === idx ? 22 : 4,
              height: 4,
              borderRadius: 4,
              background:
                i === idx ? "var(--terracotta)" : "rgba(237,230,216,0.16)",
            }}
          />
        ))}
      </div>
    </nav>
  );
}
