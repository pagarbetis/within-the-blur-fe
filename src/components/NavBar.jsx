import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { TID } from "@/constants/testIds";
import { LOGOUT } from "@/constants/testIds/auth";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
 { to: "/", label: "BERANDA", testId: TID.nav.home },
 { to: "/maskot", label: "SISIMU", testId: TID.nav.maskot },
 { to: "/kuis", label: "KUIS", testId: TID.nav.kuis },
 { to: "/cek-diri", label: "CEK DIRI", testId: TID.nav.checkin },
 { to: "/polling", label: "POLLING", testId: TID.nav.polling },
 { to: "/curhat", label: "CURHAT", testId: TID.nav.curhat },
 { to: "/jurnal", label: "JURNAL", testId: TID.nav.jurnal },
 { to: "/profil", label: "PROFIL", testId: "nav-profil" },
];

export default function NavBar() {
 const { pathname } = useLocation();
 const navigate = useNavigate();
 const { user, loading, logout } = useAuth();
 const [open, setOpen] = useState(false);

 const handleLogout = async () => {
  await logout();
  setOpen(false);
  navigate("/");
 };

 return (
  <>
   {/* Desktop */}
   <nav className="hidden md:flex fixed top-0 right-0 z-40 gap-2 px-8 py-6 items-center" data-testid="navbar-desktop">
    {NAV_ITEMS.map((item) => {
     const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
     return (
      <Link
       key={item.to}
       to={item.to}
       data-testid={item.testId}
       className={`hover-target px-3 py-2 rounded-full text-[10px] font-display tracking-[0.36em] font-semibold transition-all duration-300 ${
        active
         ? "bg-[var(--ivory)] text-[var(--bg-deep)]"
         : "text-[var(--ivory-soft)] hover:text-[var(--ivory)] hover:bg-white/[0.04]"
       }`}
      >
       {item.label}
      </Link>
     );
    })}

    {!loading && (
     user ? (
      <button
       onClick={handleLogout}
       data-testid={LOGOUT.button}
       title={`Keluar (${user.name || user.email})`}
       className="hover-target ml-1 flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-display tracking-[0.32em] font-semibold text-[var(--ivory-soft)] hover:text-[#e492a5] hover:bg-white/[0.04] transition-all duration-300"
      >
       <LogOut size={13} />
       KELUAR
      </button>
     ) : (
      <Link
       to="/login"
       data-testid="nav-login"
       className={`hover-target ml-1 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-display tracking-[0.32em] font-semibold transition-all duration-300 ${
        pathname === "/login" || pathname === "/register"
         ? "bg-[var(--ivory)] text-[var(--bg-deep)]"
         : "bg-white/[0.06] text-[var(--ivory)] hover:bg-white/[0.1]"
       }`}
      >
       <UserIcon size={13} />
       MASUK
      </Link>
     )
    )}
   </nav>

   {/* Mobile — hamburger */}
   <button
    onClick={() => setOpen(true)}
    aria-label="Buka menu"
    data-testid="navbar-mobile-open"
    className="md:hidden hover-target fixed top-6 right-6 z-40 w-11 h-11 rounded-full glass flex items-center justify-center"
   >
    <Menu size={17} className="text-[var(--ivory)]" />
   </button>

   <AnimatePresence>
    {open && (
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="md:hidden fixed inset-0 z-50 flex flex-col"
     >
      <div className="absolute inset-0 bg-[var(--bg-deep)]/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
      <button
       onClick={() => setOpen(false)}
       aria-label="Tutup menu"
       data-testid="navbar-mobile-close"
       className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full glass flex items-center justify-center"
      >
       <X size={17} className="text-[var(--ivory)]" />
      </button>
      <div className="relative z-0 flex flex-col justify-center items-start gap-6 px-10 h-full">
       {NAV_ITEMS.map((item, i) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
         <motion.div
          key={item.to}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.045 }}
         >
          <Link
           to={item.to}
           onClick={() => setOpen(false)}
           data-testid={`mobile-${item.testId}`}
           className={`hover-target font-display-bold uppercase text-4xl leading-tight transition-colors ${
            active ? "text-[var(--terracotta)]" : "text-[var(--ivory)]"
           }`}
           style={{ letterSpacing: "-0.02em" }}
          >
           {item.label}
          </Link>
         </motion.div>
        );
       })}

       {!loading && (
        <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: NAV_ITEMS.length * 0.045 }}
        >
         {user ? (
          <button
           onClick={handleLogout}
           data-testid={`mobile-${LOGOUT.button}`}
           className="hover-target font-display-bold uppercase text-4xl leading-tight text-[#e492a5]"
           style={{ letterSpacing: "-0.02em" }}
          >
           KELUAR
          </button>
         ) : (
          <Link
           to="/login"
           onClick={() => setOpen(false)}
           data-testid="mobile-nav-login"
           className="hover-target font-display-bold uppercase text-4xl leading-tight text-[var(--ivory)]"
           style={{ letterSpacing: "-0.02em" }}
          >
           MASUK
          </Link>
         )}
        </motion.div>
       )}
      </div>
     </motion.div>
    )}
   </AnimatePresence>
  </>
 );
}
