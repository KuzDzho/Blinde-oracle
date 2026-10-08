import { cn } from "@/lib/utils";

export function HairlineDiamond({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className="hairline flex-1" />
      <span className="size-1.5 rotate-45 bg-gold" />
      <span className="hairline flex-1" />
    </div>
  );
}

export function FourPointStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-3.5", className)} aria-hidden="true">
      <path
        d="M8 0.6 L9.1 6.9 L15.4 8 L9.1 9.1 L8 15.4 L6.9 9.1 L0.6 8 L6.9 6.9 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Crescent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden="true">
      <path
        d="M14.2 3.2a9 9 0 1 0 6.6 14.4 8 8 0 1 1-6.6-14.4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function VenusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden="true">
      <circle cx="12" cy="9" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 13.2v7M9 17.4h6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function SparkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden="true">
      <path
        d="M12 2.5l1.2 6.3L19.5 10 13.2 11.2 12 17.5 10.8 11.2 4.5 10l6.3-1.2z"
        fill="currentColor"
      />
    </svg>
  );
}
