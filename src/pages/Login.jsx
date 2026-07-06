import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useAuth } from "@/context/AuthContext";
import { LOGIN } from "@/constants/testIds/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/profil";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="login-page" className="relative min-h-screen flex items-center px-6 sm:px-10 lg:px-20 pt-32 pb-24">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — brand / mood copy, same language as Home hero */}
        <div>
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-12 h-[1px]" style={{ background: "#e36c49" }} />
              <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[#e36c49]">
                Jeda · Sadar · Kenali
              </p>
            </div>
          </Reveal>

          <h1
            className="font-display-bold text-[var(--ivory)] leading-[0.9] uppercase"
            style={{ fontSize: "clamp(44px, 8vw, 96px)" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="block"
            >
              SELAMAT
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="block text-gradient-warm"
            >
              KEMBALI.
            </motion.span>
          </h1>

          <Reveal delay={0.6}>
            <p className="mt-8 font-subhead text-lg md:text-xl text-[var(--ivory)]/90 max-w-md leading-relaxed">
              Masuk untuk lanjutkan jejakmu, di mana pun kamu berhenti terakhir kali.
            </p>
          </Reveal>
        </div>

        {/* Right — form card */}
        <Reveal delay={0.4}>
          <div className="glass rounded-[32px] p-8 md:p-10 relative overflow-hidden">
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, #e36c49 0%, transparent 70%)", filter: "blur(50px)" }}
            />
            <p className="relative text-[10px] font-display tracking-[0.42em] uppercase text-[var(--ivory-soft)] mb-1">
              Masuk
            </p>
            <h2 className="relative font-display-bold text-3xl uppercase text-[var(--ivory)] mb-7">
              Ke akunmu.
            </h2>

            <form onSubmit={onSubmit} className="relative space-y-4" data-testid="login-form">
              <div>
                <label className="block text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)] mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 focus-within:border-[#e36c49]/60 transition-colors">
                  <Mail size={16} className="text-[var(--ivory-soft)]/60 shrink-0" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kamu@email.com"
                    data-testid={LOGIN.emailInput}
                    className="w-full bg-transparent outline-none text-[var(--ivory)] placeholder:text-[var(--ivory-soft)]/40 font-body text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-display tracking-[0.32em] uppercase text-[var(--ivory-soft)] mb-2">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 focus-within:border-[#e36c49]/60 transition-colors">
                  <Lock size={16} className="text-[var(--ivory-soft)]/60 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    data-testid={LOGIN.passwordInput}
                    className="w-full bg-transparent outline-none text-[var(--ivory)] placeholder:text-[var(--ivory-soft)]/40 font-body text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="hover-target shrink-0 text-[var(--ivory-soft)]/60 hover:text-[var(--ivory)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/login"
                  data-testid={LOGIN.forgotPasswordLink}
                  onClick={(e) => {
                    e.preventDefault();
                    setError("Fitur reset password belum tersedia. Hubungi tim Within the Blur.");
                  }}
                  className="hover-target text-[11px] font-body text-[var(--ivory-soft)]/70 hover:text-[#e1b049] transition-colors"
                >
                  Lupa password?
                </Link>
              </div>

              {error && (
                <p data-testid="login-error" className="text-[13px] font-body text-[#e492a5] leading-relaxed">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                data-testid={LOGIN.submitButton}
                className="group w-full mt-2 inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[var(--ivory)] text-[var(--bg-deep)] text-[10px] font-display tracking-[0.32em] uppercase font-semibold transition-transform duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:pointer-events-none hover-target"
                style={{ boxShadow: "0 10px 40px -10px rgba(227,108,73,0.4)" }}
              >
                {loading ? "Memproses..." : "Masuk"}
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5"
                  style={{ background: "#e36c49" }}
                >
                  <ArrowRight size={14} className="text-[var(--ivory)]" />
                </span>
              </button>
            </form>

            <p className="relative mt-7 text-center text-[13px] font-body text-[var(--ivory-soft)]/80">
              Belum punya akun?{" "}
              <Link
                to="/register"
                data-testid={LOGIN.registerLink}
                className="hover-target text-[var(--ivory)] font-medium hover:text-[#e1b049] transition-colors"
              >
                Daftar dulu
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
