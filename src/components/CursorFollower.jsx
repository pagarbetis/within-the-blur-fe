import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Cursor baru: pill morph cursor (selaras dengan supergrafis pill shapes).
// Idle → small horizontal pill (gradient) + tiny center dot.
// Hover → pill expand + rotate 90° (becomes a tall vertical pill).
// Click → scale down (responsive feedback).
export default function CursorFollower() {
 const [pos, setPos] = useState({ x: -100, y: -100 });
 const [hovering, setHovering] = useState(false);
 const [hidden, setHidden] = useState(false);
 const [clicking, setClicking] = useState(false);
 const rafRef = useRef(0);
 const target = useRef({ x: -100, y: -100 });

 useEffect(() => {
 const isTouch = window.matchMedia("(hover: none)").matches;
 if (isTouch) {
 setHidden(true);
 return;
 }
 const onMove = (e) => {
 target.current = { x: e.clientX, y: e.clientY };
 };
 const onOver = (e) => {
 const t = e.target;
 if (
 t.closest("a, button, [role='button'], input, textarea, .hover-target")
 ) {
 setHovering(true);
 } else {
 setHovering(false);
 }
 };
 const onDown = () => setClicking(true);
 const onUp = () => setClicking(false);
 const onLeave = () => setPos({ x: -100, y: -100 });

 window.addEventListener("mousemove", onMove, { passive: true });
 window.addEventListener("mouseover", onOver, { passive: true });
 window.addEventListener("mousedown", onDown);
 window.addEventListener("mouseup", onUp);
 window.addEventListener("mouseleave", onLeave, { passive: true });

 const tick = () => {
 setPos((p) => ({
 x: p.x + (target.current.x - p.x) * 0.22,
 y: p.y + (target.current.y - p.y) * 0.22,
 }));
 rafRef.current = requestAnimationFrame(tick);
 };
 rafRef.current = requestAnimationFrame(tick);

 return () => {
 window.removeEventListener("mousemove", onMove);
 window.removeEventListener("mouseover", onOver);
 window.removeEventListener("mousedown", onDown);
 window.removeEventListener("mouseup", onUp);
 window.removeEventListener("mouseleave", onLeave);
 cancelAnimationFrame(rafRef.current);
 };
 }, []);

 if (hidden) return null;

 const pillWidth = hovering ? 16 : 36;
 const pillHeight = hovering ? 36 : 10;
 const pillRotate = hovering ? 90 : 0;
 const scale = clicking ? 0.55 : 1;

 return (
 <>
 {/* Center dot always */}
 <motion.div
 className="cursor-follower fixed pointer-events-none"
 style={{
 left: pos.x,
 top: pos.y,
 zIndex: 9999,
 translateX: "-50%",
 translateY: "-50%",
 }}
 animate={{ scale: hovering ? 0.5 : 1 }}
 transition={{ type: "spring", stiffness: 420, damping: 26 }}
 >
 <div
 style={{
 width: 4,
 height: 4,
 borderRadius: 999,
 background: "#EDE6D8",
 boxShadow: "0 0 12px rgba(227, 108, 73, 0.85)",
 }}
 />
 </motion.div>

 {/* Morphing pill */}
 <motion.div
 className="cursor-follower fixed pointer-events-none"
 style={{
 left: pos.x,
 top: pos.y,
 zIndex: 9998,
 translateX: "-50%",
 translateY: "-50%",
 }}
 animate={{
 rotate: pillRotate,
 scale,
 }}
 transition={{
 type: "spring",
 stiffness: 220,
 damping: 22,
 rotate: { duration: 0.35, ease: [0.22, 0.65, 0.34, 1] },
 }}
 >
 <motion.div
 animate={{
 width: pillWidth,
 height: pillHeight,
 }}
 transition={{ type: "spring", stiffness: 240, damping: 22 }}
 style={{
 borderRadius: 999,
 background:
 "linear-gradient(135deg, #e36c49 0%, #e1b049 55%, #aac8b7 100%)",
 boxShadow: hovering
 ? "0 0 22px rgba(227, 108, 73, 0.55), 0 0 40px rgba(225, 176, 73, 0.25)"
 : "0 0 14px rgba(227, 108, 73, 0.45)",
 mixBlendMode: "screen",
 opacity: 0.92,
 }}
 />
 </motion.div>

 {/* Subtle outer halo on hover */}
 <motion.div
 className="cursor-follower fixed pointer-events-none"
 style={{
 left: pos.x,
 top: pos.y,
 zIndex: 9997,
 translateX: "-50%",
 translateY: "-50%",
 }}
 animate={{
 opacity: hovering ? 0.55 : 0,
 scale: hovering ? 1 : 0.6,
 }}
 transition={{ duration: 0.3 }}
 >
 <div
 style={{
 width: 64,
 height: 64,
 borderRadius: 999,
 background:
 "radial-gradient(circle, rgba(227,108,73,0.22) 0%, transparent 65%)",
 filter: "blur(8px)",
 }}
 />
 </motion.div>
 </>
 );
}
