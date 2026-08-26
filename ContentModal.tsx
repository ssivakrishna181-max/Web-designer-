"use client";
import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { open: boolean; title: string; eyebrow?: string; onClose: () => void; children: ReactNode };

export function ContentModal({ open, title, eyebrow, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = previous; };
  }, [open, onClose]);

  return <AnimatePresence>
    {open && <motion.div className="content-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="content-modal-panel" initial={{ opacity: 0, y: 28, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} transition={{ duration: .25 }}>
        <button className="content-modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        <div className="content-modal-body">{children}</div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}
