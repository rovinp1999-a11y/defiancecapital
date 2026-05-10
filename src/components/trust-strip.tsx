import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const BACKERS = [
  "Paradigm",
  "Variant",
  "Multicoin",
  "Polychain",
  "1confirmation",
  "Robot Ventures",
];

const AUDITORS = [
  { name: "Trail of Bits", date: "Aug 2025" },
  { name: "OpenZeppelin", date: "Sep 2025" },
  { name: "Code4rena", date: "Oct 2025" },
];

export function TrustStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "container-page",
        className,
      )}
    >
      <div className="surface rounded-2xl px-6 py-7 md:px-10 md:py-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3">
            <p className="eyebrow eyebrow-dot mb-2">Backed & audited</p>
            <p className="font-display font-semibold text-lg leading-tight">
              The right partners are{" "}
              <span className="font-serif italic font-normal text-muted-foreground">
                already in.
              </span>
            </p>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
              Backed by
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {BACKERS.map((b) => (
                <span
                  key={b}
                  className="font-display text-sm font-medium tracking-tight text-muted-foreground/80 hover:text-foreground transition-colors"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
              Audited by
            </p>
            <div className="flex flex-wrap gap-2">
              {AUDITORS.map((a) => (
                <div
                  key={a.name}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md surface-muted text-[11px]"
                >
                  <ShieldCheck className="h-3 w-3 text-[hsl(var(--success))]" />
                  <span className="font-medium">{a.name}</span>
                  <span className="text-muted-foreground tabular">{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
