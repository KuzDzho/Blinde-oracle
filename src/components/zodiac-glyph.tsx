import type { ZodiacSign } from "@/lib/oracle/zodiac";
import { cn } from "@/lib/utils";

const PATHS: Record<ZodiacSign, string> = {
  ARIES:
    "M4.5 19c0-6.5 2.8-11 5.2-11 1.4 0 2.3 1.6 2.3 4.2 0-2.6.9-4.2 2.3-4.2 2.4 0 5.2 4.5 5.2 11",
  TAURUS:
    "M7 9.2c0-3.4 10-3.4 10 0 M12 11.2a5.2 5.2 0 1 0 0.01 0",
  GEMINI:
    "M7 4.5h10 M7 19.5h10 M9 4.5v15 M15 4.5v15",
  CANCER:
    "M9 8.5c-3.2 0-3.8 7 0 7 M9 8.5a2 2 0 1 0 0.01 0 M15 15.5c3.2 0 3.8-7 0-7 M15 15.5a2 2 0 1 0 0.01 0",
  LEO:
    "M8 14.5a4.2 4.2 0 1 0 0.01 0 M12.2 14.5c2.8 0 5.3-2 5.3-5.2 0-2-1.2-3.3-2.8-3.3",
  VIRGO:
    "M5.5 20V7.5c0-2 1.3-3 2.6-3s2.6 1 2.6 3V20 M10.7 7.5c0-2 1.3-3 2.6-3s2.6 1 2.6 3v8.5c0 2.4 2.2 3.6 4.1 2.2",
  LIBRA:
    "M5 16.5h14 M5 19.5h14 M8 16.5V14c0-3.2 8-3.2 8 0v2.5",
  SCORPIO:
    "M5.5 20V7.5c0-2 1.3-3 2.6-3s2.6 1 2.6 3V20 M10.7 7.5c0-2 1.3-3 2.6-3s2.6 1 2.6 3v9.2c2.2 0 3.8-1.4 4.6-3.2",
  SAGITTARIUS:
    "M7 17L17.5 6.5 M11.5 6.5h6v6 M6.5 12.5l5 5",
  CAPRICORN:
    "M5 8.5c2.2-3.4 5.2-3.6 6.4 0v9.2c0 2.6 2.4 4.2 4.8 3.2 1.8-.8 2.6-2.6 1.6-4.2-.8-1.2-2.4-1.2-3.2 0",
  AQUARIUS:
    "M4.5 10.5l2.2-2 2.2 2 2.2-2 2.2 2 2.2-2 2.2 2 M4.5 15.5l2.2-2 2.2 2 2.2-2 2.2 2 2.2-2 2.2 2",
  PISCES:
    "M6 6c4 3.2 4 8.8 0 12 M18 6c-4 3.2-4 8.8 0 12 M7.5 12h9",
};

export function ZodiacGlyph({
  sign,
  className,
}: {
  sign: ZodiacSign;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-8", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[sign]} />
    </svg>
  );
}
