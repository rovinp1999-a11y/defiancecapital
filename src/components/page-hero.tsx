import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MeshGradient } from "@/components/mesh-gradient";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24",
        className,
      )}
    >
      <MeshGradient />
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />

      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {eyebrow && (
            <motion.p
              className="eyebrow eyebrow-dot mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {eyebrow}
            </motion.p>
          )}
          <h1 className="display-1 text-[clamp(40px,6vw,84px)] text-balance">
            {title}
          </h1>
          {description && (
            <motion.p
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl text-balance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {description}
            </motion.p>
          )}
          {actions && (
            <motion.div
              className="mt-9 flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {actions}
            </motion.div>
          )}
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
