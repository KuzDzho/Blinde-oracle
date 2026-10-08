/**
 * Быстрый детерминированный генератор (Mulberry32).
 * Один и тот же seed всегда даёт одну и ту же последовательность
 * на любой платформе, без SecureRandom и без Math.random.
 */
export class DetRng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** Число в полуинтервале [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Целое в диапазоне [0, max). */
  int(max: number): number {
    if (max <= 0) return 0;
    return Math.floor(this.next() * max);
  }

  /** Целое в диапазоне [min, max]. */
  intRange(min: number, max: number): number {
    if (max <= min) return min;
    return min + this.int(max - min + 1);
  }

  /** Случайный элемент непустого массива. */
  pick<T>(items: readonly T[]): T {
    return items[this.int(items.length)] as T;
  }

  /** Перемешанная копия массива. */
  shuffle<T>(items: readonly T[]): T[] {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = this.int(i + 1);
      const current = copy[i] as T;
      copy[i] = copy[j] as T;
      copy[j] = current;
    }
    return copy;
  }
}

/**
 * FNV-1a, 32 бита. Одинаково считает строки на всех платформах.
 */
export function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
