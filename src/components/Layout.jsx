import React from "react";
import NavBar from "@/components/NavBar";
import AudioToggle from "@/components/AudioToggle";
import SuperGraphicBackground from "@/components/SuperGraphicBackground";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
 const { pathname } = useLocation();
 return (
 <>
 <SuperGraphicBackground />
 <NavBar />
 <main className="relative z-10 min-h-screen">
 <motion.div
 key={pathname}
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, ease: "easeOut" }}
 >
 {children}
 </motion.div>
 </main>
 <AudioToggle />
 <FooterBadge />
 </>
 );
}

function FooterBadge() {
 return (
 <div className="relative z-10 py-12 text-center space-y-3">
 <p className="text-[10px] font-display tracking-[0.5em] uppercase text-[var(--ivory-soft)]/55">
 within the blur · jeda. sadar. kenali.
 </p>
 </div>
 );
}
