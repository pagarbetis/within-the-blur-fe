import React from "react";
import { motion } from "framer-motion";

export default function Reveal({
 children,
 delay = 0,
 y = 30,
 duration = 0.8,
 once = true,
 className = "",
 testId,
}) {
 return (
 <motion.div
 initial={{ opacity: 0, y }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once, margin: "-60px" }}
 transition={{ duration, delay, ease: [0.22, 0.65, 0.34, 1] }}
 className={className}
 data-testid={testId}
 >
 {children}
 </motion.div>
 );
}
