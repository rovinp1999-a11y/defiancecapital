import { useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NProgress-style top loading bar that watches global query activity.
 */
export function LoadingBar() {
  const fetching = useIsFetching();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (fetching > 0) {
      setShow(true);
    } else {
      // Let the bar finish its animation before hiding
      const t = setTimeout(() => setShow(false), 320);
      return () => clearTimeout(t);
    }
  }, [fetching]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ scaleX: 0, opacity: 0.95 }}
          animate={
            fetching > 0
              ? {
                  scaleX: [0, 0.6, 0.85, 0.92],
                  opacity: 1,
                  transition: { duration: 1.6, ease: "easeOut" },
                }
              : { scaleX: 1, opacity: 0, transition: { duration: 0.3 } }
          }
          exit={{ opacity: 0 }}
          style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.6)" }}
        />
      )}
    </AnimatePresence>
  );
}
